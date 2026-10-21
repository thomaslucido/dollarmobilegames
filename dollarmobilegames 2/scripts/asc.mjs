// App Store Connect API helper for the per-game app workflows.
//   node scripts/asc.mjs register <slug>  -> registers the game's bundle ID if missing
//   node scripts/asc.mjs app <slug>       -> prints JSON {exists, appId, busy, live}; sets GitHub outputs
//   node scripts/asc.mjs prepare <slug>   -> sets content rights on the app record (best effort)
// Env: ASC_KEY_ID, ASC_ISSUER_ID, ASC_KEY_P8 (contents of the .p8, or base64 of it).
import { createSign } from 'node:crypto';
import { readFileSync, appendFileSync } from 'node:fs';

const { ASC_KEY_ID, ASC_ISSUER_ID } = process.env;
const P8 = (process.env.ASC_KEY_P8 || '').includes('BEGIN') ? process.env.ASC_KEY_P8 : Buffer.from(process.env.ASC_KEY_P8 || '', 'base64').toString('utf8');
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

const game = (slug) => {
  const g = JSON.parse(readFileSync('www/games.json', 'utf8')).find((x) => x.slug === slug);
  if (!g) throw new Error(`${slug} is not in www/games.json`);
  return { ...g, store: JSON.parse(readFileSync(`www/games/${slug}/store.json`, 'utf8')) };
};
const out = (o) => { if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, Object.entries(o).map(([k, v]) => `${k}=${v}`).join('\n') + '\n'); };

async function register(slug) {
  const g = game(slug);
  const r = await asc('GET', `/v1/bundleIds?filter[identifier]=${g.bundleId}&limit=5`);
  if (r.data.some((b) => b.attributes.identifier === g.bundleId)) return console.log(`bundle ID ${g.bundleId} already registered`);
  await asc('POST', '/v1/bundleIds', { data: { type: 'bundleIds', attributes: { identifier: g.bundleId, name: g.store.appName.replace(/[^A-Za-z0-9 ]/g, ''), platform: 'IOS' } } });
  summary(`- Registered bundle ID **${g.bundleId}**`);
}

async function app(slug) {
  const g = game(slug);
  const r = await asc('GET', `/v1/apps?filter[bundleId]=${g.bundleId}`);
  const a = r.data.find((x) => x.attributes.bundleId === g.bundleId);
  if (!a) { const o = { exists: false, appId: '', busy: false, live: false }; console.log(JSON.stringify(o)); out({ exists: false, app_id: '', busy: false }); return o; }
  const v = await asc('GET', `/v1/apps/${a.id}/appStoreVersions?limit=20`);
  const states = v.data.map((x) => x.attributes.appStoreState || x.attributes.appVersionState);
  const busy = states.some((s) => ['WAITING_FOR_REVIEW', 'IN_REVIEW', 'PENDING_DEVELOPER_RELEASE', 'PROCESSING_FOR_APP_STORE', 'PENDING_APPLE_RELEASE', 'WAITING_FOR_EXPORT_COMPLIANCE'].includes(s));
  const live = states.some((s) => ['READY_FOR_SALE', 'READY_FOR_DISTRIBUTION'].includes(s));
  const o = { exists: true, appId: a.id, busy, live, states };
  console.log(JSON.stringify(o)); out({ exists: true, app_id: a.id, busy });
  return o;
}

async function prepare(slug) {
  const a = await app(slug);
  if (!a.exists) throw new Error('app record missing');
  try {
    await asc('PATCH', `/v1/apps/${a.appId}`, { data: { type: 'apps', id: a.appId, attributes: { contentRightsDeclaration: 'DOES_NOT_USE_THIRD_PARTY_CONTENT' } } });
    console.log('content rights set');
  } catch (e) { summary(`- Could not set content rights automatically (${e.message.slice(0, 120)}); set it in App Information if Apple asks.`); }
}

const [cmd, slug] = process.argv.slice(2);
if (!ASC_KEY_ID || !ASC_ISSUER_ID || !P8) { console.log('App Store Connect secrets are not set; skipping.'); process.exit(3); }
const run = { register, app, prepare }[cmd];
if (!run || !slug) { console.log('usage: node scripts/asc.mjs register|app|prepare <slug>'); process.exit(2); }
await run(slug).catch((e) => { console.error(e.message); process.exit(1); });
