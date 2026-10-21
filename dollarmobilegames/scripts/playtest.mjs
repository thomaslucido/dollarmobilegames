// Automated playtest: loads a game on an iPhone-sized viewport, plays it with random
// taps/holds, and checks it starts, runs without errors, reaches game over and restarts.
// Usage: node scripts/playtest.mjs <slug>   (screens saved to .playtest/<slug>/)
import { mkdirSync } from 'node:fs';
import { serve, browser } from './serve.mjs';

const slug = process.argv[2];
if (!slug) { console.log('usage: node scripts/playtest.mjs <slug>'); process.exit(2); }
const outDir = `.playtest/${slug}`; mkdirSync(outDir, { recursive: true });
const srv = await serve();
const b = await browser();
const page = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
const problems = [];
page.on('pageerror', (e) => problems.push('page error: ' + e.message));
page.on('console', (m) => { if (m.type() === 'error') problems.push('console error: ' + m.text()); });
page.on('requestfailed', (r) => problems.push('request failed: ' + r.url()));
page.on('request', (r) => { if (!r.url().startsWith(srv.url)) problems.push('external request: ' + r.url()); });

await page.goto(`${srv.url}/games/${slug}/index.html`);
await page.waitForTimeout(800);
const hasHook = await page.evaluate(() => !!(window.__game && window.__game.state));
if (!hasHook) problems.push('window.__game.state() missing');
const state = () => page.evaluate(() => window.__game ? window.__game.state() : {});
await page.screenshot({ path: `${outDir}/1-title.png` });

const cx = 195, cy = 500;
const tap = async (x = cx, y = cy, hold = 60) => { await page.mouse.move(x, y); await page.mouse.down(); await page.waitForTimeout(hold); await page.mouse.up(); };
await tap();
await page.waitForTimeout(300);
const s1 = await state();
if (s1.mode && s1.mode === 'title') problems.push('tap did not start the game (mode still "title")');

// frame timing
const fps = await page.evaluate(() => new Promise((res) => { let n = 0; const t0 = performance.now(); const f = () => { n++; if (performance.now() - t0 < 1000) requestAnimationFrame(f); else res(n); }; requestAnimationFrame(f); }));
await page.screenshot({ path: `${outDir}/2-play.png` });

// play randomly until game over (max 90s)
let over = false; const t0 = Date.now();
while (Date.now() - t0 < 90000) {
  const s = await state();
  if (s.mode === 'over') { over = true; break; }
  await tap(60 + Math.random() * 270, 200 + Math.random() * 500, 30 + Math.random() * 400);
  await page.waitForTimeout(Math.random() * 300);
}
if (!over) problems.push('never reached game over in 90s of random play (check fail state or expose mode:"over")');
await page.waitForTimeout(900);
await page.screenshot({ path: `${outDir}/3-over.png` });
if (over) {
  await tap(); await page.waitForTimeout(400);
  const s = await state();
  if (s.mode === 'over') problems.push('could not restart from game over with a tap');
}
await b.close(); srv.close();
console.log(`fps ~${fps} (headless; real devices are faster)`);
if (fps < 30) problems.push(`low frame rate in headless run: ${fps}fps`);
if (problems.length) { [...new Set(problems)].forEach((p) => console.log('FAIL:', p)); process.exit(1); }
console.log(`PASS: ${slug} starts, plays, ends and restarts. Screens in ${outDir}/`);
