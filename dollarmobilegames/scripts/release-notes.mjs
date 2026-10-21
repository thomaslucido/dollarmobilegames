// Fills fastlane metadata for a release: description game list + release notes for new games.
// Usage: NEW_SLUGS="a,b" FIRST_RELEASE=0|1 node scripts/release-notes.mjs
import { readFileSync, writeFileSync, rmSync } from 'node:fs';
const games = JSON.parse(readFileSync('www/games.json', 'utf8')).sort((a, b) => (b.free - a.free) || (b.added || '').localeCompare(a.added || ''));
const list = games.map((g) => `- ${g.name}${g.free ? ' (free)' : ''}: ${g.tagline}`).join('\n');
writeFileSync('fastlane/metadata/en-US/description.txt', readFileSync('fastlane/description.template.txt', 'utf8').replace('GAMES_LIST', list));
const fresh = (process.env.NEW_SLUGS || '').split(',').filter(Boolean).map((s) => games.find((g) => g.slug === s)).filter(Boolean);
const notesPath = 'fastlane/metadata/en-US/release_notes.txt';
if (process.env.FIRST_RELEASE === '1') rmSync(notesPath, { force: true });
else writeFileSync(notesPath, fresh.length ? 'New on the shelf:\n' + fresh.map((g) => `- ${g.name}: ${g.tagline}`).join('\n') : 'Fixes and polish.');
console.log('metadata ready;', fresh.length, 'new game(s)');
