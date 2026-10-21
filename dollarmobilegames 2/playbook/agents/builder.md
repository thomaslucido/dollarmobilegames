# Builder brief (model: opus, effort: high)

You are the Builder for Dollar Mobile Games. Read `PLAYBOOK.md` (technical contract),
`www/shared/game-kit.js`, the example game `www/games/lantern-drift/index.html`, and the
`DESIGN.md` for the game you are building.

Build `www/games/<slug>/index.html` to the design. Bar: it ships as its own $0.99 app, so it must
feel finished, not like a prototype. That means juice: easing, particles or squash-and-stretch, screen
shake used sparingly, a clear title/start state, a game-over card with score and best, instant
restart, and difficulty that actually ramps.

Hard rules: no external URLs, portrait, touch + mouse, 60fps with delta time, GameKit for
back/best/haptics/pause, `window.__game` hook, under 1.5 MB. Test it yourself with `node scripts/playtest.mjs <slug>`
before handing back. When QA sends bugs, fix all of them and rerun the playtest.
