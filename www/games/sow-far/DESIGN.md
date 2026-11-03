# Sow Far

**Tagline:** Run the lane. Plant the path. Get a little farther. (51 chars)

**Genre (registry):** idle garden runner (hybrid-casual meta-progression runner)

**Accent:** `#ff48b0` (fluorescent pink ink)

## Trend and evidence

- **Trend:** hybrid-casual idle / meta-progression runner. Short runs with one input, then you
  spend what you earned on upgrades between runs, so each run gets a little farther.
- **Evidence:** scout report `data/scout/2026-11-02.md`, trend #1 and the scout's top pick.
  AppMagic's H1 2026 casual report (via Game Dev Reports) says hybrid-casual was the only casual
  segment whose in-app revenue grew (up 20% to $4.2B), with growth in idle-style meta loops, while
  hypercasual is fading (Appodeal 2025 benchmark). There are no chart snapshots in `data/trends/`
  yet, so this is directional.
- **Genre spacing:** the last 6 games are slingshot mini golf, one-touch flyer, hex arrow puzzle,
  merge puzzle, pancake sort puzzle and roguelike block puzzle. No runner and no idle game. Lantern
  Drift is a side-scroller too, but it is a hold-to-rise flyer with fixed levels. Sow Far is a
  ground runner with jumps, an endless course and a meta economy, so it plays nothing like it.

## The twist (what makes it its own game)

In most meta runners you spend coins in a shop menu on numbers: +10% speed, +1 magnet level.
**In Sow Far your upgrades are planted into the course itself.**

1. **The lane is always the same.** The course is endless but fixed: metre 312 always has the
   same bramble, the same pit, the same plot of bare soil. You learn it the way you learn a walk
   you take every day.
2. **Seeds are the money, and you sow them where you want them.** Between runs the camera pulls
   back over the lane. Every 40 m there is a bare plot. Tap a plot to plant there. What grows
   depends on the spot: a vine bridge before a chasm, a spring mushroom before a tall stump, a
   heartfruit tree every 200 m, a berry bush everywhere else.
3. **You see your progress on the run.** Next run you pass your own bushes, bounce off your own
   mushrooms and cross your own bridges. The garden is the progress bar. It gets greener and pinker
   every run, and it is different for every player because each player chose where to plant.
4. **It grows while you are away (the idle part).** Berry bushes keep making berries in real time,
   so when you come back tomorrow they are heavy with fruit, which bursts into seeds as you run past.

A player would describe it as "the running game where you plant your own way forward", not as a
reskin of any runner.

## Controls

- **One verb: jump.** Touch anywhere to jump. **Hold to jump higher**, up to 0.25 s of extra lift.
  Release early for a short hop.
- Jump buffer 0.1 s (a touch just before landing still jumps); coyote time 0.08 s (a touch just
  after running off a ledge still jumps).
- The runner runs on her own. There is no steering and no duck.
- **Garden view** (title and after a run): drag left or right to scroll along the lane. Tap a plot's
  stake (in the soil under the plot) to open its tag card; tap the card to plant or grow it. Tap
  anywhere else (not on a stake, not a drag) to start a run. While a tag card is open, a tap outside
  it only closes the card.
- Mouse works the same: click, click-hold, click-drag. One thumb, portrait.

## Units and physics

The world is measured in metres. The runner's hitbox is 0.6 m wide and 1.0 m tall, standing at
22% of the screen width. The ground line is at 66% of the screen height in play and garden view.

| Thing | Value |
|---|---|
| Gravity | 30 m/s^2 |
| Gravity while held, rising and less than 0.25 s after takeoff | 12 m/s^2 |
| Jump speed | 10 m/s up |
| Tap hop | apex 1.67 m, 0.67 s in the air, range 0.67 x speed |
| Full hold | apex 2.94 m, 0.93 s in the air, range 0.93 x speed |
| Spring mushroom bounce | 14 m/s up (apex 3.3 m) |

Camera zoom follows speed so you always see about 1.1 s ahead: visible width is
`13 + 4.7 * (speed - 6) / 5.5` metres (13 m at the start, 17.7 m at top speed).

## Hazards (dark ink means danger)

| Hazard | From | Shape | How to beat it |
|---|---|---|---|
| Bramble | 0 m | low tangle, 0.6 m tall, `1.2 + 0.15 x speed` m long (+-0.3) | tap hop |
| Pit | 0 m | hole, width `(0.45 + rand 0.25) x 0.93 x speed` m | hop or hold, timing |
| Stump | 150 m | 1.9 m tall, 0.8 m wide | must hold (a tap hop is 0.23 m too low) |
| Crow | 400 m | flies toward you at 2 m/s, body from 1.5 m to 2.1 m high | **don't** jump under it, or jump early and land before it |
| Pair | 700 m | bramble then pit 3 m apart | two quick hops or one long hold |
| Pit-stump | 1000 m | a stump on the far lip of a pit | full hold, early |
| Chasm | 366 m | 14 m wide, too wide to jump | needs a vine bridge (see the garden) |

- **Hit** (bramble, stump, crow): lose a heart, a 6 px screen shake for 0.2 s, 1.2 s of blinking
  invulnerability, keep running.
- **Fall** (pit or chasm): lose a heart; a puff of pink thistledown lifts the runner out and sets
  her on the far lip in 1.0 s. The run continues.
- **Fail state:** 3 hearts per run. At 0 hearts the runner tumbles, her hat flies off spinning,
  and after 0.6 s the camera pulls back into the garden view. The run is over.

## Difficulty curve (d = distance in metres)

| Lever | Formula | 0 m | 500 m | 1000 m | 1500 m |
|---|---|---|---|---|---|
| Run speed | `min(11.5, 6 + 0.01 d)` m/s | 6 | 11 | 11.5 | 11.5 |
| Clear ground between hazards | `max(8, 18 - 0.0065 d) + rand(0, 4)` m | 18-22 | 14.8-18.8 | 11.5-15.5 | 8.3-12.3 |
| Time between hazards (approx.) | spacing / speed | 3.3 s | 1.5 s | 1.2 s | 0.9 s |
| Hazard mix | see below | bramble, pit | + stump, crow | + pairs | + pit-stumps |
| Chasms | start 6 m after the plots at 360, 640, 920, 1200 ... (every 280 m) | none | 1 so far | 3 so far | 4 so far |

Hazard mix weights:

| Distance | Bramble | Pit | Stump | Crow | Pair | Pit-stump |
|---|---|---|---|---|---|---|
| 0-149 | 60 | 40 | - | - | - | - |
| 150-399 | 40 | 30 | 30 | - | - | - |
| 400-699 | 30 | 25 | 30 | 15 | - | - |
| 700-999 | 25 | 20 | 25 | 15 | 15 | - |
| 1000+ | 20 | 20 | 20 | 15 | 15 | 10 |

Time to reach 500 m is about 60 s, 1000 m about 1 min 45 s, 1500 m about 2 min 30 s. A fresh
player reaches about 150-250 m on run one. With a planted garden, a good player can run past
2000 m (3+ minutes in one run). The session (run, plant, run again) is the 3-6 minute loop the
trend is about.

The course comes from a seeded random generator keyed on distance (`mulberry32(seed + segment)`),
so it is the same every run on every device. Each plot has 3 m of clear flat ground on both sides.

## The garden (meta progression)

Plots sit every 40 m, from 40 m on. Only plots up to `max(best, 40) + 40` m can be planted, so you
can plant one plot past your best.

**Plot type** (first match wins):

1. The plot 6 m before a chasm: **vine bridge**.
2. Every 200 m: **heartfruit tree**.
3. Plot number `i` (distance `40 i`) with `i % 3 == 2` and distance 140 m or more: **spring
   mushroom**, and the course puts a stump 5 m after it.
4. Everything else: **berry bush**.

| Plant | Level 1 | Level 2 | Level 3 | What it does on the run |
|---|---|---|---|---|
| Berry bush | 20 seeds | 50 | 110 | Bursts 3 / 6 / 10 seeds as you pass. Idle: stores 1 extra berry every 4 minutes of real time, up to 5 / 10 / 15, collected on your next pass |
| Spring mushroom | 35 | 80 | - | Run onto it while on the ground and it bounces you 14 m/s up, over its stump. Level 2 adds a 6-seed arc at the top of the bounce |
| Vine bridge | 60 | 130 | - | Spans the chasm, so you run across. Level 2 hangs 8 seeds along it |
| Heartfruit tree | 90 | 200 | - | Gives back 1 / 2 hearts as you pass (max 3) |

**Seeds on the run:** 1 seed each. A 4-seed arc floats over 35% of hazards (rewarding a clean
jump); a flat line of 5 seeds sits on any stretch of clear ground 12 m or longer. That is about
0.2 seeds per metre, so run one earns about 40-50 seeds: enough for two berry bushes. The first
chasm is at 360 m; a bridge there is the first real goal.

**Score:** distance in whole metres. **Best:** the farthest distance, saved with
`GameKit.saveBest`. Also saved with `GameKit.set`: seed bank, plot levels (`{plotIndex: level}`),
last-seen timestamp (for idle berries), and whether the first-run hints have been shown.

## Screens

- **Title (mode `title`):** the garden view at the start of the lane with the name "SOW FAR" set
  huge across the sky, best and seed bank under it, and "TAP TO RUN" over the ground. First launch
  also shows "HOLD TO JUMP HIGHER". Tap anywhere (not a stake) to start.
- **Play (mode `play`):** distance top right in huge numerals (the web Back button takes the top
  left 60 x 60), three heartfruit icons and the seed count under it. The bottom 34% below the ground
  is soil with furrow lines and the **route ribbon**: a thin line from 0 to your best, with your
  planted plots as pink dots and a moving green marker for you. First run only: "HOLD" appears
  above the first stump and "LET IT PASS" above the first crow.
- **Over (mode `over`):** a printed result stamp at 18-40% of the height (distance, "BEST",
  "+N SEEDS", bank), "TAP TO RUN AGAIN" at 55%, then the garden view on the ground band starting at
  the place you fell, scrolled so the nearest plantable plot is on screen. Plot stakes are 72 x 72 px
  touch areas centred 40 px under the ground line. Affordable plots pulse pink. Taps are ignored for
  the first 0.3 s after the run ends.
- **Paused (mode `paused`):** on background (GameKit.onPause), a "PAUSED" stamp; tap to resume.

## Autopilot (`window.__game.demo(on)`)

Looks ahead along the fixed course: taps for brambles and pits (holding for wide pits, timed so it
lands past the far lip), holds fully early for stumps, never jumps while a crow is within 4 m ahead,
and just jumps at an unbridged chasm. In over mode with demo on it plants the cheapest affordable
plot. It should regularly reach 600 m+ so the store screenshots show speed and a garden.

## Art direction: risograph print, two inks on paper

Nothing like our earlier games. Bank Shot is neon, Lantern Drift a dark night lake with an orange
glow, Burrowbank sunny paper-cut sand in teal and navy, Wheelthrown matte moss and terracotta,
Griddlewise a cobalt-tile screen print, Glasswright limestone and jewel glass. Sow Far looks like a
**two-colour risograph zine**: fluorescent pink and bright green ink on off-white paper, halftone
dots instead of gradients, a visible paper grain, and the pink plate printed slightly out of
register. Where the two inks overlap they make a deep teal-black, and that overprint colour is
the only dark in the game.

| Use | Hex |
|---|---|
| Paper (background) | `#f4f0e6` |
| Fluorescent pink ink (accent: sun, hat, berries, hearts, flowers, UI highlights) | `#ff48b0` |
| Pink 35% tint (far hills, halftone) | `#ffc0e2` |
| Green ink (ground, runner body, leaves, numerals) | `#00a95c` |
| Green 35% tint (mid hedgerow) | `#a6e0c0` |
| Overprint, pink over green (hazards, legs, text on paper, outlines) | `#123c42` |
| Paper grain specks | `#d9d2c1` at 6% |

**Rule of the palette:** pink and green are the friendly, collectable, plantable things. Danger is
always overprint dark (brambles, stumps, crows, pit shadows), so the player reads hazards at a
glance.

- **Ink effects (all in canvas):**
  - **Halftone:** three pre-rendered dot pattern tiles (dot radius 1, 2 and 3 px on a 7 px grid)
    used with `createPattern` for the sky sun, far hills and pit walls. No gradients anywhere.
  - **Misregistration:** pink shapes that sit on or beside green ones (the hat, berries, flowers,
    heart icons, the pink numeral shadow) are drawn 2 px right and 1 px up from their true spot.
  - **Overprint:** where pink lies over green, draw with `globalCompositeOperation = 'multiply'`
    so the overlap turns dark (the shadow under the hat brim falls out of this for free).
  - **Grain:** a 128 x 128 noise tile built once at load, drawn over the whole screen at 6%.
- **Layout (portrait):** paper sky with a giant halftone pink sun (radius 32% of the width) at the
  upper right that drifts very slowly. Far hills: pink halftone, parallax 0.15. Mid hedgerow: flat
  green tint bumps, parallax 0.45. The ground is a solid green slab from 66% of the height down to
  the soil band, then paper with dark furrow lines (knocked-out stripes) and the route ribbon.
- **The runner ("the sower"):** a round green body (rounded teardrop), a huge fluorescent pink
  straw hat (wide flat brim 1.1 m across, dome crown, overprint hat band), a paper-white eye with an
  overprint pupil peeking under the brim, two overprint stick legs, and a small overprint seed sack
  on her back tied with pink. Her silhouette is the hat. She drops a seed every few steps that
  sprouts into a tiny two-leaf sprout behind her (pure decoration, it fades off screen).
- **Plants:** berry bush is a cluster of green circles with pink berry dots (more berries as it
  stores idle fruit); spring mushroom is a pink dome cap with paper dots on a green stem; vine bridge
  is a green rope sag with pink five-dot flowers; heartfruit tree is a green lollipop canopy with
  pink heart fruit. Bare plots are a little overprint stake with a paper tag and a furrowed mound.
- **Hazards:** brambles are overprint scribble loops with pink-tipped thorns; stumps are overprint
  slabs with paper ring lines on top; crows are overprint wedge silhouettes with a pink eye and a
  2-frame flap; pits are paper holes whose walls are overprint halftone.
- **Type:** a condensed heavy grotesque, all caps, like a gig poster:
  `"Avenir Next Condensed", "Arial Narrow", "Roboto Condensed", "Helvetica Neue", sans-serif`,
  weight 800, `font-stretch: condensed`. Distance numerals are huge (64 px) green ink with a pink
  misregistered copy behind them. Labels are 13 px, letter-spacing 0.12em. No serifs, no rounded
  sans, no italic: that keeps it apart from every earlier game.
- **Motion:**
  - Run cycle: 4 leg poses at 10 frames per second (faster with speed), hat bobs 2 px.
  - Takeoff stretch 0.9 x 1.12 for 80 ms; landing squash 1.15 x 0.85 for 90 ms with 3 green dust
    dots.
  - Seed pickup: the seed jumps to the HUD counter in a 0.35 s arc; the counter pops 1.2x.
  - Mushroom bounce: the cap squashes to 0.6 height and springs back with two overshoots.
  - Planting (garden view): the plant "stamps" in, scale 1.3 to 1 over 160 ms, with a 2-frame pink
    ink splat ring, like a rubber stamp. Level-ups add the next layer the same way.
  - Hit: 6 px shake, runner blinks 6 times over 1.2 s. Fall: thistledown puff (pink halftone
    circle) carries her over.
  - Over: the camera eases back (0.7 s, ease-out) and zooms out to 0.6 for the garden view.

## Sound (WebAudio via `GameKit.sound`, silent until the first tap)

- Jump: soft triangle 330 Hz rising to 520 Hz over 0.08 s (longer and higher with a full hold).
- Land: low sine thud 140 Hz, 0.04 s.
- Seed: sine pluck 880 Hz, each pickup within 0.5 s of the last goes up a step of a pentatonic scale.
- Berry burst / bridge seeds: quick 3-note pentatonic run.
- Mushroom bounce: square "boing" 200 to 600 Hz over 0.15 s.
- Hit: square 110 Hz, 0.06 s, plus `GameKit.buzz()`.
- Fall rescue: airy triangle 660 then 990 Hz.
- Plant: two-note chime 784 then 1046 Hz, triangle.
- Game over: triangle 392, 330, 262 Hz, 0.14 s each, plus `GameKit.buzz('heavy')`.

## Review note

Tap to start. Touch to jump and hold to jump higher; avoid brambles, pits, stumps and crows. After
each run, tap a plot's stake to plant with the seeds you collected (bridges, bushes, mushrooms,
trees) so your next run goes farther. The run ends when all 3 hearts are lost.
