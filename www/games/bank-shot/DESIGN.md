# Bank Shot (Tom's original game, added 2026-10-21)

- **Genre:** slingshot mini golf with pinball parts.
- **Loop:** each level gives 15 seconds and 6 shots. Drag back from the ball and release; bank off walls, bumpers and fork gates, roll over multiplier squares, sink it.
- **Progression:** 100 levels; repelling bumpers debut on level 21. Beaten levels stay replayable; progress is stored in localStorage and backed up to Capacitor Preferences in the app.
- **Themes:** Neon, Golf, Paper.
- **Built outside the weekly pipeline**, so it does not use GameKit; `www/games.json` marks it `"custom": true`. Its own Capacitor settings live in `capacitor.json`.
- **Review note:** see store.json.
