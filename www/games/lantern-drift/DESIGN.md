# Lantern Drift (seed game)

- **Trend:** one-touch flyers (hold/release altitude control), a long-running evergreen genre.
- **Twist:** the lantern's flame is a fuel meter. Holding burns it faster; fireflies refill it.
  You can run out of light, not just crash, so every hold is a small decision.
- **Controls:** hold anywhere to rise, release to fall.
- **Structure:** 100 short levels, each a fixed course of willow gates that ends at a lit pier.
  Fly past the pier's string of lanterns to clear the level. Hit a willow, touch the water or
  let the flame go out and you retry the same level instantly. Levels are seeded, so each one is
  the same course every time and can be learned.
- **Progress:** clearing a level unlocks the next. Stars per level: 3 for every firefly,
  2 for at least half, 1 for finishing. Cleared levels and stars are saved on device; the
  level picker (25 per page) lets you replay anything unlocked.

## Difficulty curve (d = (level - 1) / 99)

| Lever | Level 1 | Formula | Level 100 |
|---|---|---|---|
| Gates per level | 4 | 4 + round(level x 0.2) | 24 |
| Scroll speed | 140 px/s | 140 + 90d | 230 px/s |
| Gate spacing | 360 px | 360 - 80d | 280 px |
| Gap height | 270 px | 270 - 105d (max 42% of the play height) | 165 px |
| Gap move between gates | 70 px | min(70 + 120d, 120 x spacing / speed), less any sway | ~146 px |
| Swaying willows | none | from level 25: (level - 20)% of gates, amp 14 + 22d px | 75% of gates |
| Flame drain (hold / idle) | 0.055 / 0.02 per s | +0.035d / +0.016d | 0.09 / 0.036 per s |

Level 1 takes about 10 seconds, level 100 about 30. The gap move is capped so every course is
flyable at its speed; `__game.demo(true)` clears all 100 levels on 390x844 and 375x667.

- **Art:** night lake, palette #0d1230 #2a2457 #5a3a62 sky, #f2a65a lantern, #f8f39a fireflies,
  #3f6b5a willow strands (#5f8f6e on swaying ones). The pier is a dark post with a glowing lamp
  and a string of paper lanterns (#f2a65a #e86f6f #f8f39a). Everything drawn in canvas.
- **Tagline:** Hold to rise. Let go to fall. Reach the lit pier.
