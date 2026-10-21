# Dollar Mobile Games

One original iPhone game a week, each shipped as its own $0.99 app.

| When (Detroit time) | What | Where |
|---|---|---|
| Every evening ~7:13pm | Snapshot Apple's top Games charts into `data/trends/` | `.github/workflows/charts.yml` |
| Mon + Sat ~7:40pm | Build night: scout, design, build and QA one original game | Claude scheduled task, `playbook/BUILD_NIGHT.md` |
| Saturday night | Pick the week's best game into `data/ship-queue.json` | `playbook/agents/picker.md` |
| When a game is queued | Register its bundle ID, open an issue with Tom's 5-minute checklist | `.github/workflows/prepare-app.yml` |
| Sun ~7:07am | Build, upload and submit the queued game to Apple | `.github/workflows/deploy-ios.yml` |
| Every push to `www/` | Web preview of every game | `.github/workflows/pages.yml` |

Start with `PLAYBOOK.md` (rules for agents) and `SETUP.md` (one-time Apple and GitHub steps).

```
npm install
node scripts/validate.mjs            # registry, listing, originality and offline checks
node scripts/playtest.mjs <slug>     # automated playtest with screenshots
node scripts/shoot.mjs <slug>        # app icon, splash and App Store screenshots
node scripts/stage-app.mjs <slug>    # stage one game as a standalone app (CI uses this)
npm run serve                        # play locally at http://localhost:8080
```
