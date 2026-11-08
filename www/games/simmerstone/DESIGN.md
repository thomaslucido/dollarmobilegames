# Simmerstone

**Tagline:** Warm the pools. Match the hats. Keep every monkey cozy. (55 chars)

**Genre (registry):** cozy hot spring tending sim

**Accent:** `#8b7fd1` (dusk lavender felt)

## Trend and evidence

- **Trend:** cozy, low-stress tending sims (tap to look after a small world and the creatures in it).
- **Evidence:** scout report `data/scout/2026-11-07.md`, trend #1 and the scout's first pick.
  Plarium reports US and European players increasingly name "stress relief" as their main reason
  to play; AppFollow sees "finally a game I can play without stress" reviews across many unrelated
  games. A cozy story/merge hybrid is in the worldwide top 5 grossing for October 2026 and up 95%
  YoY, which shows demand for the cozy mood (it is merge-led, so it is evidence, not a template).
  `data/trends/` is still empty, so this is directional.
- **Why this, not lane strategy:** trend #2 had the weakest evidence (low confidence, and its
  chart examples are large IAP war games). The cozy signal is broader, fits a $0.99 one-screen
  game, and pulls us away from the puzzle-heavy run of recent games.
- **Genre spacing:** the last 6 games are one-touch flyer (Lantern Drift), hex arrow puzzle
  (Burrowbank), merge puzzle (Wheelthrown), pancake sort puzzle (Griddlewise), roguelike block
  puzzle (Glasswright) and idle garden runner (Sow Far). No tending or care game. To stay clear of
  Sow Far, there are **no plants, seeds or gardens** in Simmerstone: it is water, warmth, snow and
  animals.

## The pitch

A snowy hillside of terraced hot spring pools at dusk. Snow monkeys in knitted hats wander down
the path to soak. Each one wants a certain warmth. You keep the pools at the right warmth by
dropping glowing ember stones into them. Content monkeys soak, sigh and fill the hill with steam.

## The twist (what makes it its own game)

Most tending games are "fill every bar to the top". Simmerstone is about **just right**, and about
**where the heat goes**:

1. **Goldilocks warmth.** Every pool is somewhere between icy and scalding. A monkey's hat says
   which warmth it wants: blue hat with 1 bobble = mild, green hat with 2 bobbles = warm, red hat
   with 3 bobbles = hot. Too much heat is as bad as too little: a scalding pool boils and everyone
   hops out onto the rocks. So you are not maxing anything, you are **curating a spread** of
   warmths that suits whoever is waiting.
2. **The hill is terraced, and hot water runs downhill.** Pools sit in a triangle of terraces
   (1, then 2, then 3). A stone dropped in a pool also spills a little heat into the **two pools
   just below it**, down little felt waterfalls. The top pool steers the whole hill. Heating it
   for a hot-hat monkey nudges the pools under it too, which is great when they need it and a
   problem when they hold mild-hat bathers.
3. **A small ember basket.** You hold at most 4 hot stones, and the brazier warms a new one every
   1.25 s. Tapping is never free, so you plan which pool gets the next stone.
4. **Cozy forgiveness.** Eight content soaks in a row and a grateful monkey leaves you a mandarin,
   which knits one lost mitten back.

A player would describe it as "the snow monkey hot spring game where you keep each pool the right
warmth", not as a version of any other game.

## Controls

- **One verb: tap a pool** to throw an ember stone into it. The stone flies from the basket in a
  0.28 s arc and plunks in. Hit area: the pool ellipse plus a 14 px margin. Works the same with a
  mouse click.
- Tapping with an empty basket: the basket wiggles (2 px, 0.15 s) with a soft thud. No penalty.
- Tapping a scalding pool still throws a stone (the player is allowed to make mistakes).
- Monkeys walk, choose pools and leave on their own. The player never drags them.
- Tap the card to start, retry, or resume from pause.

## Warmth (one number per pool, 0 to 100, never shown as a number)

| Band | Warmth | Water colour | Rim tag (stitched badge on the rim) | Who is happy |
|---|---|---|---|---|
| Icy | under 25 | `#a9b6cf` slate, with a white ice rim `#e9f0f7` that grows as it cools | snowflake | nobody |
| Mild | 25 to 45 | `#9cc3e6` milky blue | 1 dot | blue hats |
| Warm | 45 to 65 | `#86cfb4` milky jade | 2 dots | green hats |
| Hot | 65 to 88 | `#f5a38f` apricot rose | 3 dots | red hats |
| Scalding | over 88 | `#f07a6a` with rolling bubbles | wavy lines | nobody; bathers hop out |

- Water colour is a smooth lerp between band centres, so the player can see a pool drifting toward
  the next band before it gets there. The rim tag (dot count) is the colour-blind backup and
  matches the bobble count on the hats.
- **Cooling** (Newton style, so hotter pools cool faster): `dT/dt = -k * T * flurry`, where
  `k = min(0.048, 0.030 + 0.000075 t)` (t = seconds played), then +0.002 every 30 s after 240 s,
  capped at 0.056. `flurry` = 1.8 during a snow flurry, else 1.
- **A stone:** +16 to the tapped pool and +6 to each unlocked pool directly below it (row r, col c
  spills into row r+1 cols c and c+1). Heat is added smoothly over 0.8 s after the plunk, and the
  spill arrives 0.3 s later than the direct heat so the player sees it run down the waterfalls.
- Pools start at warmth 55. A newly dug pool starts at 40.

## The hill (layout and unlocks)

Pools are ellipses with `rx = 0.14 * W` (max 66 px) and `ry = 0.55 * rx`.

| Pool | Row, col | Centre (x, y as share of the screen) | Opens at |
|---|---|---|---|
| A | 0, 0 | 50%, 33% | start |
| B | 1, 0 | 30%, 50% | start |
| C | 1, 1 | 70%, 50% | start |
| D | 2, 1 | 50%, 67% | 50 s |
| E | 2, 0 | 17%, 67% | 110 s |
| F | 2, 2 | 83%, 67% | 170 s |

- A spills into B and C; B into E and D; C into D and F. Only open pools receive spill.
- Locked pools are drawn as a snowy dip with a dashed stitched outline. When one opens, a little
  felt shovel digs it (0.6 s, snow puffs) and the water fills from the centre outward.
- Each pool seats **2 monkeys**.

## Monkeys

- **Arrivals** come in from the right edge along a snowy path at about 20% height and wait on a
  rock ledge (up to 4 waiting). Interval: `max(2.4, 6.0 - 0.015 t)` s with +-15% jitter. After
  300 s it drops 0.1 s every 30 s to a floor of 1.8 s. If the ledge is full, the next arrival holds
  back until a spot frees (no penalty).
- **Preferences (hat) by time:**

| Time played | Mild (blue, 1 bobble) | Warm (green, 2) | Hot (red, 3) | Mother and baby (mild, 2 seats) |
|---|---|---|---|---|
| 0 - 29 s | 0% | 100% | 0% | 0% |
| 30 - 89 s | 0% | 60% | 40% | 0% |
| 90 - 149 s | 30% | 40% | 30% | 0% |
| 150 s + | 25% | 35% | 30% | 10% |

- **Choosing a pool:** every 0.2 s, each waiting monkey (any of them, not only the first) looks for
  an open pool with a free seat whose warmth is in its band, and picks the one closest to its band
  centre. It hops there in a 0.5 s arc. A mother and baby need 2 free seats in one mild pool.
- **Patience on the ledge:** `max(7, 11 - t / 60)` s, shown as a small stitched ring above the
  monkey that unravels. At 0 the monkey stomps off: **1 huff**.
- **Soaking:** 12 to 16 s (random). While the pool is in its band the monkey is **content**:
  eyes closed, bobbing, a small steam heart rises every second.
- **Fussing:** if its pool leaves its band (or boils), a fuss ring appears over its head:
  `max(4, 5 - t / 240)` s. Getting the pool back in band clears it at once. In a scalding pool the
  bathers sit on the rim fanning themselves and hop back in when it cools into their band. If the
  ring runs out the monkey climbs out, puffs a red cloud and stomps off: **1 huff**.
- **Done:** after a full soak the monkey climbs out, gives a little bow, wraps up in a towel and
  waddles off left.

## Snow flurries

From 90 s, a flurry every 40 s (+-5 s); after 240 s every 30 s. 2 s warning: the snow thickens and
a cool blue haze slides in from the left with a soft wind sound. The flurry lasts 5 s and cools
every pool 1.8x as fast. It is the moment to have stones saved in the basket.

## Scoring, fail state, best

- **Comfort:** +1 per second for every content monkey (fractional internally, shown as an
  integer). Each steam heart floats up toward the score.
- **Soak bonus:** +10 + 2 x streak (cap +30, so 40 max) when a monkey finishes. Each monkey of a
  mother-and-baby pair counts.
- **Streak:** finished soaks in a row without a huff. A huff resets it to 0.
- **Mittens (lives):** 3 knitted mittens in the HUD. Each huff unravels one (it fades to a stitched
  outline with a loose thread). **Every 8th soak in a streak**, if a mitten is missing, a monkey
  leaves a mandarin on the rim that flies to the HUD and knits one back.
- **Fail state:** the third huff. The steam settles, the dusk deepens 30% over 0.8 s, and the card
  says "the hill goes quiet", with score, best, soaks and best streak. Tap to open the springs
  again.
- Best score persists with `GameKit.best()` / `GameKit.saveBest(n)`.
- **Expected play:** the first minute is gentle (warm hats only, 3 pools). A new player usually
  loses the first mitten around 2 minutes, once mild hats, flurries and the fifth pool arrive. A
  typical run is 3 to 5 minutes; a strong player who uses the spill can pass 6. Scores: a first
  run around 600 to 1200, a good run 2500+.

## Demo autopilot (`__game.demo(on)`)

Every 0.25 s, if the basket holds a stone:
1. Give each open pool a **target**: the centre of the band its bathers want (35, 55 or 76). If it
   has free seats and a waiting monkey's band is unmatched by any pool, an empty pool takes that
   band. Otherwise 55.
2. Score each pool `need = target - T - 4` (ignore if `T + 16 > 86` or `need <= 0`). Add 30% of
   the children's needs for pools in rows 0 and 1, but skip a pool whose spill would push a child
   with bathers out of their band.
3. Tap the pool with the highest need. During a flurry warning, keep 2 stones in reserve until the
   flurry starts.

It should comfortably play past 4 minutes on 390x844 and 375x667, so the store screenshots show
busy, steamy pools and a real score.

## Art direction: needle-felted winter diorama at dusk

Nothing like our earlier games. Bank Shot is neon; Lantern Drift a dark purple night lake with an
orange lantern glow; Burrowbank sunny paper-cut sand in teal and navy; Wheelthrown matte moss and
terracotta clay; Griddlewise a cobalt-tile screen print; Glasswright limestone and jewel glass;
Sow Far a pink and green risograph zine. Simmerstone looks like a **soft felt craft diorama**:
puffy rounded shapes, pale lavender dusk, snow white, milky pastel water, and **dashed stitch lines**
sewn just inside the edge of every major shape. Light and pastel, never dark; no hard paper edges,
no halftone, no tile grid, no glass sparkle.

| Use | Hex |
|---|---|
| Sky (top to bottom, soft two-stop gradient) | `#9a90c8` to `#e8d6e6` |
| Far felt mountains, snow caps | `#b9add6`, `#efe9f5` |
| Snow ground | `#f7f4fa` |
| Snow shadow, snow stitches | `#d6cde6` |
| Pool rock rims, rim stitches, dark rock | `#9b8f9a`, `#7a6e7a`, `#5e5361` |
| Water: icy, mild, warm, hot, scalding | `#a9b6cf`, `#9cc3e6`, `#86cfb4`, `#f5a38f`, `#f07a6a` |
| Water highlight (a light curved line on the surface) | water colour mixed 35% toward white |
| Ice rim | `#e9f0f7` |
| Monkey fur, fur stitches | `#cdb9a3`, `#a8927c` |
| Monkey face, face shade, blush, eyes | `#f0868f`, `#d96877`, `#f7a7ad`, `#4a3a48` |
| Hats: mild, warm, hot (band colour darker by 15% for the brim) | `#6f9fe0`, `#3fae8a`, `#e5675a` |
| Hat bobbles, towels, steam | `#fbf3e6`, `#fbf3e6`, `#fbf7ff` |
| Ember stones, ember highlight, cooled stone | `#e8624f`, `#ffb08a`, `#7a6e7a` |
| Basket, basket weave | `#b88a5e`, `#8f6640` |
| Mittens (HUD), accent | `#8b7fd1` |
| Mandarin | `#f2a23a` with leaf `#3fae8a` |
| Ink (text) | `#4a3a5c` plum |
| Panels | `#f3eefa` lavender felt with a `#8b7fd1` dashed stitch border |

- **Felt look (all in canvas):** every pool rim, monkey head, hat, mitten, panel and the basket
  gets a dashed stitch line 4 to 6 px inside its edge (`setLineDash([8, 7])`, 3 px, the shape's
  darker tint, round caps). A 128 x 128 soft noise "fuzz" tile, built once at load, is drawn over
  the whole screen at 5%. Shapes are puffy and rounded; no sharp corners anywhere (min radius 10 px).
- **Layout (portrait):**
  - Top (below the safe area, about 12% high): the score centred in big numerals, best under it in
    small type; the 3 mittens at top right. The web Back button keeps the top-left 60 x 60 clear.
  - Sky band with two layers of felt mountains, then the snow hill. The arrival path and rock
    ledge run across the upper right at about 20% height; waiting monkeys sit there in a row.
  - The 6 pools on three terraces (see the layout table), with short felt waterfalls from each
    pool's lower edge to the two pools below (ribbon coloured like the upper pool's water, with a
    moving dashed highlight showing flow; brighter for 0.8 s when spill runs down).
  - Bottom 14%: the ember basket, centred: a woven felt basket with 4 stone slots. Full slots show
    glowing ember stones; the next slot fills with a growing glow and a stitched arc timer. A tiny
    brazier glows behind it.
- **Monkeys:** round oatmeal felt heads (and a round body when out of the water), pink
  heart-shaped faces (two circles plus an ellipse), small round ears with pink centres, a knitted
  beanie in the band colour with 1, 2 or 3 cream bobbles. In the water, only the head and
  shoulders show; the water's front surface covers the chin. Content: closed curved eyes and pink
  blush. Fussing: open eyes, a wobbly mouth, shiver lines when too cold or a little leaf-fan when
  too hot. Babies are 60% size and ride on the mother's back on the path.
- **Type:** a humanist flared sans in **lowercase**, a new voice for us (Lantern Drift uses a
  rounded sans, Burrowbank a heavy italic serif, Wheelthrown and Sow Far condensed caps sans,
  Griddlewise a slab serif, Glasswright old-style serif caps):
  `Optima, Candara, "Segoe UI", "Gill Sans", sans-serif`, weight 600, letter-spacing 0.04em,
  tabular lining numbers. The title is "simmerstone" in plum lowercase with a lavender stitched
  underline. Never all caps, never italic.
- **Panels:** title, pause and game-over cards are lavender felt patches (`#f3eefa`, 22 px radius)
  with a dashed `#8b7fd1` stitch border 7 px inside the edge and a soft 6 px shadow (`#4a3a5c` at
  15%, blur 12). Buttons are plum felt pills with cream text.
- **Title screen:** the live hill with three monkeys soaking and steam rising, the title card in the
  middle, "tap to open the springs", best score.
- **Motion:**
  - Stone toss: the ember arcs from the basket (0.28 s) and plunks: a ring ripple (0.4 s), a steam
    puff, the water colour shifts over 0.8 s. Spill: a brighter ribbon runs down the waterfalls.
  - Steam: 2 to 6 soft wisps per pool, count and opacity scale with warmth; scalding pools add
    rolling bubbles and faster, thicker steam.
  - Bathing: monkeys bob 1.5 px on a 2.4 s sine; heads tilt back slowly when content.
  - Hop in: 0.5 s arc with a small splash and 4 droplets. Bow and towel on leaving.
  - Huff: a red puff cloud, stomp (3 steps with 2 px shake), the mitten unravels in the HUD.
  - Mandarin: pops out with scale 0 to 1.2 to 1, arcs to the HUD, the mitten re-knits
    (stitches draw on over 0.4 s).
  - Snow: 40 to 70 felt dots drift down with a slow side wobble, thicker in flurries.
  - Felt "breathing": pools and the basket scale 1.0 to 1.01 on slow sines so the diorama feels
    soft. 60 fps with delta time.
  - Game over: steam thins out, the sky deepens 30% toward `#6f6596`.

## Sound (optional, WebAudio via `GameKit.sound`, silent until the first tap)

- Stone plunk: sine sliding 260 to 140 Hz, 0.12 s.
- Content sigh (rare, at most one per 3 s): soft triangle 520 to 440 Hz, 0.2 s, quiet.
- Soak finished: three soft pentatonic notes (523, 659, 784 Hz).
- Huff: low square 140 Hz, 0.1 s, plus `GameKit.buzz()`.
- Empty basket: sine 90 Hz, 0.08 s.
- Flurry warning: slow low triangle wobble (180 to 150 Hz over 0.8 s), very quiet.
- Mandarin: two bright triangle notes (880, 1175 Hz).
- New pool dug: three soft thumps (sine 120 Hz).

## Review note

Tap to start. Tap a pool to drop a hot stone in and warm it. Each monkey's hat colour (and bobble
count) shows the warmth it wants; keep pools in the right band so monkeys soak happily. The game
ends after 3 monkeys leave unhappy.
