# Build night runbook

The scheduled task "Games · Build night" runs this every Monday and Saturday evening, unattended.
Tom is not watching. Never ask him a question or wait for approval. Make sensible calls, note
them in the summary, and finish the night.

Push straight to `main`: not a `claude/` branch, not a pull request.

## Setup

1. `git checkout main && git pull`. Read `PLAYBOOK.md` fully.
2. `npm install`. Playwright browsers are preinstalled; the scripts fall back to
   `/opt/pw-browsers/chromium` if Playwright cannot launch its own.
3. DATE = today's date in America/Detroit (YYYY-MM-DD). DAY = weekday name.

## The night

Use the Agent tool for each role. Pass the role brief from `playbook/agents/<role>.md`, DATE, and
the repo path. Set model and effort exactly as listed in the playbook.

A. **Scout** (haiku, low) writes `data/scout/DATE.md`. Read its summary.
B. **Designer** (opus, high) picks one trend we have not covered in the last 6 games and invents
   an ORIGINAL game: `www/games/<slug>/DESIGN.md`, `store.json`, `icon.svg`. If the concept, name
   or look resembles a specific charting game or one of our earlier games, send it back once.
C. **Builder** (opus, high) builds `www/games/<slug>/index.html` to the technical contract.
D. **QA** (sonnet, medium) runs `node scripts/validate.mjs` and `node scripts/playtest.mjs <slug>`
   and reviews the screenshots. Bugs go back to the Builder, then QA again. At most 2 fix rounds.

## Finish

If QA passes:
1. Add the registry entry to `www/games.json` (status `built`, added DATE, bundleId per playbook).
2. `node scripts/shoot.mjs <slug>` (app icon, splash, 3 store screenshots). Look at the three
   screenshots with the Read tool; they are the App Store listing, so if one shows a blank,
   broken or game-over screen, adjust the game's `__game` hooks or the shot timing and reshoot.
3. `node scripts/validate.mjs` must pass.
4. Append the night to `data/ideas.json` (status `built`).

If QA still fails after 2 rounds: push the game folder to branch `wip/<slug>`. On main, only
append `data/ideas.json` (status `parked`, with why) and `data/scout/DATE.md`. Do not touch
`www/games.json`.

## Saturday only: the weekly pick

After the night's game is done (shipped or parked), if `data/ship-queue.json` has no entry with
status `queued`, run the **Picker** (opus, medium) with `playbook/agents/picker.md`. It chooses
the single best game in `www/games.json` with status `built` and appends it to the queue. Set
that game's status to `queued`. If something is already queued, skip the pick and say so.

## Commit and push

One commit: `Build night DATE: <Game Name>` (add `+ picked <Name> for Sunday` when a pick
happened). Push to main. If the push is rejected because the remote moved, `git pull --rebase`
and push again (up to 3 tries).

## Never

- Edit `.github/workflows/`, `data/releases.json`, `fastlane/`, `scripts/asc.mjs` or secrets.
  You may fix an obvious bug in `scripts/validate.mjs`, `playtest.mjs` or `shoot.mjs` only if
  it blocks the night; say so in the summary.
- Add analytics, ads, network calls, in-app purchases, third-party art or brand names.

## Summary (final message, short, no em dashes)

- Game: name, one-line pitch, the trend it rides and the twist that makes it ours
- Status: built (in the pool) or parked (why)
- Play it: https://thomaslucido.github.io/dollarmobilegames/games/<slug>/index.html
- Saturdays: "This week's app: <App Name>, shipping Sunday ~7am." followed by Tom's checklist,
  copied from the bottom of `playbook/agents/picker.md`, filled in with the app name and bundle
  ID. If nothing was picked, say why.
- Anything Tom should know (judgment calls, script fixes, failures), including whether the push
  to main worked or the exact error.
