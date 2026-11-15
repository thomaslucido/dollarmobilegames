# Gulpwort

**Tagline:** Snap the flies. Spare the bees. Keep all three fed. (51 chars)

**Genre (registry):** flytrap snap arcade

**Accent:** `#a8d12a` (flytrap chartreuse)

**Category:** GAMES_ARCADE

## Trend and evidence

- **Trend:** arcade quick-score action. One screen, one reflex verb (tap to time a hit), short
  runs of 1 to 5 minutes, instant restart, a best score to beat.
- **Evidence:** scout report `data/scout/2026-11-14.md`, trend #1. AppMagic H1 2026 (via
  PocketGamer.biz) lists arcade as one of only four genres that grew in the US in H1 2026. AppMagic
  H1 2025 had US arcade up 52% year on year, the top US growth rate that year. One 2024 opt-in data
  set conflicts. `data/trends/` is still empty, so this is **directional only** (low-medium
  confidence).
- **Why this trend:** it is the only trend on the scout list with real evidence that is not puzzle,
  and arcade is not in our last 6 games (merge, pancake sort, roguelike block puzzle, idle garden
  runner, cozy tending sim, wind-up lane defense). Trend #2 (kids casual) had too little evidence.
- **Core verb, checked against our earlier games:** **tap a column at the exact moment a moving
  bug is inside a jaw.** Nothing scrolls (not Sow Far's runner or Lantern Drift's hold-to-rise).
  Nothing is held, charged or sent down a lane (not Tintrot). Nothing is dragged or aimed (not Bank
  Shot). It is pure moment-of-contact timing against moving targets, on one fixed screen.
- **Distance from famous games:** there is no slicing, no rotating target, no tongue, no stacking
  and no whack-a-hole grid. The player is three hungry potted plants that never move from their
  pots, and the threat is starving, not being hit.

## The pitch

A sunny windowsill, drawn as a sheet of chunky stickers. Three potted flytraps sit on the shelf,
jaws open, swaying on their stems. Flies, gnats, moths and dragonflies buzz in from the sides to
sniff at the sweet red jaws. **Tap a plant's column to snap its jaws shut.** Catch a bug inside and
the plant gulps it down. But bees visit too, and a bee in the jaws stings. Every plant gets
hungrier every second, and a plant that goes hungry for too long wilts.

## The twist (what makes it its own game)

1. **You are three plants, and all three must eat.** Each plant has its own belly that drains all
   the time. Bugs go where they like, so the player keeps glancing between three jaws and three
   bellies. A full plant still needs feeding soon; an empty one needs it now.
2. **The jaws sway.** Each stem sways on its own slow rhythm. The catch zone moves under a bug that
   is also moving, so the snap is a real two-body timing call, not a tap on a still target.
3. **Bees are friends.** A bee anywhere in the jaws turns the snap into a sting: everything else in
   the jaws escapes and the plant is dazed. The best fly of the run may be hovering right next to a
   bee.
4. **Gulps and chewing.** One snap can catch two or three bugs at once for a gulp bonus. But a plant
   that just ate is chewing for 0.9 s and cannot snap, so a greedy early snap can leave that jaw
   shut while the big moth drifts past.
5. **Overfed plants bloom, and blooms draw bees.** Fill a belly past full and a white flower opens
   on a tall stalk beside the jaw. Catches there score double. But bees love flowers, so a blooming
   plant is the one bees visit most.

A player would describe it as "the flytrap game where you tap to snap bugs, keep three plants fed
and must not eat the bees", not as a version of any other game.

## Controls

- **One verb: tap.** The screen is split into three equal columns. A tap anywhere in a column (the
  sky above it, the jaw, the pot) snaps that column's plant. Multi-touch: each finger snaps its own
  column, so two thumbs can play.
- A tap on a plant that is chewing, reopening, dazed or wilted does nothing except a 2 px wobble of
  that plant (feedback that it is busy). It is not counted as an empty snap.
- Works the same with a mouse. Tap the card to start, retry or resume.

## Geometry (portrait, share of screen width W and height H)

| Zone | Where |
|---|---|
| HUD | 0 to 10% H. Top-left 60 x 60 px stays clear for the web Back button |
| Air (where bugs fly) | 10% to 78% H |
| Shelf (plum strip with three pots) | 80% to 100% H, above the bottom safe area |

- **Plants:** pot centres at x = 0.2 W, 0.5 W, 0.8 W, pot tops at 0.84 H. Each stem pivots at its
  pot top. Jaw centres at rest: left (0.2 W, 0.60 H), centre (0.5 W, 0.50 H), right (0.8 W,
  0.60 H). The centre plant is the tallest.
- **Catch zone:** a circle of radius `R = 0.11 W` (43 px at 390 wide) around the jaw centre. A
  bug counts as inside if its centre is inside the circle. The open jaw is drawn about 1.2 R wide,
  so what the player sees matches the rule.
- **Sway:** the stem angle is `A(t) x sin(2 pi t / P + phase)`. Amplitude
  `A(t) = min(14, 4 + 0.06 t)` degrees (t = seconds played; 14 degrees at about 167 s). Periods
  3.4 s (left), 2.9 s (centre), 3.9 s (right), each multiplied by `max(0.7, 1 - 0.0015 t)`. Phases
  0, 2.1, 4.2 rad. At 14 degrees the centre jaw travels about +-0.17 W sideways.

## Plant states

| State | Lasts | Can snap? | Look |
|---|---|---|---|
| Open | until tapped | yes | jaws wide, teeth fringe up, eyes open, a slight idle breathe |
| Snap | 0.08 s | no | jaws slam shut with a squash |
| Chewing (caught at least one bug) | 0.9 s | no | cheeks bulge 3 times, eyes happy |
| Reopening (empty snap) | 0.5 s | no | jaws ease open, eyes annoyed |
| Dazed (stung) | 1.5 s | no | swirly eyes, a pink bump, the bee zips off |
| Wilted | 3.0 s | no | stem droops, colours fade, eyes shut, then the plant springs back up |

## Bellies

- Each plant has a belly from 0 to 100, starting at 70. It drains all the time at
  `d(t) = min(6, 2.6 + 0.012 t)` per second (2.6/s at the start, 6/s from 283 s). A full belly
  lasts 38 s at the start and 17 s late in a run.
- Eating adds the bug's belly value (table below). An **empty snap** costs 6 belly.
- **Wilt:** a belly that reaches 0 wilts the plant: one of the three leaf stickers in the HUD peels
  off. After 3.0 s the plant springs back with belly 50.
- **Bloom:** a belly that goes over 100 holds at 100 and the plant **blooms**: a white flower opens
  on a tall stalk beside the jaw (its centre 1.7 R above and 0.6 R to the outside of the jaw
  centre). Catches on a blooming plant score x2. The bloom closes when the belly drops below 70.
- **Belly gauge:** a pill-shaped gauge sticker on each pot. Chartreuse above 40, sunflower yellow
  from 20 to 40, red below 20 with a 3 Hz pulse and a worried face on the plant.

## Bugs

All speeds in W per second, multiplied by `m(t) = min(1.7, 1 + 0.0035 t)` (1.7 at 200 s). After
240 s, m rises another 0.03 every 30 s, up to 2.0.

| Bug | Belly | Points | Base speed | Visit (time near a jaw) | How it moves | First appears |
|---|---|---|---|---|---|---|
| Fly | +30 | 10 | 0.38 | 0.9 s | quick small loops (radius 0.5 R, 1.6 turns/s) | 0 s |
| Gnat cloud (5 gnats) | +10 each | 4 each | 0.22 | 1.6 s | a loose cloud (radius 0.6 R) that drifts and wobbles; each gnat is caught on its own | 30 s |
| Moth | +50 | 25 | 0.26 | 1.4 s | big lazy loops (radius 1.1 R), so it is only inside part of the time | 60 s |
| Dragonfly | +40 | 30 | 0.9 in dashes | 0.45 s stops | dashes between 3 stops; one stop is inside a catch zone | 100 s |
| Bee (never eat) | sting | 0 | 0.30 | 1.2 s | bumbling wobble; aims for a bloom flower if one is open (60% of bees) | 20 s |

- **Flight path:** a bug enters from the left or right edge at y between 0.14 H and 0.45 H. It
  picks a target plant (a random open or chewing plant, any plant if none) and a visit point at a
  random spot 0.3 R to 1.4 R from that jaw centre. It curves down to the visit point, moves around
  it for its visit time (divided by m), then curves up and out of the far edge. Visit times shrink
  as m grows, so late bugs linger less. A bug that leaves the screen is just gone: no penalty
  except the meal you missed.
- **Bees** aim at a bloom flower when one is open (60% of the time) or at a jaw like any other bug.
  A bee on its way to a flower passes through or near that plant's catch zone.
- **Spawn interval:** `max(0.55, 1.5 - 0.005 t)` s with +-20% jitter (floor at 190 s). A gnat
  cloud counts as one spawn. At most 9 bugs on screen (a gnat cloud counts as 2).
- **Mix by time played:**

| Time | Fly | Gnats | Moth | Dragonfly | Bee |
|---|---|---|---|---|---|
| 0 - 19 s | 100% | | | | |
| 20 - 29 s | 85% | | | | 15% |
| 30 - 59 s | 60% | 20% | | | 20% |
| 60 - 99 s | 45% | 15% | 15% | | 25% |
| 100 s + | 35% | 15% | 12% | 13% | 25% |

- Never two bees in a row from the same edge. The first bee of a run is announced by a small
  "spare the bees!" sticker that slaps on near the HUD for 1.5 s.

## The snap

On a tap, if the plant is open:
1. Collect every bug whose centre is inside the plant's catch zone right now.
2. **Any bee inside: sting.** No points, belly -25, plant dazed 1.5 s, streak reset. The other bugs
   in the jaws fly out unharmed (they scatter away fast).
3. **No bee, at least one bug: gulp.** Every bug inside is eaten. The plant chews for 0.9 s.
4. **Nothing inside: empty snap.** Belly -6, the plant reopens over 0.5 s, streak reset.

## Scoring, fail state, best

- **Gulp score:** `sum of bug points x gulp size x bloom x streak`, rounded.
  - gulp size = the number of bugs in this snap (a 3-gnat gulp is 4 x 3 x 3 = 36 before the other
    multipliers). Gulps of 2+ show a "GULP x2" / "GULP x3" sticker.
  - bloom = 2 if the plant was blooming, else 1.
  - streak = `min(3, 1 + 0.5 x floor(s / 8))`, where s is the number of successful snaps in a row
    (x1.5 at 8, x2 at 16, x3 at 32). An empty snap, a sting or a wilt resets s. The current streak
    multiplier shows under the score when above x1.
- **Leaves (lives):** 3 leaf stickers in the HUD. A wilt peels one off.
- **Regrow:** every 25 bugs eaten in a row without a wilt, if a leaf is missing, it regrows.
- **Fail state:** the third wilt. All three plants droop together and the game-over sticker slaps
  on: "All wilted", with score, best, bugs gulped, biggest gulp and time survived. Tap to plant
  again.
- Best score persists with `GameKit.best()` / `GameKit.saveBest(n)`. A new best shows a "new best!"
  sticker on the card.
- **Expected play:** the first minute is flies only, then bees: gentle. Gnats and moths by 60 s;
  dragonflies, wide sway and faster bugs by 100 to 160 s. Most new players lose their first leaf
  around 1:30 to 2:30. A typical run is 3 to 5 minutes; a strong player who keeps all three fed and
  chases blooms passes 6. Scores: a first run about 600 to 1500, a good run 5000+.
- **Tuning knobs** (QA may adjust if runs are far off 3 to 5 minutes): the drain slope in `d(t)`, the
  spawn interval floor, and the bee share.

## Demo autopilot (`__game.demo(on)`)

The autopilot must play well so the store screenshots show busy skies, gulps and a real score.
Every frame, for each plant that is **open**:
1. List the non-bee bugs whose centre is within **0.85 R** of the jaw centre (a safe margin inside
   the real zone), and any bee within **1.25 R**.
2. If a bee is within 1.25 R: do not snap this plant this frame.
3. If one or more bugs are inside 0.85 R: snap, but wait up to 0.25 s if another non-bee bug is
   within 1.4 R and moving closer, as long as every bug already inside stays inside 0.85 R (go for
   a gulp).
4. **Hunger priority:** if a plant's belly is under 25, use 0.95 R instead of 0.85 R for that plant
   (take slightly riskier snaps when starving).
5. Add a 0.06 s reaction delay after a bug first enters, and never tap a plant that is not open
   (no busy wobbles, no empty snaps).

`demo(true)` should comfortably play past 4 minutes at 390x844 and 375x667. Good screenshot
moments: (01) about 25 s, flies around all three jaws with a gulp pop-up; (02) about 90 s, gnat
cloud and moth, a "GULP x3" sticker, streak multiplier showing; (03) about 150 s, a blooming plant
with a bee heading for its flower and a dragonfly mid-dash. `demo(false)` hands control back.

## Art direction: a tropical sticker sheet at noon

Nothing like our earlier games. Bank Shot is neon; Lantern Drift a dark purple night lake with an
orange glow; Burrowbank sunny paper-cut sand in teal and navy; Wheelthrown matte moss and
terracotta clay; Griddlewise a cobalt-tile screen print; Glasswright limestone and jewel glass; Sow
Far a pink and green risograph zine; Simmerstone a pastel felt diorama; Tintrot lithographed tin
toys with heavy black outlines on dark walnut. Gulpwort looks like a **sheet of glossy vinyl
stickers**: every object is a flat, bold shape with a **thick warm-white die-cut border** and a
**hard offset shadow**, laid on a **bright coral page with big soft polka dots**. Coral, chartreuse
and plum are a combination we have never used. It is the first of our games with white outlines
(Tintrot's are black). No ink outlines, no halftone, no paper grain, no felt, no glow, no
gradients except a single white gloss stroke on each sticker.

| Use | Hex |
|---|---|
| Page (background) | `#ff9b73` |
| Polka dots (radius 0.035 W on a 0.18 W offset grid) | `#ffab88` |
| Sticker die-cut border (5 px at 390 wide on big shapes, 3 px on small bugs) | `#fffaf0` |
| Sticker shadow on the page (hard, 4 px down-right) | `#de6a4c` |
| Sticker shadow on the shelf | `#2e1438` |
| Gloss stroke (a short curved highlight on each sticker, 60% opacity) | `#ffffff` |
| Shelf, its top edge | `#4a2457`, `#6b3a7c` |
| Pots: body, band, dots | `#fff1d6`, `#4a2457`, `#a8d12a` |
| Flytrap leaves: body (accent), shade, light tips | `#a8d12a`, `#7fa81a`, `#e3f5a0` |
| Stems and leaf bases | `#2f6b2a`, highlight `#4f8f36` |
| Jaw inside (mouth), deep mouth | `#e8344e`, `#b51f3c` |
| Teeth fringe | `#e3f5a0` |
| Plant eyes: white, pupil | `#fffaf0`, `#2a2530` |
| Belly gauge: full, low, starving | `#a8d12a`, `#ffcf2e`, `#e8344e` |
| Wilted plant (leaves, stem) | `#b8b07a`, `#7d7a52` |
| Fly: body, eyes, wings | `#2a2530`, `#e8344e`, `#d6ecff` at 85% |
| Gnats | `#2a2530`, wings `#fffaf0` |
| Moth: wings, wing spots, body | `#f1e2c2`, `#b89a6a`, `#8a6a48` |
| Dragonfly: body, head, wings | `#2f7df2`, `#1d4fb0`, `#e6f6ff` at 80% |
| Bee: body, stripes, wings | `#ffcf2e`, `#2a2530`, `#ffffff` |
| Bloom flower: petals, centre, stalk | `#fffaf0`, `#ffcf2e`, `#2f6b2a` |
| Text: fill, stroke, shadow | `#4a2457`, `#fffaf0`, `#de6a4c` |
| Sting / danger flashes | `#e8344e` |

- **Plants:** each flytrap is two chunky rounded half-moon leaves hinged at the back, chartreuse
  outside, red inside, with a row of 7 to 9 pale teeth along each rim. Two round sticker eyes sit on
  the upper leaf, so each plant has a face. The whole plant (jaw, stem and two little ground leaves)
  is one sticker with a single white border. Idle: the jaw breathes (opens 3% wider and back on a
  2.4 s sine) while it sways.
- **Bugs:** small cute sticker bugs with their own white borders, flapping wings (two frames
  swapped at 18 Hz). Flies have big red eyes, bees are round and striped with a tiny stinger, moths
  are soft and wide, dragonflies are long blue darts. A dragonfly leaves 5 fading white dots behind
  each dash.
- **Shelf and pots:** a plum shelf strip across the bottom; cream pots with a plum band and
  chartreuse dots, each wearing its belly gauge as a pill sticker.
- **Type: bouncy sticker lettering**, a new voice for us (Lantern Drift uses a rounded sans,
  Burrowbank a heavy italic serif, Wheelthrown and Sow Far condensed caps, Griddlewise a slab serif,
  Glasswright old-style serif caps, Simmerstone humanist lowercase, Tintrot a wide grotesque).
  `-apple-system, "Helvetica Neue", Arial, sans-serif`, weight 900, **all lowercase**, plum fill, a
  7 px warm-white stroke drawn first, then a 4 px down-right coral shadow. In titles and pop-ups
  **each letter is drawn on its own**, rotated by a fixed jitter list (-6, 4, -3, 5, -2, 6, -4
  degrees, repeating) and nudged +-3 px off the baseline, so words look like letter stickers stuck
  on by hand. HUD numbers use the same style with no rotation and tabular figures.
- **Panels:** title, pause and game-over cards are **big die-cut stickers**: warm white, a blobby
  rounded outline (28 px corner radius with 3 gentle bumps per side), a plum hard shadow, a curled
  corner at bottom right. Buttons are chartreuse pill stickers with plum text.
- **HUD:** score centred, big; best under it, small; streak multiplier ("x1.5") as a tiny tilted
  chartreuse sticker beside the score when active. The three leaf stickers sit top right.
- **Title screen:** the live windowsill with flies buzzing and the plants swaying and snapping on
  their own (the demo running quietly behind the card), the title sticker "gulpwort" in bouncy
  letters, "tap a column to snap. never eat a bee.", best score, and a "tap to start" pill.
- **Motion:**
  - Every pop-up sticker (+points, GULP x2, new best) **slaps on**: scale 1.4 to 1.0 with a little
    overshoot in 0.15 s at a random tilt of +-8 degrees, holds 0.6 s, then **peels off**: it squashes
    to zero height toward one corner in 0.2 s.
  - Snap: jaws shut in 0.08 s, the plant squashes 6%; teeth interlock. Gulp: cheeks bulge 3 times,
    two crumb dots pop out.
  - Sting: the bee bonks the jaw, swirly eyes, a pink bump, a 3 px shake of that plant only.
  - Wilt: the stem bends over in 0.4 s, colours fade to the wilted swatches, and a leaf sticker
    peels off the HUD and flutters down the page.
  - Bloom: the flower stalk grows up in 0.3 s and the petals pop open one by one.
  - Background polka dots drift very slowly diagonally (6 px/s) so the page feels alive.
  - 60 fps with delta time. Game over: everything droops together and the page dims 15%.

## Sound (optional, WebAudio via `GameKit.sound`, silent until the first tap)

- Snap: a short noise burst plus square 160 Hz, 0.04 s.
- Gulp: a sine bloop 300 to 620 Hz, 0.09 s; +2 semitones for each extra bug in the gulp.
- Empty snap: a dull triangle click 120 Hz, 0.03 s.
- Sting: sawtooth 220 Hz with a 30 Hz wobble, 0.25 s, plus `GameKit.buzz()`.
- Bloom: two-note chime, triangle 880 then 1320 Hz.
- Wilt: triangle sliding 440 to 150 Hz, 0.4 s, plus `GameKit.buzz()`.
- Leaf regrow: a soft rising sine 520 to 780 Hz.
- Bug buzz: no constant buzzing (it would grate); a tiny quiet 2 ms tick when a bug enters.

## Review note

Tap to start. Tap the left, middle or right of the screen to snap that flytrap's jaws shut when a
bug is inside them. Don't snap a bee. The game ends when plants have gone hungry and wilted three
times.
