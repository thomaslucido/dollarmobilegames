// Snapshot Apple's US top Games charts into data/trends/<date>.json.
// Runs nightly in GitHub Actions (charts.yml). No auth needed; these are Apple's public feeds.
import { writeFileSync, mkdirSync } from 'node:fs';

const FEEDS = {
  topFree: 'https://itunes.apple.com/us/rss/topfreeapplications/limit=100/genre=6014/json',
  topPaid: 'https://itunes.apple.com/us/rss/toppaidapplications/limit=100/genre=6014/json',
  topGrossing: 'https://itunes.apple.com/us/rss/topgrossingapplications/limit=100/genre=6014/json',
};

const date = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Detroit' });
const out = { date, source: 'itunes.apple.com rss, US, Games genre 6014', charts: {} };

for (const [key, url] of Object.entries(FEEDS)) {
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'dollar-arcade-trends/1.0' } });
    const json = await res.json();
    const entries = (json.feed && json.feed.entry) || [];
    out.charts[key] = entries.map((e, i) => ({
      rank: i + 1,
      name: e['im:name']?.label,
      developer: e['im:artist']?.label,
      category: e.category?.attributes?.label,
      price: e['im:price']?.attributes?.amount,
      id: e.id?.attributes?.['im:id'],
      released: e['im:releaseDate']?.label?.slice(0, 10),
      summary: (e.summary?.label || '').slice(0, 280),
    }));
  } catch (err) {
    out.charts[key] = { error: String(err) };
  }
}

mkdirSync('data/trends', { recursive: true });
writeFileSync(`data/trends/${date}.json`, JSON.stringify(out, null, 1));
console.log(`wrote data/trends/${date}.json`, Object.fromEntries(Object.entries(out.charts).map(([k, v]) => [k, Array.isArray(v) ? v.length : 'error'])));
