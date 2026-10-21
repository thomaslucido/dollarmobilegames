// Generates Apple screenshots with Playwright:
//   node scripts/shoot.mjs <slug>   -> www/games/<slug>/review.png (IAP review shot, 1290x2796)
//   node scripts/shoot.mjs --store  -> fastlane/screenshots/en-US/*.png (arcade + newest games)
import { mkdirSync, readFileSync, readdirSync, unlinkSync } from 'node:fs';
import { serve, browser } from './serve.mjs';

const arg = process.argv[2];
const srv = await serve();
const b = await browser();
const page = await b.newPage({ viewport: { width: 430, height: 932 }, deviceScaleFactor: 3, hasTouch: true, isMobile: true });

async function gameShot(slug, path) {
  await page.goto(`${srv.url}/games/${slug}/index.html`);
  await page.waitForTimeout(700);
  await page.mouse.click(215, 520); // start
  for (let i = 0; i < 14; i++) { await page.mouse.move(215, 500); await page.mouse.down(); await page.waitForTimeout(120); await page.mouse.up(); await page.waitForTimeout(140); }
  const s = await page.evaluate(() => window.__game && window.__game.state());
  if (s && s.mode === 'over') { await page.mouse.click(215, 520); await page.waitForTimeout(500); }
  await page.screenshot({ path });
}

if (arg === '--store') {
  const dir = 'fastlane/screenshots/en-US'; mkdirSync(dir, { recursive: true });
  for (const f of readdirSync(dir)) if (f.endsWith('.png')) unlinkSync(`${dir}/${f}`);
  await page.goto(`${srv.url}/index.html?shot`); await page.waitForTimeout(800);
  await page.screenshot({ path: `${dir}/01_arcade_APP_IPHONE_67.png` });
  const games = JSON.parse(readFileSync('www/games.json', 'utf8')).sort((a, c) => (c.added || '').localeCompare(a.added || '')).slice(0, 4);
  let n = 2;
  for (const g of games) await gameShot(g.slug, `${dir}/0${n++}_${g.slug}_APP_IPHONE_67.png`);
  console.log('store screenshots written to', dir);
} else if (arg) {
  await gameShot(arg, `www/games/${arg}/review.png`);
  console.log(`wrote www/games/${arg}/review.png`);
} else console.log('usage: node scripts/shoot.mjs <slug> | --store');
await b.close(); srv.close();
