// Prepares one game as a standalone iOS app (run on the macOS runner before `npx cap add ios`):
//   node scripts/stage-app.mjs <slug>
// Writes (all gitignored): build/www/ (the game at the root), capacitor.config.json,
// resources/icon.png + splash.png, fastlane/metadata/en-US/*.txt, fastlane/screenshots/en-US/*.png
import { readFileSync, writeFileSync, mkdirSync, cpSync, rmSync, readdirSync, copyFileSync, existsSync } from 'node:fs';

const slug = process.argv[2];
if (!slug) { console.log('usage: node scripts/stage-app.mjs <slug>'); process.exit(2); }
const src = `www/games/${slug}`;
const game = JSON.parse(readFileSync('www/games.json', 'utf8')).find((g) => g.slug === slug);
if (!game) throw new Error(`${slug} is not in www/games.json`);
const store = JSON.parse(readFileSync(`${src}/store.json`, 'utf8'));

// web bundle: game at the root, shared kit beside it
rmSync('build', { recursive: true, force: true });
mkdirSync('build/www/shared', { recursive: true });
for (const f of readdirSync(src)) {
  if (['app', 'store', 'DESIGN.md', 'store.json', 'capacitor.json'].includes(f)) continue;
  cpSync(`${src}/${f}`, `build/www/${f}`, { recursive: true });
}
cpSync('www/shared', 'build/www/shared', { recursive: true });
let html = readFileSync('build/www/index.html', 'utf8').replaceAll('../../shared/', 'shared/');
html = html.replace('<head>', '<head>\n<script>window.GAMEKIT_STANDALONE = true;</script>');
writeFileSync('build/www/index.html', html);

const extra = existsSync(`${src}/capacitor.json`) ? JSON.parse(readFileSync(`${src}/capacitor.json`, 'utf8')) : {};
writeFileSync('capacitor.config.json', JSON.stringify({
  ios: { contentInset: 'never', scrollEnabled: false },
  ...extra,
  appId: game.bundleId, appName: store.appName, webDir: 'build/www',
}, null, 2));

mkdirSync('resources', { recursive: true });
copyFileSync(`${src}/app/icon.png`, 'resources/icon.png');
copyFileSync(`${src}/app/splash.png`, 'resources/splash.png');
copyFileSync(`${src}/app/splash.png`, 'resources/splash-dark.png');

// fastlane metadata
const md = 'fastlane/metadata/en-US';
rmSync('fastlane/metadata', { recursive: true, force: true });
mkdirSync(md, { recursive: true });
const base = 'https://thomaslucido.github.io/dollarmobilegames';
const files = {
  'name.txt': store.appName, 'subtitle.txt': store.subtitle, 'description.txt': store.description,
  'keywords.txt': store.keywords, 'promotional_text.txt': store.promo,
  'support_url.txt': `${base}/support.html`, 'privacy_url.txt': `${base}/privacy.html`,
  'marketing_url.txt': `${base}/games/${slug}/index.html`,
};
for (const [f, v] of Object.entries(files)) writeFileSync(`${md}/${f}`, v);
writeFileSync('fastlane/metadata/copyright.txt', `${new Date().getFullYear()} Tom Lucido`);
writeFileSync('fastlane/metadata/primary_category.txt', 'GAMES');
// (Games subcategories are optional; fastlane's subcategory upload is rejected by the API, so we skip it.)
mkdirSync('fastlane/metadata/review_information', { recursive: true });
const review = { 'notes.txt': store.reviewNote, 'first_name.txt': 'Tom', 'last_name.txt': 'Lucido',
  'phone_number.txt': '+1 313 403 2208', 'email_address.txt': 'thomaslucido@gmail.com', 'demo_required.txt': 'false' };
for (const [f, v] of Object.entries(review)) writeFileSync(`fastlane/metadata/review_information/${f}`, v);

const shots = 'fastlane/screenshots/en-US';
rmSync('fastlane/screenshots', { recursive: true, force: true });
mkdirSync(shots, { recursive: true });
for (const f of readdirSync(`${src}/store`).filter((f) => /^\d\d\.png$/.test(f)).sort().slice(0, 10)) copyFileSync(`${src}/store/${f}`, `${shots}/${f.replace('.png', '')}_iphone.png`);

if (process.env.GITHUB_ENV) writeFileSync(process.env.GITHUB_ENV, `APP_IDENTIFIER=${game.bundleId}\nAPP_NAME=${store.appName}\nDISPLAY_NAME=${game.name}\n`, { flag: 'a' });
console.log(`staged ${store.appName} (${game.bundleId})`);
