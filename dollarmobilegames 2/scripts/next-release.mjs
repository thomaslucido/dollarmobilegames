// Prints the slug that should ship next (first "queued" entry in data/ship-queue.json),
// or nothing. With --record, marks it submitted in the queue, games.json and releases.json.
import { readFileSync, writeFileSync, appendFileSync } from 'node:fs';
const q = JSON.parse(readFileSync('data/ship-queue.json', 'utf8'));
const next = q.queue.find((e) => e.status === 'queued');
if (process.argv[2] === '--record') {
  if (!next) process.exit(0);
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Detroit' });
  next.status = 'submitted'; next.submittedOn = today;
  writeFileSync('data/ship-queue.json', JSON.stringify(q, null, 2) + '\n');
  const games = JSON.parse(readFileSync('www/games.json', 'utf8'));
  const g = games.find((x) => x.slug === next.slug); if (g) g.status = 'submitted';
  writeFileSync('www/games.json', JSON.stringify(games, null, 2) + '\n');
  const r = JSON.parse(readFileSync('data/releases.json', 'utf8'));
  r.history.push({ slug: next.slug, bundleId: g && g.bundleId, version: process.env.APP_VERSION || '1.0', build: process.env.BUILD_NUMBER || '', date: today });
  r.released = [...new Set([...(r.released || []), next.slug])];
  writeFileSync('data/releases.json', JSON.stringify(r, null, 2) + '\n');
  console.log(`recorded ${next.slug} as submitted`);
} else {
  const slug = next ? next.slug : '';
  console.log(slug || '(nothing queued)');
  if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `slug=${slug}\n`);
}
