// App Store Connect API helper for the deploy workflow.
//   node scripts/asc.mjs status        -> prints JSON {busy, hasLiveVersion, appId}; busy = a version is in review
//   node scripts/asc.mjs ensure-iaps   -> creates/configures a $0.99 non-consumable IAP for every paid game
//   node scripts/asc.mjs submit-iaps   -> submits IAPs that are ready (only after the app has a live version)
// Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8 (contents of the .p8), optional ASC_APP_ID, BUNDLE_ID.
import { createSign, createHash } from 'node:crypto';
import { readFileSync, existsSync, statSync, appendFileSync } from 'node:fs';

const { ASC_KEY_ID, ASC_ISSUER_ID } = process.env;
const P8 = (process.env.ASC_KEY_P8 || '').includes('BEGIN') ? process.env.ASC_KEY_P8 : Buffer.from(process.env.ASC_KEY_P8 || '', 'base64').toString('utf8');
const BUNDLE_ID = process.env.BUNDLE_ID || 'com.thomaslucido.dollararcade';
const API = 'https://api.appstoreconnect.apple.com';
const summary = (s) => { console.log(s); if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, s + '\n'); };

function token() {
  const b64 = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const head = b64({ alg: 'ES256', kid: ASC_KEY_ID, typ: 'JWT' });
  const body = b64({ iss: ASC_ISSUER_ID, iat: now, exp: now + 1100, aud: 'appstoreconnect-v1' });
  const sig = createSign('SHA256').update(`${head}.${body}`).sign({ key: P8, dsaEncoding: 'ieee-p1363' }).toString('base64url');
  return `${head}.${body}.${sig}`;
}

async function asc(method, path, body) {
  const res = await fetch(path.startsWith('http') ? path : API + path, {
    method, headers: { Authorization: `Bearer ${token()}`, 'Content-Type': 'application/json' }, body: body ? JSON.stringify(body) : undefined,
  });
  const text = await res.text();
  const json = text ? JSON.parse(text) : {};
  if (!res.ok) { const e = new Error(`${method} ${path} -> ${res.status}: ${JSON.stringify(json.errors || json).slice(0, 600)}`); e.status = res.status; throw e; }
  return json;
}

async function appId() {
  if (process.env.ASC_APP_ID) return process.env.ASC_APP_ID;
  const r = await asc('GET', `/v1/apps?filter[bundleId]=${BUNDLE_ID}`);
  if (!r.data.length) throw new Error(`No App Store Connect app with bundle id ${BUNDLE_ID}. Create the app record first (see SETUP.md).`);
  return r.data[0].id;
}

async function status() {
  const id = await appId();
  const v = await asc('GET', `/v1/apps/${id}/appStoreVersions?limit=20`);
  const states = v.data.map((x) => x.attributes.appStoreState || x.attributes.appVersionState);
  const busy = states.some((s) => ['WAITING_FOR_REVIEW', 'IN_REVIEW', 'PENDING_DEVELOPER_RELEASE', 'PROCESSING_FOR_APP_STORE', 'WAITING_FOR_EXPORT_COMPLIANCE', 'PENDING_APPLE_RELEASE'].includes(s));
  const hasLiveVersion = states.some((s) => ['READY_FOR_SALE', 'READY_FOR_DISTRIBUTION', 'REPLACED_WITH_NEW_VERSION'].includes(s));
  const out = { appId: id, busy, hasLiveVersion, states };
  console.log(JSON.stringify(out));
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `busy=${busy}\nlive=${hasLiveVersion}\napp_id=${id}\n`);
  return out;
}

const paidGames = () => JSON.parse(readFileSync('www/games.json', 'utf8')).filter((g) => !g.free && g.productId);
const designNote = (slug) => {
  const p = `www/games/${slug}/DESIGN.md`;
  const m = existsSync(p) && readFileSync(p, 'utf8').match(/\*\*Review note:\*\*\s*(.+)/);
  return (m && m[1].trim()) || 'Tap the game on the arcade shelf, buy it for $0.99, and it unlocks permanently. Restore Purchases is on the home screen.';
};

async function findIap(app, productId) {
  const r = await asc('GET', `/v1/apps/${app}/inAppPurchasesV2?filter[productId]=${encodeURIComponent(productId)}&limit=5`);
  return r.data[0] || null;
}

async function localize(iap, g) {
  const attrs = { locale: 'en-US', name: g.name.slice(0, 30), description: g.tagline.slice(0, 45) };
  try {
    // API 4.4.1+: localizations hang off an IAP version
    const ver = await asc('POST', '/v1/inAppPurchaseVersions', { data: { type: 'inAppPurchaseVersions', relationships: { inAppPurchase: { data: { type: 'inAppPurchases', id: iap.id } } } } });
    await asc('POST', '/v2/inAppPurchaseLocalizations', { data: { type: 'inAppPurchaseLocalizations', attributes: attrs, relationships: { version: { data: { type: 'inAppPurchaseVersions', id: ver.data.id } } } } });
  } catch (e) {
    if (![404, 405].includes(e.status)) throw e;
    await asc('POST', '/v1/inAppPurchaseLocalizations', { data: { type: 'inAppPurchaseLocalizations', attributes: attrs, relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iap.id } } } } });
  }
}

async function price(iap) {
  let next = `/v2/inAppPurchases/${iap.id}/pricePoints?filter[territory]=USA&limit=200`, point = null;
  while (next && !point) {
    const r = await asc('GET', next);
    point = r.data.find((p) => p.attributes.customerPrice === '0.99');
    next = r.links && r.links.next;
  }
  if (!point) throw new Error('Could not find the USD 0.99 price point');
  await asc('POST', '/v1/inAppPurchasePriceSchedules', {
    data: { type: 'inAppPurchasePriceSchedules', relationships: {
      inAppPurchase: { data: { type: 'inAppPurchases', id: iap.id } },
      baseTerritory: { data: { type: 'territories', id: 'USA' } },
      manualPrices: { data: [{ type: 'inAppPurchasePrices', id: '${p1}' }] } } },
    included: [{ type: 'inAppPurchasePrices', id: '${p1}', attributes: { startDate: null },
      relationships: { inAppPurchasePricePoint: { data: { type: 'inAppPurchasePricePoints', id: point.id } } } }],
  });
}

async function availability(iap) {
  const terr = [];
  let next = '/v1/territories?limit=200';
  while (next) { const r = await asc('GET', next); terr.push(...r.data.map((t) => ({ type: 'territories', id: t.id }))); next = r.links && r.links.next; }
  await asc('POST', '/v1/inAppPurchaseAvailabilities', { data: { type: 'inAppPurchaseAvailabilities', attributes: { availableInNewTerritories: true },
    relationships: { inAppPurchase: { data: { type: 'inAppPurchases', id: iap.id } }, availableTerritories: { data: terr } } } });
}

async function reviewShot(iap, slug) {
  const file = `www/games/${slug}/review.png`;
  if (!existsSync(file)) throw new Error(`${file} missing`);
  const buf = readFileSync(file);
  const r = await asc('POST', '/v1/inAppPurchaseAppStoreReviewScreenshots', { data: { type: 'inAppPurchaseAppStoreReviewScreenshots',
    attributes: { fileName: 'review.png', fileSize: statSync(file).size }, relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iap.id } } } } });
  for (const op of r.data.attributes.uploadOperations) {
    const headers = Object.fromEntries((op.requestHeaders || []).map((h) => [h.name, h.value]));
    const res = await fetch(op.url, { method: op.method, headers, body: buf.subarray(op.offset, op.offset + op.length) });
    if (!res.ok) throw new Error(`screenshot upload failed ${res.status}`);
  }
  await asc('PATCH', `/v1/inAppPurchaseAppStoreReviewScreenshots/${r.data.id}`, { data: { type: 'inAppPurchaseAppStoreReviewScreenshots', id: r.data.id,
    attributes: { uploaded: true, sourceFileChecksum: createHash('md5').update(buf).digest('hex') } } });
}

async function ensureIaps() {
  const app = await appId();
  for (const g of paidGames()) {
    let iap = await findIap(app, g.productId);
    if (iap) { console.log(`ok   ${g.productId} (${iap.attributes.state})`); continue; }
    console.log(`new  ${g.productId}`);
    const r = await asc('POST', '/v2/inAppPurchases', { data: { type: 'inAppPurchases',
      attributes: { name: g.name.slice(0, 64), productId: g.productId, inAppPurchaseType: 'NON_CONSUMABLE', reviewNote: designNote(g.slug), familySharable: true },
      relationships: { app: { data: { type: 'apps', id: app } } } } });
    iap = r.data;
    await localize(iap, g);
    await price(iap);
    await availability(iap);
    await reviewShot(iap, g.slug);
    summary(`- Created in-app purchase **${g.name}** (${g.productId}) at $0.99`);
  }
}

async function submitIaps() {
  const st = await status();
  if (!st.hasLiveVersion) {
    summary('- First release: Apple requires the first in-app purchase to be submitted together with the app version in App Store Connect (one time only). See SETUP.md step 6.');
    return;
  }
  const r = await asc('GET', `/v1/apps/${st.appId}/inAppPurchasesV2?limit=200`);
  const ready = r.data.filter((i) => ['READY_TO_SUBMIT', 'PREPARE_FOR_SUBMISSION'].includes(i.attributes.state));
  if (!ready.length) return console.log('no in-app purchases waiting to submit');
  for (const iap of ready) {
    try {
      await asc('POST', '/v1/inAppPurchaseSubmissions', { data: { type: 'inAppPurchaseSubmissions', relationships: { inAppPurchaseV2: { data: { type: 'inAppPurchases', id: iap.id } } } } });
      summary(`- Submitted in-app purchase ${iap.attributes.productId} for review`);
    } catch (e) { summary(`- Could not submit ${iap.attributes.productId}: ${e.message}`); process.exitCode = 1; }
  }
}

const cmd = process.argv[2];
if (!ASC_KEY_ID || !ASC_ISSUER_ID || !P8) { console.log('App Store Connect secrets are not set; skipping.'); process.exit(cmd === 'status' ? 3 : 0); }
const run = { status, 'ensure-iaps': ensureIaps, 'submit-iaps': submitIaps }[cmd];
if (!run) { console.log('usage: node scripts/asc.mjs status|ensure-iaps|submit-iaps'); process.exit(2); }
await run().catch((e) => { console.error(e.message); process.exit(1); });
