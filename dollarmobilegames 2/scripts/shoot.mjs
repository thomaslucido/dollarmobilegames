// Renders a game's App Store assets with Playwright:
//   node scripts/shoot.mjs <slug>
//   -> www/games/<slug>/app/icon.png (1024, no transparency), app/splash.png (2732),
//      store/01.png title screen, 02.png and 03.png gameplay (1290x2796, 6.7"/6.9" iPhone size)
import { mkdirSync, readFileSync } from 'node:fs';
import { serve, browser } from './serve.mjs';

const slug = process.argv[2];
if (!slug) { console.log('usage: node scripts/shoot.mjs <slug>'); process.exit(2); }
const dir = `www/games/${slug}`;
mkdirSync(`${dir}/app`, { recursive: true }); mkdirSync(`${dir}/store`, { recursive: true });
const srv = await serve();
const b = await browser();

// ---- store screenshots ----
const page = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });
await page.addInitScript(() => { window.GAMEKIT_STANDALONE = true; });
await page.goto(`${srv.url}/games/${slug}/index.html`);
await page.waitForTimeout(1200);
await page.screenshot({ path: `${dir}/store/01.png` });
const state = () => page.evaluate(() => (window.__game ? window.__game.state() : {}));
const hold = async (ms) => { await page.mouse.move(215, 520); await page.mouse.down(); await page.waitForTimeout(ms); await page.mouse.up(); };
await hold(60); await page.waitForTimeout(200);
const hasDemo = await page.evaluate(() => !!(window.__game && window.__game.demo));
if (hasDemo) await page.evaluate(() => window.__game.demo(true));

// Play with a gentle rhythm; restart on game over so the shots show live play.
async function playFor(ms) {
  const t0 = Date.now();
  while (Date.now() - t0 < ms) {
    const s = await state();
    if (s.mode === 'over') { await page.waitForTimeout(700); await hold(60); await page.waitForTimeout(150); continue; }
    if (hasDemo) { await page.waitForTimeout(250); continue; }
    await hold(90 + Math.random() * 160); await page.waitForTimeout(110 + Math.random() * 160);
  }
}
async function shotWhilePlaying(path, tries = 8) {
  for (let i = 0; i < tries; i++) {
    await playFor(1800);
    if ((await state()).mode === 'play') return page.screenshot({ path });
  }
  return page.screenshot({ path }); // best effort; the build night reviews these
}
await shotWhilePlaying(`${dir}/store/02.png`);
await playFor(hasDemo ? 6000 : 0);
await shotWhilePlaying(`${dir}/store/03.png`);

// ---- app icon + splash from icon.svg ----
const svg = readFileSync(`${dir}/icon.svg`, 'utf8');
const sized = (n, extra = '') => svg.replace('<svg ', `<svg width="${n}" height="${n}" ${extra} `);
const top = await page.evaluate(() => {
  const c = document.querySelector('canvas'); if (!c) return getComputedStyle(document.body).backgroundColor;
  const d = c.getContext('2d').getImageData(4, 4, 1, 1).data; return `rgb(${d[0]},${d[1]},${d[2]})`;
}).catch(() => '#111');
let p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
await p.setContent(`<style>html,body{margin:0;background:${top}}</style>${sized(1024)}`);
await p.screenshot({ path: `${dir}/app/icon.png`, omitBackground: false });
p = await b.newPage({ viewport: { width: 2732, height: 2732 } });
await p.setContent(`<style>html,body{margin:0;height:2732px;background:${top};display:flex;align-items:center;justify-content:center}</style>${sized(640, 'style="border-radius:140px"')}`);
await p.screenshot({ path: `${dir}/app/splash.png` });

await b.close(); srv.close();
console.log(`wrote ${dir}/app/icon.png, app/splash.png, store/01-03.png`);
