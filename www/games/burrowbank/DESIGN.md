# Burrowbank

**Tagline:** Tap a bird with open sky. Birds in a line fly together.

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

Arrow puzzles in the charts are usually static, square-grid, level-by-level clean-ups. Burrowbank
changes three things:

1. **Hex burrows, six directions.** The board is a sandy riverbank full of hexagonal nest
   burrows. Each bird faces one of six hex directions (up, down and four diagonals), so you
   read lines on a hex lattice, not rows and columns.
2. **The bank keeps filling.** It is endless and real-time. New birds keep swooping in to land
   in empty burrows. You lose when a bird arrives and every burrow is taken.
3. **Flocks.** When a bird flies out, any bird directly behind it (the next burrow on the
   opposite side) that faces the same way follows it out at once, and so on down the line.
   Lining birds up and then releasing the front one is the big scoring play. The skill is
   reading which front bird releases the longest line, not just clearing whatever is free.

Late game adds **pebbles**: fallen stones that block lines for a while, then crumble.

## Controls

- Tap a bird. That is the whole game. Works the same with a mouse click.
- **Clear line:** the bird (and its flock) flies out along its line, off the edge of the bank.
- **Blocked line:** the bird bonks its head (cartoon wobble, little star), the blocker along its
  line flashes coral for 0.4 s, and one extra bird lands right away as a penalty. This stops
  random tapping without ending the run.
- Tap anywhere on the title or game-over card to start or retry.

## Board

- Flat-top hexes in an offset-column layout: **6 columns x 8 rows = 48 burrows**.
- Flat-top axial directions: N (0,-1), S (0,+1), NE (+1,-1), SE (+1,0), NW (-1,0), SW (-1,+1).
  A bird's line is every cell from its burrow to the board edge in its direction. Birds facing
  S fly out over the river, then curve up into the sky.
- Size the hex radius to fit both width (16 px side gutters) and height (sky band + river), so
  it also fits a 375 x 667 phone. Target about 37 px radius on a 390 px wide phone.
- Run starts with **14 birds** placed so that at least 5 have a clear line.

## Scoring

- A flock of n birds scores **1 + 2 + ... + n** (1, 3, 6, 10, 15 ...). A single bird is 1 point,
  a line of four is 10.
- Show the points as a small serif number that pops where the flock leader left.
- A flock of 4+ shakes the bank lightly (2 px, 0.15 s) and plays the long chirp run.
- Best score saved with `GameKit.saveBest`, shown on the title and game-over cards.

## Arrivals and difficulty curve (t = seconds since the run started)

| Lever | Start | Formula | At 60 s | At 120 s | At 180 s | Floor/cap |
|---|---|---|---|---|---|---|
| Arrival interval | 2.2 s | max(0.85, 2.2 - 0.0065 t) | 1.81 s | 1.42 s | 1.03 s | 0.85 s at ~208 s |
| Arrival has a clear line when it lands | 70% | max(0.35, 0.70 - 0.0019 t) | 59% | 47% | 36% | 35% |
| Arrival copies the facing of the bird just ahead or behind it on a line (sets up flocks) | 30% | constant | 30% | 30% | 30% | |
| Pebble instead of a bird | 0% | 0 until 90 s, then min(0.12, (t - 90) x 0.0013) | 0% | 4% | 12% | 12% |

- **Order of rolls for each arrival:** pick a random empty burrow; roll pebble; else roll the
  flock-copy (only if a neighbour on some line exists); else roll clear-line (choose among the
  directions that are clear right now, or among the blocked ones if the roll fails; if none
  exist in the chosen set, use any direction).
- **Incoming marker:** 0.8 s before a bird lands, its target burrow shows a soft shadow with a
  small direction tick, so the player can plan. The landing bird swoops in from the sky on an
  arc over 0.5 s.
- **Pebbles** last 12 s, show a crumbling crack as they age, then fall away. They cannot be
  tapped (a tap gives a dull click, no penalty).
- **Bank-full warning:** at 40 of 48 burrows filled, the bank edge pulses coral and a low
  heartbeat plays every 0.8 s. At 48 filled, the next arrival ends the run.
- Deadlocks (no bird can move) are allowed. They are the fail pressure. The bias above keeps them
  rare early and common late.
- Expected run: a careful new player lasts 2 to 3 minutes, a good player 4 to 6 minutes.

## Fail state

A bird arrives and every burrow is full. It circles once above the bank, then the run ends:
"The bank is full" card with score, best and "Tap to try again".

## Demo autopilot (`__game.demo(on)`)

Every 0.45 s, tap the free bird whose flock is longest (ties: the one closest to the top). Never
tap a blocked bird. This plays well enough for the screenshots to show a full bank with flocks
leaving and a rising score.

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
| Blocked flash, bank-full warning | #e2574c |
| Pebbles | #8c8a84 with #6b6862 crack |
| Text | #24324f on cream cards |

- **Layout:** sky band across the top (about 14% of the height) with a cream sun disc and the
  score; the bank fills the middle with wavy strata and the hex burrows; a teal river strip runs
  along the bottom with slow sliding ripple dashes. Best score sits on the right of the sky band.
  The bank-fill meter is a row of 48 tiny dots along the grass lip (filled dots are navy).
- **Birds:** the top-down swallow silhouette from `icon.svg` (swept wings, forked tail, cream
  face patch), drawn in navy with a 3 px cream outline, rotated to the bird's hex direction. The
  silhouette is itself an arrow, so the facing reads without any arrow glyph. Idle birds bob
  0.5 px and blink their face patch at random.
- **Motion:** a fledging bird pops 1.15x, then accelerates along its line (ease-in, up to
  900 px/s) with a 2-frame wing flap and three fading cream dots behind it. Followers in a flock
  leave 70 ms apart so the line reads as a line. Birds that leave the bank shrink to specks in the
  sky. A bonk is a 0.18 s +-4 px wobble with a small cream star.
- **Type:** a heavy serif (`ui-serif, Georgia, serif`, weight 800, italic for the title) with
  tabular numbers for the score. Lantern Drift uses a rounded sans, so this is its own voice.
  Cards are cream rounded rectangles with a 3 px navy border, like a cut paper tag.

## Sound (WebAudio via `GameKit.sound`, silent until the first tap)

- Fledge: triangle chirp 1200 Hz, 0.06 s. Each flock follower is 2 semitones higher.
- Bonk: sine 180 Hz, 0.12 s, plus `GameKit.buzz()`.
- Landing: sine 620 Hz, 0.04 s, quiet.
- Pebble crumble: low square 110 Hz, 0.05 s.
- Bank-full heartbeat: sine 90 Hz, 0.1 s, every 0.8 s while 40+ burrows are filled.
- Game over: three falling triangle notes (660, 520, 390 Hz).

## Review note

Tap to start. Tap a bird whose path to the edge of the bank is clear and it flies away (birds
behind it facing the same way follow). The game ends when every burrow is full.
