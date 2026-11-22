# Wickwalk

**Tagline:** Draw the fuse. Wiggle to wait. Light every rocket on cue. (57 chars)

**Genre (registry):** fuse-route timing puzzle

**Accent:** `#66e0b4` (mint chalk)

**Category:** GAMES_PUZZLE

## Trend and evidence

- **Trend:** hybrid-casual route-or-place puzzles. You drag to lay a route on one fixed board, the
  board answers right away, sessions are 3 to 8 minutes and there is a best score to beat.
- **Evidence:** scout report `data/scout/2026-11-21.md`, trend #1 (low-medium confidence).
  AppMagic H1 2026 calls hybrid-casual the main casual-adjacent growth story. Sensor Tower calls
  hybrid casual the new growth engine. Adjust reports hyper-casual sessions up 17% in H1 2026.
  Puzzle holds about 44% of casual revenue (PocketGamer.biz H1 2026). `data/trends/` is still
  empty, so this is **directional only**.
- **Why this trend:** it is the scout's strongest candidate and is not in our last 6 genres
  (roguelike block puzzle, idle garden runner, cozy tending sim, wind-up lane defense, flytrap snap
  arcade, falling-leaf word glide). Trend #2 (match-3) is a tile-matching verb, which we must
  avoid. Trend #3 (kids casual) has too little evidence.
- **What we take and what we leave:** we take the route verb and the short puzzle session. We
  leave out the between-level coins and stars from the trend, because any currency would suggest
  purchases. Progress is the best score, the longest show and the perfect streak.
- **Core verb, checked against our earlier puzzle games:** **drag a continuous line (the fuse)
  ahead of a spark that is always burning along it.** Nothing is merged (Wheelthrown), sorted or
  flipped (Griddlewise), tapped to leave along an arrow (Burrowbank) or placed as a block
  (Glasswright). There are no tiles at all: the line is freehand, at any angle, anywhere on the
  board. Glideleaf also drags, but there the finger hops from letter to letter and the drag spells a
  word. Here the drag is a free curve and its **length** is what matters.
- **Distance from existing games:** fuse puzzles we found rotate fixed fuse pieces on a grid, or
  have you trace one fixed path to a single bomb. Route-drawing games send vehicles to docks or
  runways. Wickwalk has no grid, no pieces, no vehicles and no goal at the end of the line. The
  fuse never stops burning, you can never get ahead of it for long, and the puzzle is timing: making
  the spark arrive at each rocket at the exact moment that rocket is ready.

## The pitch

A summer fair, drawn in coloured chalk on an old slate board. A tiny spark is fizzing along a fuse,
and the fuse only goes where you draw it. Little rockets keep appearing around the green, each with
a chalk ring that fills up like a clock. Draw the fuse so the spark reaches each rocket just as its
ring closes, and it shoots up and blooms into chalk fireworks. Too soon and it fizzles low. Too late
and it tips over. Let the spark catch up with the end of your fuse and it smoulders out.

## The twist (what makes it its own game)

1. **Length is time.** The spark burns at a known speed, so every bit of fuse you draw is a bit of
   time. To make the spark wait, wiggle. To hurry, go straight. A rocket that is ready in 6 seconds
   and only 3 seconds away gets a lazy S-bend on the way.
2. **The spark lights everything it touches.** Pass a rocket that is not ready and it goes off
   early, wasted. So the route has to dodge some rockets now and come back for them later.
3. **It never stops.** The spark is always moving. You draw ahead of it, and you can never draw
   more than one spool of fuse ahead. You plan the next few rockets, not the whole show.
4. **Change your mind on the fly.** Touch any unlit part of the fuse and drag, and the fuse is cut
   there and redrawn from that point. This is the same single verb, not a second control.
5. **The board shows you the future.** Each rocket's ring has a gold notch at the top (the perfect
   moment) and a small spark tick showing when the spark will actually arrive along the fuse as it
   stands. Drawing is a live game of moving that tick into the notch.
6. **Drizzle.** Later, a small rain cloud drifts across the green. Fuse under it gets damp and burns
   slower, so the ticks slide and plans need a quick fix.

A player would describe it as "the chalk fireworks game where you draw the fuse and wiggle it to
make the spark arrive on time", not as a version of any other game.

## Controls

- **One verb: drag to draw the fuse.**
  - Touch within `0.06 U` of the **unlit end** of the fuse and drag: the fuse grows under your
    finger.
  - Touch within `0.05 U` of **any unlit point** at least `0.08 U` (along the fuse) ahead of the
    spark and drag: the fuse is cut there. Everything past that point is wiped away with a chalk-eraser
    smudge (0.25 s), and you draw on from the cut.
  - A touch anywhere else does nothing, but the fuse end gives a small white pulse to show where to
    start.
- The fuse is a polyline. Add a point whenever the finger is at least `0.012 U` from the last
  point. Split long fast moves into steps of `0.012 U` and test each step.
- **Blocked:** a step is refused if it leaves the field (`0.03 U` margin), comes within `0.02 U` of
  an obstacle, or comes within `0.035 U` of the unlit fuse (ignore the last `0.06 U` of fuse behind
  the end). The end stays at the last good point and a small coral-chalk X shows at the finger.
  When the finger comes back within `0.06 U` of the end, drawing resumes without lifting.
- **Spool limit:** the unlit fuse can be at most `2.6 U` long. Past that the end stops and the
  spool meter flashes. The spark burns it down, so the spool refills as you go.
- Lifting the finger just stops drawing. The spark keeps going. Works the same with a mouse. One
  finger only. Tap the card to start, retry or resume.

## Geometry (portrait)

`U` = the field width = `0.92 W`. All rule distances are in `U` so the game plays the same on every
phone.

| Zone | Where |
|---|---|
| HUD | top safe area to `0.11 H`: score centred in big chalk, best under it, the multiplier to its right, the spool meter on the right edge. The top-left 60 x 60 px stays clear for the web Back button |
| Field (the slate) | x from `0.04 W` to `0.96 W`, y from `0.12 H` to `0.90 H` |
| Chalk tray (lives) | `0.90 H` to `0.95 H`, above the bottom safe area: a wooden ledge holding 3 chalk sticks |

- **Lantern:** a small chalk lantern at the bottom centre of the field (`0.5` across, `0.06 U` up
  from the field bottom). The starter fuse runs straight up from it for `0.35 U`. The spark starts
  at the lantern when play begins.
- **Obstacles:** each run places 3 of these, at random, at least `0.22 U` apart, not within
  `0.3 U` of the lantern and not within `0.05 U` of the field edge:
  - Puddle: ellipse `0.22 x 0.14 U`.
  - Picnic blanket: square, side `0.18 U`, turned 0 to 30 degrees.
  - Tree: circle, radius `0.08 U`.
  - Bandstand: octagon, radius `0.11 U`.

## Spark and fuse

- The spark burns along the fuse at speed `v(t)` (see the curve). Behind it the fuse turns to ash,
  which fades out over 4 s. Ash never blocks drawing.
- **Smoulder:** if the spark reaches the unlit end, it stops and a smoulder ring fills around it
  over 1.5 s. Draw on before it fills and nothing is lost. If it fills, you lose one chalk stick
  (a life) and the streak resets. If the spark is still stuck, the ring waits 3 s and then fills
  again.
- **Damp fuse** (drizzle, from 150 s): fuse inside the cloud is damp, and stays damp for 5 s after
  the cloud leaves it. The spark burns damp fuse at `0.6 x v`.

## Rockets

- **Spawning:** the first rocket appears at 2 s with its cue at 12 s. After that a new rocket
  appears every `I(t)` seconds, jittered by up to +-20%. Its cue time is `T = now + C(t)`, but at
  least `1.2 s` after the previous rocket's cue.
- **Fair placement:** try up to 40 random spots and keep the first that is inside the field with a
  `0.07 U` margin, at least `0.06 U` clear of obstacles, `0.12 U` from other rockets and `0.05 U`
  from the unlit fuse. Its distance from the previous rocket (or from the fuse end if no rocket is
  waiting) must be between `0.14 U` and `min(0.6 U, 0.8 x v x dT)`, where `dT` is the gap between
  the two cues. So the next rocket can always be reached in time in cue order. If no spot works,
  try again in 0.5 s.
- **Lighting:** a rocket lights the moment the spark passes within `0.045 U` of its centre
  (`0.06 U` for a big rocket). Let `d = (light time) - T`.

| Result | When | Points | Streak |
|---|---|---|---|
| Perfect | `|d| <= 0.4 s` | 100 x mult | +1 |
| Good | `0.4 s < |d| <= 1.2 s` | 40 x mult | kept |
| Too soon | `d < -1.2 s` | 10 | reset to 0 |
| Dud | not lit by `T + 1.2 s` | 0, lose a chalk stick | reset to 0 |

- `mult = min(4, 1 + 0.25 x streak)`. It shows next to the score as "x1.75".
- **Big rocket** (from 60 s, 15% of spawns): 1.4 x size, cue `C(t) + 2 s`, base points x3, and a
  bigger three-ring burst.
- **Twin rockets** (from 100 s, 20% of spawns): two rockets `0.15 to 0.25 U` apart, joined by a
  dotted chalk line, with cues 1.0 s apart. Both Perfect gives `+250 x mult`.
- **Getting a stick back:** each time the streak reaches a multiple of 8, regain one chalk stick
  (max 3), with a little chalk-dust sparkle in the tray.
- **Late warning:** once `now > T`, the ring turns coral and the rocket wobbles (+-4 degrees,
  6 Hz).

## Cue ring and the arrival tick (the key UI)

- Each rocket has a chalk circle of radius `0.065 U` (big: `0.09 U`). A filled arc sweeps
  clockwise from 12 o'clock as the cue approaches, reaching the top at `T`.
- A **gold notch** sits at 12 o'clock, spanning `+-0.4 s` as an angle (`0.4 / C x 360` degrees
  each side).
- **Arrival tick:** for each unlit rocket, find the first point along the unlit fuse that comes
  within the light radius of the rocket. Predict when the spark gets there by stepping forward in
  0.05 s steps with `v(t)` and the current damp segments. Draw a small four-point spark tick on the
  ring at that predicted time. Ticks past the top are coral (late). A rocket the fuse does not reach
  has no tick.
- While drawing: if a rocket's tick is in the gold notch, its ring glows yellow chalk. If the fuse
  passes a rocket "too soon", the ring shows a dashed white flicker and its tick is drawn hollow, a
  clear "not yet" warning before the finger lifts.
- Recompute ticks every frame while drawing, and 10 times a second otherwise.

## Scoring, fail state, best

- Score only comes from rockets (table above). A score pop in the rocket's chalk colour rises from
  it: "Perfect +175", "Good +70", "Too soon +10".
- **Lives:** 3 chalk sticks in the tray. A dud or a smoulder takes one: the stick snaps in two,
  falls out of the tray and the board shakes 3 px for 0.15 s, with `GameKit.buzz()`.
- **Fail state:** losing the third stick ends the show. The spark puffs out, the remaining rockets
  tip over, and the card reads "Show's over". It shows score, best, rockets lit, perfects, longest
  streak and show length (m:ss). Tap to draw again.
- **Best score** persists with `GameKit.best()` / `GameKit.saveBest(n)`. A new best gets a big
  yellow chalk star doodle on the card.

## Difficulty curve (t = seconds played)

- Spark speed `v(t) = min(0.24, 0.13 + 0.0005 t)` U/s.
- Cue time `C(t) = max(5.0, 10 - 0.022 t)` s.
- Spawn interval `I(t) = max(1.7, 5.0 - 0.014 t)` s.
- Big rockets from 60 s, twins from 100 s, drizzle from 150 s (a cloud every 30 s, an ellipse
  `0.45 x 0.30 U`, crossing from a random side at `0.06 U/s`).

| t | spark (U/s) | cue time | new rocket every | rockets waiting | new things |
|---|---|---|---|---|---|
| 0 s | 0.13 | 10.0 s | 5.0 s | about 2 | plain rockets |
| 60 s | 0.16 | 8.7 s | 4.2 s | about 2 | big rockets |
| 120 s | 0.19 | 7.4 s | 3.3 s | 2 to 3 | twins |
| 180 s | 0.22 | 6.0 s | 2.5 s | 2 to 3 | drizzle |
| 240 s | 0.24 | 5.0 s | 1.7 s | about 3 | all of it |

- **Why it lasts 3+ minutes:** in the first minute there is a rocket every 5 s and the spark is
  slow, so a new player learns to wiggle and makes few mistakes. From about 120 s, rockets wait in
  twos and threes, so the route has to dodge one rocket while it reaches another, and an early
  wrong line boxes you in with your own unlit fuse. Drizzle moves the ticks. Three sticks, plus one
  back for each 8-streak, carry a new player to about **3 to 4 minutes**. A strong player passes 6.
- **Expected scores:** a first show 1,500 to 3,500; a good show 8,000+.
- **Tuning knobs** for QA if shows are far from 3 to 5 minutes: the floor of `I(t)`, the
  `+-0.4 s` perfect window and the spool limit.

## Demo autopilot (`__game.demo(on)`)

- Keep a plan: the unlit rockets sorted by cue time. Every 0.25 s, if the unlit fuse ahead of the
  spark would burn out in under 3 s, or the next rocket has no tick, plan the next leg.
- **Plan a leg** from the fuse end `E` to the next rocket `R`:
  - The spark reaches `E` at time `tE` (from the tick predictor). Needed length
    `L = v x (T_R - tE)` (use `v` at `tE`). Straight distance `D = |E - R|`.
  - If `L <= D`: draw straight to `R` (it will be Good or late, but not a dud).
  - Else search for a waypoint `P` on a grid every `0.06 U` across the field so that
    `|E - P| + |P - R|` is within `0.3 x v` of `L`, and both segments pass all the blocked tests
    and stay `0.08 U` from every other unlit rocket. Take the valid `P` with the smallest error.
    If none, try two waypoints (sample 200 random pairs). If still none, draw a zigzag toward `R`
    with amplitude `a` from `L = 2n x sqrt((D/2n)^2 + a^2)`, with `n = ceil(L / 0.25 U)`.
  - After `R`, keep going: plan the next rocket from `R`. If no rocket is waiting, draw a gentle
    loop of `0.4 U` toward the most open part of the field, away from rockets.
- **Show the drawing:** a soft round finger dot moves along the planned line at `0.9 U/s`, so the
  fuse is visibly drawn and the ticks slide into the notch on screen.
- `demo(true)` must comfortably pass 4 minutes at 390 x 844 and 375 x 667. `demo(false)` hands
  control back.
- Screenshot moments: (01) about 25 s, the finger mid-draw with a yellow-glowing ring and an S-bend;
  (02) about 90 s, two bursts in the air and a "Perfect" pop with x2+; (03) about 170 s, a twin pair,
  a big rocket and the drizzle cloud on screen with a 4-figure score.

## Art direction: coloured chalk on an old slate board

Nothing like our earlier games. Bank Shot is neon. Lantern Drift is a dark purple night lake with an
orange glow. Burrowbank is sunny paper-cut sand in teal and navy. Wheelthrown is matte moss and
terracotta clay. Griddlewise is a cobalt-tile screen print. Glasswright is limestone and jewel glass.
Sow Far is a pink and green risograph zine. Simmerstone is a pastel felt diorama. Tintrot is tin toys
with black outlines on walnut. Gulpwort is a coral vinyl sticker sheet. Glideleaf is a gouache
picture book on sky blue. Wickwalk is **a chalk drawing on a dusty green-black school slate**:
every shape is a hand-drawn chalk stroke with broken, grainy edges, colours are soft pastel chalk,
and old erased writing ghosts faintly under everything. A real wooden frame and chalk tray edge the
screen. No fills that look printed, no gloss, no hard vector edges, no outlines in black.

| Use | Hex |
|---|---|
| Slate (board base) | `#1f2e29` |
| Smudges (big soft blobs, 50%) | `#2a3b35` |
| Ghost erasures (old scribbles, 25%) | `#33463f` |
| Chalk white (UI, bandstand, cards' strokes) | `#f2efe4` |
| Chalk dust (particles, 35%) | `#c9cfc6` |
| Mint chalk (accent: lantern, trees, title, spool) | `#66e0b4` |
| Fuse cord (unlit), its twist ticks | `#e9dcc0`, `#b8a98a` |
| Damp fuse | `#8cc8ef` |
| Ash | `#6f7a74` |
| Spark core, sputter sparks | `#fff6c8`; `#ffc95a`, `#ff9c4a` |
| Rocket chalks (random per rocket) | pink `#f5a3c0`, yellow `#f7df6e`, sky `#8cc8ef`, lilac `#c3a6ef`, peach `#f8b48a`, mint `#66e0b4` |
| Gold notch, perfect glow | `#f7df6e` |
| Late ring, blocked X | `#f07a6a` (coral chalk) |
| Puddle hatching | `#8cc8ef` at 60% |
| Blanket checks | `#c3a6ef` and `#f8b48a` at 55% |
| Drizzle cloud, rain dashes | `#c9cfc6` at 30%, `#8cc8ef` |
| Wooden frame, its inner edge | `#6b4a2f`, `#8a6440` |
| Chalk tray, chalk sticks (lives) | `#5a3d26`; `#f2efe4`, `#f5a3c0`, `#f7df6e` |
| Card fill (a lighter wiped patch of slate) | `#2c3d37` with a chalk-white scribbled border |

- **Chalk look (all canvas):** at load, build a 256 x 256 grain tile (random tiny specks with
  alpha). Draw every stroke with round caps, then knock it back with the grain using
  `destination-out` at 35%, so strokes look broken and powdery. Draw each long stroke twice, the
  second pass offset by 1 px at 40%, for a doubled chalk edge. Bake static things (slate, ghosts,
  smudges, frame, obstacles) into one offscreen canvas per run.
- **Fuse:** two thin cream chalk lines 3 px apart with short diagonal ticks every 6 px, like twisted
  cord. Drawn with the same smoothing (one Chaikin pass) used only for rendering.
- **Spark:** a 5 px cream-white core with a small soft halo (radius 14 px, 30%), throwing 8 to 12
  short-lived sputter sparks a second in yellow and orange that leave chalk-dust specks.
- **Rockets:** seen from above: a chalk circle base with a little cone and a four-point star
  doodle, in its colour, inside its cue ring. Big rockets have a double outline and stripes.
- **Bursts:** the rocket streaks up the screen (a white chalk line, 0.35 s, up `0.25 to 0.4 U`,
  clamped inside the field) and bursts into 24 to 40 radial chalk strokes in its colour, which drift
  out, droop a little and fade to dust over 1.6 s. Perfect adds a second inner ring and a white
  crackle of dots. Big adds a third ring and long drooping willow strokes. Too soon is a tiny low
  pop of 8 strokes. A dud tips over with a puff of grey dust.
- **Obstacles:** puddle as a sky-blue hatched ellipse with ripple arcs; picnic blanket as a lilac
  and peach checked square; tree as a mint scribbled canopy with a trunk dot; bandstand as a white
  octagon with a little flag. Drawn from above, all in chalk.
- **Motion:** the slate never moves. Chalk dust drifts slowly upward in a few specks. Rings fill
  smoothly. The lantern flickers softly. The drizzle cloud is a scribbled grey ellipse with short
  blue dashes falling slantwise.
- **Type:** **handwritten chalk lettering**, a new voice for us (earlier games use rounded sans,
  heavy italic serif, condensed caps, slab serif, old-style caps, humanist lowercase, wide
  grotesque, bouncy stickers and geometric sans). Use the system fonts
  `"Chalkduster", "Chalkboard SE", "Marker Felt", "Comic Sans MS", cursive` (no font files are
  shipped). Big numbers and the title in Chalkduster; small UI text in Chalkboard SE, sentence case,
  tabular numbers. Never bold-stroked or outlined. Text is drawn with the same grain knock-back so
  it looks chalked.
- **Title screen:** the word "Wickwalk" is chalked across the slate. A spark runs along a fuse that
  underlines it in one long wiggle, then a mint and pink burst goes off above it. "Tap to start" in
  small chalk below.
- **Layout:** the score sits top centre with no panel. The spool meter is a short chalk bar at the
  top right. The lives are real chalk sticks lying in the tray at the bottom, which is new for us
  (no hearts, no icons in the HUD for lives).

## Sound (optional, WebAudio via `GameKit.sound`, silent until the first tap)

- Drawing: a very soft chalk scratch (filtered noise, band 2 to 4 kHz, 0.02 s grains every
  0.04 U drawn, low volume).
- Spark burning: a faint crackle (a 0.01 s noise tick at random every 0.08 to 0.2 s, very quiet).
- Launch: a rising whistle (sine 600 to 1400 Hz over 0.3 s).
- Burst: a soft noise pop plus a low sine thump (90 Hz, 0.12 s). Perfect adds a bright chime
  (sine 880 then 1320 Hz). Each step of the streak raises the chime one pentatonic step.
- Too soon: a little "pfft" (short noise, 0.06 s). Dud or smoulder: a dull chalk snap (noise
  0.04 s plus triangle 180 Hz, 0.1 s), with `GameKit.buzz()`.
- No music.

## Review note

Tap to start. Drag from the end of the glowing fuse to draw where the spark goes next. Make the
spark reach each rocket as its ring closes (wiggle the fuse to wait, go straight to hurry). The
show ends after three misses.
