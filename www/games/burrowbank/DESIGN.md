# Burrowbank

**Tagline:** Tap a bird with open sky. Birds in a line fly together. Empty the bank.

## Trend and evidence

- **Trend:** arrow / one-direction puzzles (tap a piece and it leaves the board in the direction
  it points, if nothing is in the way).
- **Evidence:** scout report `data/scout/2026-10-21.md`, trend #3. FoxData's July 2026 global
  chart notes the arrow-puzzle trend "stays strong with several similar titles climbing".
  Puzzle revenue is up about 20% YoY in H1 2026 (PocketGamer.biz). Chart-level sourcing is weak
  (no `data/trends/` snapshots yet), which the scout flagged.
- **Why this one, not physics destruction:** a believable physics-destruction game needs a rigid
  body solver written from scratch in one evening, and it would be judged on feel against big
  budget titles. An arrow puzzle is deterministic, reads in one tap, and leaves room for a twist
  that changes how it plays.
- **Genre spacing:** the only earlier game is Lantern Drift (one-touch flyer). No repeat.

## The twist (what makes it its own game)

Arrow puzzles in the charts are usually square-grid clean-ups. Burrowbank changes three things:

1. **Hex burrows, six directions.** The board is a sandy riverbank full of hexagonal nest
   burrows. Each bird faces one of six hex directions (up, down and four diagonals), so you
   read lines on a hex lattice, not rows and columns.
2. **Flocks.** When a bird flies out, any bird directly behind it (the next burrow on the
   opposite side) that faces the same way follows it out at once, and so on down the line.
3. **The bank keeps filling.** From level 30, a few new swallows swoop in while you work, so
   the level is not done until the late arrivals are gone too.

## Structure: 100 short levels

- Each level is a fixed bank of birds (seeded, the same every time). Send every bird off to
  clear it. Pebbles are stones that never move and only block paths.
- **Feathers:** 3 per level. Tapping a boxed-in bird bonks (wobble, star, the blocker flashes
  coral) and costs a feather. Lose all 3 and the level restarts.
- **Stars:** one per feather left (3 for no bonks). Cleared levels and stars are saved on device.
  Clearing a level unlocks the next; the level picker (25 per page) replays anything unlocked.
- **Always solvable:** levels are built backwards. Every bird (and every mid-level arrival) is
  placed with a clear path at the moment it is placed, so removing them in reverse order always
  works. Sending a bird off only ever opens paths, so a level can never become stuck.
- First-level tips: levels 1-3 show a one-line hint ("Tap a bird with a clear path out",
  "Birds in a line fly together").

## Controls

- Tap a bird. That is the whole game. Works the same with a mouse click.
- Tap a pebble: dull click, nothing else.
- Tap the card to start, retry or move on to the next level; the Levels button opens the picker.

## Difficulty curve (d = (level - 1) / 99)

| Lever | Level 1 | Formula | Level 100 |
|---|---|---|---|
| Bank size | 4 x 5 (20) | 4x5 to L5, 5x6 to L15, 5x7 to L30, 6x7 to L50, then 6x8 | 6 x 8 (48) |
| Birds at start | 4 | 4 + round(30d) | 34 |
| Pebbles | 0 | 0 before L12, then min(6, 1 + floor((L - 12) / 16)) | 6 |
| Mid-level arrivals | 0 | 0 before L30, then min(8, 1 + floor((L - 30) / 9)) | 8 |
| Time between arrivals | | 3.4 - 1.4d s | 2.0 s |
| Chance a placement is a whole line (flock) of 2-4 | 0 | 0 before L3, then 0.14 + 0.3d | 44% |
| Chance a new bird sits in another bird's path | 30% | 0.3 + 0.6d | 90% |

Level 1 takes a few seconds; level 100 about a minute. Small banks use bigger burrows (hex radius
up to 52 px), so early levels are easy to tap.

## Demo autopilot (`__game.demo(on)`)

Every 0.45 s, tap the free bird whose flock is longest (ties: the one closest to the top). Never
tap a blocked bird. It clears all 100 levels without a bonk.

## Art direction: sunny riverbank, paper-cut

Bright daylight and flat paper-cut shapes, nothing like Lantern Drift's dark night lake and
glowing orange lantern. Every shape has a crisp edge; no glow, no blur, no gradients except a
gentle top-to-bottom sand fade.

| Use | Hex |
|---|---|
| Sky band | #bfe3e0 |
| Sun disc, cream outlines, bird face patch | #fbf7ee |
| Grass lip at the top of the bank | #5f9e6e |
| Sand (top to bottom fade) | #efdfba to #d9bd86 |
| Sand strata stripes | #cfb27a at 50% |
| Burrow rim | #b8965f |
| Burrow hole | #4a3527 |
| Birds | #24324f (slate navy) |
| River and accent | #2a9d8f |
| River ripples | #7fd1c4 |
| Blocked flash, stars | #e2574c |
| Pebbles | #8c8a84 with #6b6862 crack |
| Text | #24324f on cream cards |

- **Layout:** sky band across the top (about 14% of the height) with a cream sun disc and the
  level name; the bank fills the middle with wavy strata and the hex burrows; a teal river strip runs
  along the bottom with slow sliding ripple dashes. Birds left (or total stars, on menus) sit on the sun.
  The sky band shows the level name, three navy feathers, and a "left" count on the sun.
- **Birds:** the top-down swallow silhouette from `icon.svg` (swept wings, forked tail, cream
  face patch), drawn in navy with a 3 px cream outline, rotated to the bird's hex direction. The
  silhouette is itself an arrow, so the facing reads without any arrow glyph. Idle birds bob
  0.5 px and blink their face patch at random.
- **Motion:** a fledging bird pops 1.15x, then accelerates along its line (ease-in, up to
  900 px/s) with a 2-frame wing flap and three fading cream dots behind it. Followers in a flock
  leave 70 ms apart so the line reads as a line. Birds that leave the bank shrink to specks in the
  sky. A bonk is a 0.18 s +-4 px wobble with a small cream star.
- **Type:** a heavy serif (`ui-serif, Georgia, serif`, weight 800, italic for the title) with
  tabular numbers for counts. Lantern Drift uses a rounded sans, so this is its own voice.
  Cards are cream rounded rectangles with a 3 px navy border, like a cut paper tag.

## Sound (WebAudio via `GameKit.sound`, silent until the first tap)

- Fledge: triangle chirp 1200 Hz, 0.06 s. Each flock follower is 2 semitones higher.
- Bonk: sine 180 Hz, 0.12 s, plus `GameKit.buzz()`.
- Landing: sine 620 Hz, 0.04 s, quiet.
- Pebble crumble: low square 110 Hz, 0.05 s.
- Level cleared: three rising triangle notes (880, 1100, 1320 Hz).
- Out of feathers: three falling triangle notes (660, 520, 390 Hz).

## Review note

Tap to start level 1. Tap a bird whose path to the edge of the bank is clear and it flies away
(birds behind it facing the same way follow). Clear every bird to finish the level. A blocked tap
costs one of three feathers.
