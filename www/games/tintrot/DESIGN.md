# Tintrot

**Tagline:** Wind the toys. Shove the fluff. Let the cat nap. (48 chars)

**Genre (registry):** wind-up lane defense

**Accent:** `#f2b705` (wind-up key brass)

**Category:** GAMES_STRATEGY (we have not used it yet)

## Trend and evidence

- **Trend:** light lane-placement strategy, also called tower-defence lite: put a unit on a lane,
  then time one upgrade. Sessions of 3 to 5 minutes.
- **Evidence:** scout report `data/scout/2026-11-09.md`, trend #3. A 2026 marketing report has
  strategy downloads up 14.5%, and a lane-based real-time strategy title sits near the top of the
  US top grossing list (Profitable.app, updated Nov 6 2026). The evidence conflicts: PocketGamer.biz
  H1 2026 says strategy "stumbles". `data/trends/` is still empty, so this is **directional only**.
- **Why this, not trend #1:** the orchestrator asked for a genre and core verb clearly different
  from our last six games. Trend #1 is another place-or-route puzzle and would sit next to
  Burrowbank, Griddlewise and Glasswright. Trend #3 is the only lane on the scout list that is not
  puzzle, merge, block, sort, runner or sim. Its core verb, **hold to wind and release to send**,
  is a timing and reflex action we have not used before.
- **Genre spacing:** the last 6 games are hex arrow puzzle (Burrowbank), merge puzzle
  (Wheelthrown), pancake sort puzzle (Griddlewise), roguelike block puzzle (Glasswright), idle
  garden runner (Sow Far) and cozy tending sim (Simmerstone). There is no strategy or lane game
  among them. To stay well away from the best-known lane defence games, Tintrot has **no plants, no
  fixed turrets, nothing that shoots, and no monsters**. The defenders walk; the threats are dust.

## The pitch

A sunny afternoon on a walnut nursery floor. A tuxedo cat is napping on the braided rug. Dust
bunnies keep rolling out from under the bed, down the floorboards, toward the rug. If one reaches
the cat, the cat sneezes. Your tin wind-up toys hold the line: **hold a floorboard to wind a toy,
let go, and it trots up the board and shoves the fluff back under the bed.**

## The twist (what makes it its own game)

1. **Defenders are wind-up toys, not turrets.** Nothing is placed and left. Every toy is a single
   shove that walks up its lane and is spent. How much you wind it is how hard it can push.
2. **Wind is the ammo, and winding takes real time.** There is one key and one pair of hands. A
   long wind clears a big clump, but while you wind, the other lanes keep rolling. You pick how much
   wind each threat is worth.
3. **The timed upgrade is a snug wind.** Let go in the last 15% of the spring for a snug wind
   (+25% push and a brass glint). Hold too long and the spring **snaps**: the toy spins, falls over
   and is lost. Risk against reward on every toy.
4. **Dust grows as it rolls.** A dust bunny picks up fluff on the way down, so an early shove is
   cheaper. But one toy can shove several bunnies in a row, and each one in the same walk scores
   more. Do you send a toy now, or wait for the lane to line up?
5. **A next-toy tray.** Three different tin toys come in a shuffled bag, and you can see the next
   two. A light mouse is no use against a big hairball, so you plan which lane gets which toy.

A player would describe it as "the wind-up toy game where you shove dust bunnies back under the
bed so the cat stays asleep", not as a version of any other game.

## Controls

- **One verb: press and hold on a lane, then let go.** Touch-down picks the lane from the touch x
  (the whole column counts, rug area included). The current toy hops from the tray to the bottom of
  that lane in 0.12 s and its key starts to turn. Release sends it walking.
- Sliding sideways while holding moves the toy to the lane under the finger. The wind is kept.
- Pressing on a locked lane does nothing (the books rattle 2 px).
- A release under 0.06 s (an accidental tap) cancels: the toy hops back to the tray with no cost.
- Works the same with a mouse. Tap the card to start, retry or resume.

## Geometry (portrait, share of screen height H and width W)

| Zone | Where |
|---|---|
| HUD | 0 to 11% H |
| Bed (gingham skirt, scalloped hem) | 11% to 20% H; the dark under-bed shadow is the hem's lower 3% |
| Lanes (5 floorboards) | 20% to 80% H. Lane length `L = 0.6 H`. 5 equal columns across W minus 8 px margins |
| Rug edge (the line dust must not cross) | 80% H |
| Rug, cat, toy tray | 80% to 100% H (above the bottom safe area) |

- Lanes 2, 3, 4 are open at the start. **Lane 1 opens at 40 s, lane 5 at 90 s.** A locked lane has
  a stack of three closed picture books lying across it; on unlock they slide off sideways (0.5 s)
  with a soft thump.
- Toys start at the bottom of their lane (feet on the rug edge) and walk up. Dust bunnies come out
  of the shadow at the top of the lane and roll down.

## Toys (a shuffled 6-bag: duck, duck, duck, mouse, mouse, elephant)

| Toy | Spring cap (max wind) | Time to full | Walk speed | Look |
|---|---|---|---|---|
| Tin mouse | 60 | 0.70 s | 0.70 L/s | tin silver, pink ears, a little wire tail |
| Tin duck | 100 | 1.10 s | 0.45 L/s | tomato red, brass beak, cream wing with brass dots |
| Tin elephant | 170 | 1.70 s | 0.28 L/s | powder blue, red saddle blanket, cream ears |

- **Winding:** wind rises linearly from 0 to the cap over the toy's time to full. Minimum wind on
  release is 10.
- **Snug window:** from 85% of the cap until 0.12 s after full. Releasing in it gives
  `wind = cap x 1.25`, a brass glint on the toy, **+10 points** and +1 to the snug streak.
- **Overwound:** from 0.12 s to 0.40 s after full the key rattles and the gauge shows red.
  Releasing here sends the toy with exactly the cap (no bonus) and resets the snug streak.
- **Snap:** still holding 0.40 s after full: the spring snaps with a boing, the toy spins and falls
  on its side, fades in 0.6 s, and the next toy is locked out for 0.6 s. The snug streak resets.
- **Wind gauge:** an arc of 10 ticks around the toy while winding. The ticks fill brass as wind
  rises; the snug zone is a wider brass band; overwound is red. A small **brass notch** on the arc
  marks the wind needed to clear the first dust bunny in that lane at the point where they would
  meet (its projected mass). This is the readability aid: wind past the notch and the shove will
  work.
- Walking does not use up wind. Wind is only spent on shoves. A toy that reaches the top of the
  lane walks into the shadow under the bed and is gone.
- Toys in the same lane pass through each other (the later one is drawn behind).
- The next toy comes up in the tray 0.15 s after a release.

## Dust bunnies

Base roll speed: `v(t) = min(0.11, 0.06 + 0.0002 t)` L/s (t = seconds played). After 250 s it rises
by 0.004 every 30 s, capped at 0.15. At the start a fluff takes about 17 s to cross the board; at
250 s about 9 s.

| Type | Start mass | Growth over a full lane | Speed | First appears |
|---|---|---|---|---|
| Fluff | 14 | +12 | 1.0 v | 0 s |
| Clump | 38 | +22 | 0.85 v | 20 s |
| Hairball (big, shaggy) | 75 | +30 | 0.70 v | 70 s |
| Lost sock (slides heel first) | 32 | 0 | 1.9 v | 110 s |
| Tangle (fluff with a loop of red yarn) | 50 | +16 | 0.80 v | 150 s |

- Mass grows linearly with distance rolled: `mass = start + growth x (distance / L)`.
- Drawn radius: `r = min(0.46, 0.18 + 0.0036 x mass) x laneWidth`, so the player reads mass from
  size. A fresh fluff is small; a grown hairball fills its board.
- **Tangle:** when it is shoved away it splits into two fluffs (mass 12 each) that drop into the
  two neighbouring open lanes at the same height (both into its own lane if there is no open
  neighbour).
- **Spawn interval:** `max(1.0, 2.8 - 0.0075 t)` s with +-20% jitter. After 300 s it drops 0.05 s
  every 30 s to a floor of 0.8 s.
- **Lane choice:** a random open lane; never the same lane 3 times in a row; never within 0.12 L of
  another bunny still at the top of that lane.
- **Mix by time played:**

| Time | Fluff | Clump | Hairball | Sock | Tangle |
|---|---|---|---|---|---|
| 0 - 19 s | 100% | | | | |
| 20 - 69 s | 65% | 35% | | | |
| 70 - 109 s | 45% | 35% | 20% | | |
| 110 - 149 s | 35% | 30% | 20% | 15% | |
| 150 s + | 30% | 25% | 18% | 15% | 12% |

## The shove (when a toy's top meets a bunny's bottom)

- **Toy wind >= bunny mass:** toy wind -= mass. The bunny is **bonked**: it tumbles back up the lane
  (spinning, 0.5 s) into the shadow and vanishes with a puff. The toy staggers for 0.12 s and keeps
  walking with the wind it has left, so it can shove the next bunny too.
- **Toy wind < bunny mass:** bunny mass -= toy wind (it visibly shrinks and is pushed back up 0.06 L),
  and the toy topples onto its side, spent, and fades in 0.6 s.
- Every shove: a tin clank, 6 lint puffs, a 2 px shake of that lane only.

## Scoring, fail state, best

- **Bonk:** `+ round(mass) x sweep`, where sweep is 1 for the first bunny this toy shoves, 2 for
  the second and 3 for the third and later. Sweeps of 2+ show a brass "x2" / "x3" pop-up.
- **Snug wind:** +10.
- **Naps (lives):** 3 sleepy "z" badges in the HUD, also floating above the cat. A bunny that
  crosses the rug edge puffs into the cat's face: the cat **sneezes**, one z pops, the screen shakes
  4 px for 0.2 s.
- **Purr (recovery):** every 15 bonks in a row without a sneeze, if a z is missing, the cat purrs
  (a wobbly ripple) and a z drifts back up.
- **Fail state:** the third sneeze. The cat wakes up, stretches and wanders off the rug (1.0 s). The
  card says "The cat is up" with score, best, bunnies bonked and best sweep. Tap to wind again.
- Best score persists with `GameKit.best()` / `GameKit.saveBest(n)`.
- **Expected play:** the first minute is three lanes of fluff and clumps, gentle. The fourth lane,
  hairballs and faster rolls arrive by 90 s; most new players lose the first z around 2 minutes. A
  typical run is 3 to 5 minutes; a strong player using snug winds and sweeps passes 6. Scores: a first
  run around 800 to 1500, a good run 4000+.
- **Tuning knobs** (QA may adjust if runs are far off 3 to 5 minutes): the spawn interval floor,
  the `v(t)` slope and the hairball share.

## Demo autopilot (`__game.demo(on)`)

Every frame when not winding:
1. For each open lane, find the lowest bunny (closest to the rug) and its time to the rug edge.
2. Pick the lane with the least time left. Work out the projected mass where the current toy would
   meet it, plus 3. If a bunny further up the same lane is within 0.25 L and the total fits within
   the toy's snug wind, add it (aim for a sweep).
3. Hold that lane. If the need is at least 85% of the cap and at most cap x 1.25, release in the
   snug window; otherwise release when wind reaches the need (never past full, never snap).
4. If the current toy cannot clear any lane's lowest bunny alone, send it to the lane with the
   least time left anyway (to shrink it).

It should comfortably play past 4 minutes at 390x844 and 375x667, so the store screenshots show
busy lanes, toys mid-shove and a real score.

## Art direction: tin toys on a walnut floor, afternoon sun

Nothing like our earlier games. Bank Shot is neon; Lantern Drift a dark purple night lake with an
orange lantern glow; Burrowbank sunny paper-cut sand in teal and navy; Wheelthrown matte moss and
terracotta clay; Griddlewise a cobalt-tile screen print; Glasswright limestone and jewel glass;
Sow Far a pink and green risograph zine; Simmerstone a pastel felt diorama. Tintrot looks like a
**mid-century lithographed tin toy catalogue**: shiny tinplate toys with **thick ink outlines**,
banded metal shading (a bright highlight stripe across each toy), printed dot and stripe details,
and tiny rivets, set on a warm **dark walnut floor** crossed by a soft diagonal sunbeam. It is the
first of our games with heavy black outlines and metal shine. No halftone, no misregistration, no
paper, no felt stitches, no glow except the brass glint.

| Use | Hex |
|---|---|
| Floorboards (alternate) | `#5a3826`, `#4f3020` |
| Board gaps | `#2b1a12` |
| Wood grain (long soft curves) | `#6b4530` |
| Sunbeam (diagonal band, 12% opacity) | `#ffe2a0` |
| Ink outline (all toys, bed, rug, cat, panels; 3 px at 390 wide) | `#1c1410` |
| Tin red: highlight, body, shadow | `#ff7a62`, `#e0362c`, `#a8231c` |
| Brass (keys, beak, accents): highlight, body, shadow | `#ffe07a`, `#f2b705`, `#b78300` |
| Tin cream (wing, panels, text) | `#f6ead2` |
| Tin silver (mouse): highlight, body, shadow | `#f1f2f4`, `#c9ccd1`, `#8d929b` |
| Mouse ears | `#f29aa0` |
| Tin powder blue (elephant): highlight, body, shadow | `#b5d6f5`, `#7fb2e5`, `#4f80b3` |
| Dust bunny: body, shade, fluff highlight | `#c9c3bb`, `#9d968e`, `#e9e4dd` |
| Lost sock: body, stripes | `#59607a`, `#f6ead2` |
| Tangle yarn | `#e0362c` |
| Bed skirt gingham | `#f6ead2` with `#e0362c` at 45% |
| Under-bed shadow | `#120b08` |
| Rug braid rings | `#e0362c`, `#f6ead2`, `#f2b705`, `#3c6e5a` |
| Cat: fur, chest and paws, nose | `#221a17`, `#f8f4ec`, `#f29aa0` |
| Picture books (locked lanes) | `#3c6e5a`, `#f2b705`, `#e0362c` spines |
| Overwound / snap warning | `#ff4a3d` |

- **Toys:** chunky profile shapes facing up the lane (drawn three-quarter top-down: we see the back
  and the brass butterfly key). Each has a 3-band tin gradient, an ink outline, a printed detail (duck:
  brass dots on a cream wing; mouse: a red stripe; elephant: a red saddle with a cream zigzag) and
  2 to 4 rivet dots. The **key turns** while winding (one quarter turn per 10% wind) and spins while
  walking, slowing as wind runs down. Walking: 2 px bob on a 0.18 s step, little feet tick.
- **Dust bunnies:** a fuzzy ball of 18 to 26 overlapping circles with jittered radius (built once
  per bunny), a shade circle offset down, two ink dot eyes and a small cheeky smile. The fluff
  rotates as it rolls and leaves a faint dusty trail on the board that fades in 1 s. Eyes blink
  now and then in the under-bed shadow before a bunny comes out. A sock slides heel first, stripes
  across it. A tangle has a red yarn loop running through it.
- **Bed:** a band of cream and red gingham across the top with a scalloped hem (24 px scallops,
  ink outline), dark shadow underneath.
- **Rug and cat:** a half-oval braided rug across the bottom (concentric rings, ink outlines). The
  tuxedo cat sleeps curled at right of centre, breathing (scale 1.0 to 1.03 on a 3 s sine). The z
  badges float above it. The **toy tray** is a small tin tray at bottom left: the current toy in the
  front slot (gently glinting), the next two smaller behind it.
- **Type:** a **wide, heavy grotesque in Title Case with a hard offset shadow**, like a printed tin
  toy box label, a new voice for us (Lantern Drift uses a rounded sans, Burrowbank a heavy italic
  serif, Wheelthrown and Sow Far condensed caps, Griddlewise a slab serif, Glasswright old-style
  serif caps, Simmerstone humanist lowercase): `"Arial Black", "Helvetica Neue", Arial, sans-serif`,
  weight 900, drawn with `ctx.scale(1.15, 1)` so it reads extra wide. Cream fill, a 3 px down-right
  ink shadow, tabular numbers. Never condensed, never italic, never all lowercase.
- **Panels:** title, pause and game-over cards are **tin box lids**: tomato red, 14 px radius, a
  3 px ink outline, a cream inner border 8 px in, a brass rim, and a brass rivet in each corner.
  Buttons are brass pills with ink text and a 3 px ink shadow that disappears when pressed.
- **HUD:** score centred in big cream numerals, best under it in small type; the three z badges top
  right (brass discs with an ink "z"). The top-left 60 x 60 stays clear for the web Back button.
- **Title screen:** the live floor with three bunnies rolling and a duck trotting up a lane, the
  cat asleep, the title card "Tintrot" with a little brass key icon drawn beside the word, "Hold a
  board to wind. Let go to send.", best score, "Tap to start".
- **Motion:**
  - Hop to lane 0.12 s; key turns while winding; the toy squashes 4% lower as the spring tightens.
  - Release: a quick whirr and a 1.1x stretch, then the trot.
  - Snug: a brass glint sweeps across the toy (0.25 s) and a ring of 6 tiny brass sparkles.
  - Snap: the key flies off in an arc, the toy spins 360 degrees and lands on its side.
  - Bonk: the bunny tumbles back up with spin and squash, 6 lint puffs; sweep pop-ups rise 30 px.
  - Sneeze: the cat jolts, a cloud of lint, a 4 px screen shake, the z pops like a bubble.
  - Purr: three soft wavy rings from the cat, a z drifts up.
  - Sunbeam: drifts 20 px left and right over 20 s; dust motes (8 to 14 tiny cream dots) float in it.
  - 60 fps with delta time. Game over: the sunbeam slowly fades 40% as the cat walks away.

## Sound (optional, WebAudio via `GameKit.sound`, silent until the first tap)

- Ratchet click every 10% of wind: square 1800 Hz, 0.01 s, quiet.
- Snug release: bright triangle 1320 Hz, 0.08 s.
- Release whirr: sawtooth sliding 300 to 520 Hz, 0.15 s, very quiet.
- Bonk: tin clank, square 220 Hz 0.05 s plus a short noise tick; pitch +2 semitones per sweep step.
- Snap: sine 420 to 110 Hz with a fast wobble, 0.3 s, plus `GameKit.buzz()`.
- Sneeze: short noise burst plus `GameKit.buzz()`.
- Purr: low triangle 55 Hz with a 9 Hz tremolo, 0.6 s, very quiet.
- Lane unlock: two soft thumps (sine 110 Hz).

## Review note

Tap to start. Press and hold on a floorboard to wind a tin toy, then let go to send it up the
board to shove the dust bunnies back under the bed. The game ends when 3 dust bunnies reach the
sleeping cat.
