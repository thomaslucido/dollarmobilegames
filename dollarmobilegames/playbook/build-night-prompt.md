You are running "Games · Build night" for Tom Lucido's Dollar Arcade, unattended. Tom is not watching: never ask him a question or wait for approval. Make sensible calls, note them in the summary, and finish the night.

REPO: https://github.com/thomaslucido/dollarmobilegames (branch main). Tom wants you to commit and push directly to main, not to a claude/ branch and not as a pull request.

SETUP
1. The repo is checked out in your working directory (if not, clone it). Make sure you are on main and up to date (git checkout main && git pull).
2. BOOTSTRAP (only if the repo has no PLAYBOOK.md): this run's extra message will contain a block between BEGIN-DOLLAR-ARCADE-BOOTSTRAP and END-DOLLAR-ARCADE-BOOTSTRAP. Save the block's contents (base64 of a .tar.gz) to a file in a scratch folder, base64-decode it, extract it into the repo root, then continue with step 3 and commit everything with the night's work. If there is no PLAYBOOK.md and no bootstrap block, stop and report that.
3. Read PLAYBOOK.md fully. It is the rulebook; the originality rule is non-negotiable.
4. `npm install` (Playwright browsers are preinstalled; if Playwright cannot launch, scripts fall back to /opt/pw-browsers/chromium). If resources/icon.png is missing, run `node scripts/render-assets.mjs`.
5. Today's date (America/Detroit) is the DATE used in file names below.

THE NIGHT (use the Agent tool for each role, passing the role brief text from playbook/agents/<role>.md plus today's DATE and the repo path; set model and effort exactly as listed)
A. Scout: model "haiku", effort "low". Writes data/scout/DATE.md. Read its summary.
B. Designer: model "opus", effort "high". Picks one trend we have not covered in the last 6 games, invents an ORIGINAL game, writes www/games/<slug>/DESIGN.md and icon.svg. Reject and redo once if the concept or name resembles any specific charting game.
C. Builder: model "opus", effort "high". Builds www/games/<slug>/index.html to the playbook's technical contract.
D. QA: model "sonnet", effort "medium". Runs `node scripts/validate.mjs` and `node scripts/playtest.mjs <slug>` and reviews screenshots. If QA returns bugs, send the full list back to the Builder (same model/effort) and re-run QA. At most 2 fix rounds.

FINISH
- If QA passes: add the registry entry to www/games.json (free: false, productId per PLAYBOOK, added: DATE), run `node scripts/shoot.mjs <slug>` (review.png) and `node scripts/shoot.mjs --store`, run `node scripts/validate.mjs` (must pass), append the night to data/ideas.json with status "shipped". Commit "Build night DATE: <Game Name>" and push to main.
- If QA still fails after 2 rounds: push the game folder to branch wip/<slug>; on main only append data/ideas.json (status "parked", with why) and data/scout/DATE.md; commit and push main. Do not touch www/games.json.
- If a push to main is rejected because the remote moved, `git pull --rebase` and push again (up to 3 tries).
- Never edit .github/workflows/, data/releases.json, fastlane/Fastfile, scripts/asc.mjs or secrets. You may fix an obvious bug in scripts/validate.mjs, playtest.mjs or shoot.mjs only if it blocks the night; say so in the summary.
- Never add analytics, ads, network calls, third-party art, or brand names.

SUMMARY (your final message, short, no em dashes)
- Game: name, one-line pitch, trend it rides and the twist that makes it ours
- Status: shipped to main (goes to Apple at the next Tue/Sun 7am deploy) or parked (why)
- Play it: https://thomaslucido.github.io/dollarmobilegames/games/<slug>/index.html (live a few minutes after the push, once Pages is on)
- Anything Tom should know (judgment calls, script fixes, failures)
