# Dollar Arcade

One iOS app full of small, original games. First game free, every other game a $0.99 unlock.

| When (Detroit time) | What | Where |
|---|---|---|
| Every evening ~7:15pm | Snapshot Apple's top Games charts into `data/trends/` | `.github/workflows/charts.yml` |
| Mon + Sat ~7:40pm | Build night: scout trends, design and build one original game, QA it, push | Claude scheduled task "Games · Build night" |
| Tue + Sun ~7:07am | Build the iOS app, create in-app purchases, upload, submit to Apple | `.github/workflows/deploy-ios.yml` |
| On every push to `www/` | Web preview of the arcade | `.github/workflows/pages.yml` |

Start with `PLAYBOOK.md` (rules for agents) and `SETUP.md` (one-time Apple/GitHub steps).

```
npm ci
node scripts/validate.mjs            # registry + originality + offline checks
node scripts/playtest.mjs <slug>     # automated playtest with screenshots
node scripts/shoot.mjs <slug>        # IAP review screenshot
node scripts/shoot.mjs --store       # App Store screenshots
npm run serve                        # play locally at http://localhost:8080
```
