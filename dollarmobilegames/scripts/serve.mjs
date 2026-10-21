// Tiny static server for www/ used by playtest and screenshot scripts.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
const TYPES = { '.html': 'text/html', '.js': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.css': 'text/css', '.mp3': 'audio/mpeg', '.wav': 'audio/wav' };
export function serve(root = 'www') {
  return new Promise((resolve) => {
    const srv = createServer(async (req, res) => {
      const path = normalize(decodeURIComponent(req.url.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
      try {
        const body = await readFile(join(root, path.endsWith('/') ? path + 'index.html' : path));
        res.writeHead(200, { 'content-type': TYPES[extname(path)] || 'application/octet-stream' }); res.end(body);
      } catch { res.writeHead(404); res.end('not found'); }
    }).listen(0, '127.0.0.1', () => resolve({ url: `http://127.0.0.1:${srv.address().port}`, close: () => srv.close() }));
  });
}
export async function browser() {
  const { chromium } = await import('playwright');
  const opts = { args: ['--autoplay-policy=no-user-gesture-required'] };
  try { return await chromium.launch(opts); }
  catch { return await chromium.launch({ ...opts, executablePath: process.env.CHROMIUM_PATH || '/opt/pw-browsers/chromium' }); }
}
