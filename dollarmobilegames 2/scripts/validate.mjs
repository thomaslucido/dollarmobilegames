// Validates www/games.json and every game folder against PLAYBOOK.md.
// Exit code 1 on any blocking problem. Usage: node scripts/validate.mjs
import { readFileSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const errors = [];
const warn = [];
const games = JSON.parse(readFileSync('www/games.json', 'utf8'));

// collect every charting title we have seen
const chartTitles = new Set();
if (existsSync('data/trends')) {
  for (const f of readdirSync('data/trends').filter((f) => f.endsWith('.json'))) {
    try {
      const d = JSON.parse(readFileSync(join('data/trends', f), 'utf8'));
      for (const list of Object.values(d.charts || {})) if (Array.isArray(list)) list.forEach((g) => g.name && chartTitles.add(g.name));
    } catch (e) { warn.push(`could not read ${f}`); }
  }
}
const STOP = new Set(['the', 'a', 'an', 'of', 'and', 'game', 'games', 'puzzle', 'go', 'my', 'in', 'on', 'to', 'for', 'with', 'by', 'io', 'pro', 'free', 'hd', 'run', 'rush', 'master', 'match', 'block', 'jam', 'story', 'world', 'idle', 'merge', 'sort', 'stack', 'hero', 'heroes', 'battle', 'craft', 'simulator', 'tycoon', 'blast', 'saga', 'land', 'royale', 'mania', 'quest', 'legends', 'war', 'wars', 'city', 'king', 'kingdom', 'farm', 'dash', 'drift', 'tiles', 'words']);
const words = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w));
const squash = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, '');
function lev(a, b) {
  const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
  for (let j = 1; j <= b.length; j++) m[0][j] = j;
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
    m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
  return m[a.length][b.length];
}
function nameClash(name) {
  const mine = words(name), sq = squash(name);
  for (const t of chartTitles) {
    const head = t.split(/[:\-–—|]/)[0];
    const theirs = words(head);
    const shared = mine.filter((w) => theirs.some((x) => x === w || (w.length > 4 && lev(w, x) <= 1)));
    if (shared.length) return `${t} (shares "${shared.join(', ')}")`;
    const hs = squash(head);
    if (hs.length > 4 && lev(sq, hs) <= Math.max(2, Math.floor(hs.length * 0.25))) return `${t} (sounds alike)`;
  }
  return null;
}

const slugs = new Set();
const bundles = new Set();
const CATS = ['GAMES_ACTION', 'GAMES_ADVENTURE', 'GAMES_ARCADE', 'GAMES_BOARD', 'GAMES_CARD', 'GAMES_CASUAL', 'GAMES_FAMILY', 'GAMES_MUSIC', 'GAMES_PUZZLE', 'GAMES_RACING', 'GAMES_ROLE_PLAYING', 'GAMES_SIMULATION', 'GAMES_SPORTS', 'GAMES_STRATEGY', 'GAMES_TRIVIA', 'GAMES_WORD'];
for (const g of games) {
  const where = `games.json[${g.slug}]`;
  for (const k of ['slug', 'name', 'tagline', 'genre', 'added', 'accent', 'bundleId', 'status']) if (!g[k]) errors.push(`${where}: missing ${k}`);
  if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(g.slug || '')) errors.push(`${where}: slug must be kebab-case`);
  if (slugs.has(g.slug)) errors.push(`${where}: duplicate slug`); slugs.add(g.slug);
  const wantBundle = 'com.thomaslucido.' + (g.slug || '').replace(/-/g, '');
  if (g.bundleId !== wantBundle) errors.push(`${where}: bundleId should be ${wantBundle}`);
  if (bundles.has(g.bundleId)) errors.push(`${where}: duplicate bundleId`); bundles.add(g.bundleId);
  if (!['built', 'queued', 'submitted'].includes(g.status)) errors.push(`${where}: status must be built, queued or submitted`);
  if ((g.tagline || '').length > 60) errors.push(`${where}: tagline over 60 chars`);
  const clash = nameClash(g.name || '');
  if (clash) errors.push(`${where}: name "${g.name}" overlaps charting title ${clash}`);

  // App Store listing
  const sp = join('www/games', g.slug || '', 'store.json');
  if (!existsSync(sp)) errors.push(`${where}: missing ${sp}`);
  else {
    let st = {};
    try { st = JSON.parse(readFileSync(sp, 'utf8')); } catch (e) { errors.push(`${sp}: invalid JSON`); }
    for (const k of ['appName', 'subtitle', 'description', 'keywords', 'promo', 'category', 'reviewNote']) if (!st[k]) errors.push(`${sp}: missing ${k}`);
    if ((st.appName || '').length > 30) errors.push(`${sp}: appName over 30 chars`);
    if ((st.subtitle || '').length > 30) errors.push(`${sp}: subtitle over 30 chars`);
    if ((st.keywords || '').length > 100) errors.push(`${sp}: keywords over 100 chars`);
    if ((st.promo || '').length > 170) errors.push(`${sp}: promo over 170 chars`);
    if ((st.description || '').length > 4000) errors.push(`${sp}: description over 4000 chars`);
    if (st.category && !CATS.includes(st.category)) errors.push(`${sp}: category must be one of ${CATS.join(', ')}`);
    const listing = [st.appName, st.subtitle, st.keywords, st.promo].join(' ');
    if (/\$\s?\d|\b\d+(\.\d+)?\s?(usd|dollars?|cents?)\b|\bfree\b/i.test(listing)) errors.push(`${sp}: no prices or "free" in name, subtitle, keywords or promo`);
    const sclash = nameClash(st.appName || '');
    if (sclash) errors.push(`${sp}: appName overlaps charting title ${sclash}`);
    const kw = (st.keywords || '').toLowerCase().split(',').map((k) => k.trim());
    for (const t of chartTitles) { const h = t.toLowerCase().split(/[:\-–—|]/)[0].trim(); if (h.length > 3 && kw.includes(h)) errors.push(`${sp}: keyword "${h}" is another game's name`); }
  }
  for (const f of ['app/icon.png', 'app/splash.png', 'store/01.png', 'store/02.png', 'store/03.png'])
    if (!existsSync(join('www/games', g.slug || '', f))) errors.push(`${where}: missing ${f} (run node scripts/shoot.mjs ${g.slug})`);

  const dir = join('www/games', g.slug);
  for (const f of ['index.html', 'DESIGN.md', 'icon.svg']) if (!existsSync(join(dir, f))) errors.push(`${where}: missing ${dir}/${f}`);
  if (existsSync(dir)) {
    let bytes = 0;
    const walk = (d) => readdirSync(d).forEach((f) => {
      const p = join(d, f), st = statSync(p);
      if (st.isDirectory()) return walk(p);
      if (!/[\\/](app|store)$/.test(d)) bytes += st.size;
      if (/\.(html|js|css|svg)$/.test(f)) {
        const src = readFileSync(p, 'utf8');
        if (/(src|href)\s*=\s*["']?\s*(https?:)?\/\//i.test(src) || /\b(fetch|XMLHttpRequest|WebSocket|sendBeacon)\s*\(/.test(src) || /url\(\s*["']?https?:/i.test(src))
          errors.push(`${p}: external network reference (games must be fully offline)`);
        if (/\b(analytics|gtag|firebase|admob|facebook)\b/i.test(src)) errors.push(`${p}: tracking/ads code is not allowed`);
      }
    });
    walk(dir);
    if (bytes > 1.5 * 1024 * 1024) errors.push(`${where}: folder is ${(bytes / 1048576).toFixed(2)} MB (limit 1.5 MB)`);
    const html = existsSync(join(dir, 'index.html')) ? readFileSync(join(dir, 'index.html'), 'utf8') : '';
    if (!html.includes('shared/game-kit.js')) errors.push(`${where}: index.html must load ../../shared/game-kit.js`);
    if (!/GameKit\.init\(/.test(html)) errors.push(`${where}: index.html must call GameKit.init`);
    if (!/window\.__game\s*=/.test(html)) errors.push(`${where}: index.html must expose window.__game for playtests`);
  }
}

// genre variety: last 6 games should not repeat a genre
const recent = games.slice().sort((a, b) => (a.added || '').localeCompare(b.added || '')).slice(-6).map((g) => (g.genre || '').toLowerCase());
const dup = recent.find((g, i) => recent.indexOf(g) !== i);
if (dup) warn.push(`genre "${dup}" repeats within the last 6 games (Apple 4.3 spam risk)`);

warn.forEach((w) => console.log('warn:', w));
if (errors.length) { errors.forEach((e) => console.log('FAIL:', e)); console.log(`\n${errors.length} problem(s).`); process.exit(1); }
console.log(`OK: ${games.length} game(s) valid, ${chartTitles.size} charting titles checked for name overlap.`);
