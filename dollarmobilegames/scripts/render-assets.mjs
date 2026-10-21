// Renders resources/icon.svg into the PNGs the iOS build needs (icon 1024, splash 2732).
// Usage: node scripts/render-assets.mjs
import { readFileSync, copyFileSync } from 'node:fs';
import { browser } from './serve.mjs';
const b = await browser();
const svg = readFileSync('resources/icon.svg', 'utf8');
let p = await b.newPage({ viewport: { width: 1024, height: 1024 } });
await p.setContent(`<style>body{margin:0}</style>${svg.replace('<svg ', '<svg width="1024" height="1024" ')}`);
await p.screenshot({ path: 'resources/icon.png', type: 'png', omitBackground: false });
p = await b.newPage({ viewport: { width: 2732, height: 2732 } });
await p.setContent(`<style>body{margin:0;background:#f6f1e7;display:flex;align-items:center;justify-content:center;height:2732px}</style>${svg.replace('<svg ', '<svg width="700" height="700" style="border-radius:150px" ')}`);
await p.screenshot({ path: 'resources/splash.png', type: 'png' });
copyFileSync('resources/splash.png', 'resources/splash-dark.png');
await b.close();
console.log('rendered resources/icon.png, splash.png, splash-dark.png');
