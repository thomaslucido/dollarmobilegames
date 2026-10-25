# Wheelthrown

**Tagline:** Merge wet clay before it dries. Fire the big pots.

## Trend and evidence

- **Trend:** merge + progression (drag one item onto a matching one to combine it into the next
  tier, with a long-term layer on top).
- **Evidence:** scout report `data/scout/2026-10-24.md`, trend #2. A merge-and-story game sits in
  the top 5 of the Similarweb US iPhone top-grossing snapshot of Oct 19, 2026. AppMagic's H1 2026
  casual report calls merge the fastest-growing casual puzzle subgenre (about +74% YoY; the
  scout flags that revenue figures conflict between summaries). Trend #1 (hybrid-casual puzzle,
  i.e. puzzle plus a light upgrade layer) supports adding the small persistent glaze unlocks.
- **Why merge, not block-fill or physics stacking:** block-fill is the most crowded look-alike
  space in the charts, so a new one is hard to make feel like "its own game". Physics stacking
  needs a rigid-body solver written from scratch and would be judged on feel. A merge board is
  deterministic, reads at a glance, fits one screen, and leaves room for a twist that changes
  the strategy rather than the skin.
- **Genre spacing:** earlier games are a one-touch flyer (Lantern Drift), a hex arrow puzzle
  (Burrowbank) and slingshot mini golf (Bank Shot). No merge game yet.

## The twist (what makes it its own game)

Merge games usually let items sit on the board forever, and the only pressure is space. In
Wheelthrown **the clay dries**, and **merges splash water on their neighbours**.

1. **Drying.** Every piece has a wetness value from 1 (just thrown) to 0. It falls steadily.
   At 0 the piece is **bone-dry**: pale, cracked, and stuck. It can't be dragged, merged into,
   or moved, so it just takes up a square.
2. **Slip splash.** Every merge throws slip (watery clay) onto the 8 squares around the merge
   square. Wet neighbours are topped back up to full wetness. Bone-dry neighbours come back to
   life at 0.6 wetness ("rescued", with a bonus).
3. So **where** you merge matters as much as **what** you merge. Good play keeps work clustered,
   drags a pair next to a drying piece before merging, and saves the big merges for the corner
   that is about to set.
4. **Firing.** Two vases make an amphora, the top tier. It is never left on the board: it flashes,
   takes a glaze and flies up onto the shelf at the top of the screen, freeing its square (and
   splashing its neighbours like any merge). The shelf is the run's trophy row.

## Controls

- **Drag** a wet piece and drop it:
  - on a wet piece of the **same tier**: they merge into the next tier on the drop square;
  - on an **empty** square: the piece moves there (no cost, no splash);
  - anywhere else (different tier, bone-dry piece, off the board): it springs back.
- **Tap, then tap** works the same way for players who don't like dragging: tap a piece to lift
  it (it hovers 6 px with a shadow), tap a target square. Tapping the same piece again drops it.
- Bone-dry pieces give a dull "tock" and a 2 px shake when touched.
- Everything works with a mouse. One thumb, portrait.

## Pieces (7 tiers)

Every vessel is drawn as a lathe profile: a half-outline polyline mirrored around a vertical axis
(the jug handle and amphora handles are added on top). Size grows with tier so the board reads at
a glance. Tiny dots under each piece (tier - 1 of them, tiers 2-6) back up the silhouette.

| Tier | Piece | Silhouette | Drawn size (share of cell) | Points when made |
|---|---|---|---|---|
| 1 | Lump | lumpy blob, 3 bumps | 48% | (spawned) |
| 2 | Pinch pot | squat round bowl with a thumb dent | 56% | 20 |
| 3 | Cup | straight walls, flat foot | 62% | 40 |
| 4 | Bowl | wide shallow bowl on a foot ring | 70% | 80 |
| 5 | Jug | round belly, short neck, one side handle | 76% | 160 |
| 6 | Vase | tall, narrow neck, flared lip | 84% | 320 |
| 7 | Amphora | two handles, pointed foot (fired at once) | 92% | 640 + 250 firing bonus |

## Scoring

- Points per merge from the table above.
- **Quick hands:** merges less than 1.2 s apart build a chain multiplier x1, x1.5, x2, x2.5, x3
  (cap). The multiplier shows as a small stamp beside the score and resets after 1.2 s idle.
- **Rescue:** +25 for each bone-dry piece a splash brings back.
- Best score persists with `GameKit.best()` / `GameKit.saveBest(n)`.

## Board, spawning and fail state

- Board: 5 columns x 6 rows of rounded-square wells (30 squares).
- Start: 4 tier-1 lumps on random squares, all at full wetness.
- **Plops:** every spawn interval a new lump drops onto a random empty square. 0.6 s before it
  lands, the target square shows a faint ring, so a player can see where it is coming.
- **Fail:** a plop finds no empty square. Warning first: when 3 or fewer squares are empty the
  wheel at the bottom flashes terracotta and a soft tick plays each second. Game over card:
  "STUDIO FULL", score, best, pots fired, tap to throw again.
- There is no other way to lose. A run is never stuck while any two wet same-tier pieces exist,
  and moves into empty squares are always allowed.

## Difficulty curve (t = seconds played, d = min(1, t / 240))

| Lever | Start (t = 0) | Formula | At 4:00 | After 4:00 |
|---|---|---|---|---|
| Spawn interval | 2.4 s | 2.4 - 1.4d | 1.0 s | -0.05 s per 20 s, floor 0.8 s |
| Dry time (1 to 0) | 16 s | 16 - 7d | 9 s | -0.25 s per 20 s, floor 7.5 s |
| Spawn is a tier-2 pinch pot | 8% | 0.08 + 0.22d | 30% | stays 30% |
| Double plop (2 lumps at once) | never | every 6th spawn from t = 90, every 4th from t = 150 | every 4th | every 3rd from t = 300 |

Expected session: an average run lasts 3 to 5 minutes; the first amphora (64 lumps' worth of
clay) usually arrives around 1:30 to 2:00. At 1.0 s spawns and 9 s drying the player has to
merge about once a second and keep the splash moving, which is the end-game squeeze.

## Wetness states (what the player sees)

| Wetness | State | Look |
|---|---|---|
| 1.0 - 0.5 | wet | glossy terracotta, moving highlight stripe |
| 0.5 - 0.25 | leather-hard | matte, lighter clay, highlight gone |
| 0.25 - 0 | cracking | hairline cracks fade in, the piece shivers 0.5 px |
| 0 | bone-dry | chalk colour, full cracks, a small dust puff when it sets; stuck |

Colour is a straight lerp across these stops, so the colour itself is the timer. No bars, no
numbers on pieces.

## Progression (persists between runs)

- Lifetime pots fired is stored on device (localStorage key `wheelthrown.fired`).
- Glazes for fired amphorae unlock by lifetime count: ash and celadon from the start, ochre at 5,
  oxblood at 15, tenmoku at 30, speckled blue at 50. Each fired pot takes the next glaze in the
  unlocked rotation.
- The title screen shows the six glaze swatches (locked ones as outlines with the count needed)
  and the lifetime total. Purely cosmetic, no currency, nothing to buy.

## Demo autopilot (`__game.demo(on)`)

Every 0.3 s: find all pairs of wet same-tier pieces. Score each pair by (tier x 2) + (number of
squares around the target with wetness under 0.35, counting bone-dry ones double); pick the best
pair and merge the source into the target (whichever of the two has the driest neighbourhood).
If no pair exists, move the wettest lone piece next to the driest piece. It should survive
4+ minutes and fire several amphorae so the screenshots show a full shelf and a real score.
`window.__game.state()` returns `{ mode, score }` with mode `title | play | paused | over`.

## Art direction: a potter's studio by day, matte and earthy

Nothing like our earlier games: Lantern Drift is a dark night lake with an orange glow, Burrowbank
is sunny paper-cut sand, teal and navy with a serif, Bank Shot is neon. Wheelthrown is muted
moss green and terracotta, soft and tactile, with glossy-to-chalky clay as the only shine.

| Use | Hex |
|---|---|
| Studio wall (background) | #4b5a44 |
| Linen hatch on the wall (6% opacity) | #e9e2d0 |
| Ware board (play area) | #7f9277 |
| Square wells | #71836a, inner shadow #5f7058 |
| Wet clay | #b8532e, highlight #e98a5f, shadow #7e3219 |
| Leather-hard clay | #c98a63 |
| Bone-dry clay | #e9dccb, cracks #a48b74 |
| Slip droplets | #d77b54 |
| Shelf (walnut) | #5c3a28, top edge #7a5038 |
| Potter's wheel, dark panels | #2f3a2b |
| UI text | #f2ebdd (bone) |
| Accent (registry, warnings, score stamp ring) | #b8532e |
| Glazes | ash #efe9dc, celadon #9fcbb0, ochre #dca543, oxblood #8e2b33, tenmoku #3b2a22, speckled blue #4a6a9a with #efe9dc flecks |

- **Layout:** top 17% is the walnut shelf, with fired amphorae standing on it left to right
  (up to 8 visible, then a small "+N" on the last slot) and the score stamp (a double-ring circle,
  score inside) at the top left with best under it. The middle is the ware board: a sage panel
  with 5 x 6 rounded wells, 10 px gaps. The bottom strip holds the potter's wheel seen from the
  side (a dark disc); it spins at a speed matching the spawn rate and an arc around it fills
  toward the next plop.
- **Shapes:** rounded squares for wells, soft lathe profiles for pots, circles for stamps. No hexes,
  no hard paper-cut edges, no glow.
- **Motion:**
  - Plop: lump falls 40 px with squash on landing (scale 1.25 x 0.75 for 80 ms, settle back).
  - Pickup: the piece stretches up (0.92 x 1.1) and gains a soft shadow; it follows the finger
    with a 60 ms lag so it feels heavy and wet.
  - Merge: the two pieces squish together (both scale to 0.6 toward the centre over 90 ms), then
    the new piece rises from the well with a "throwing" spin: its horizontal scale oscillates
    1.0, 0.85, 1.0 twice over 250 ms, like a pot turning on a wheel. 8 slip droplets arc out
    to the 8 neighbours and land as small dark wet spots that fade in 0.4 s.
  - Rescue: a bone-dry piece hit by slip darkens back to terracotta over 0.3 s with a +25 stamp.
  - Firing: the amphora flashes bone white for 120 ms, fills with its glaze colour from the foot
    up (200 ms), then flies along an arc to its shelf slot and lands with a tiny bounce.
  - Drying into bone-dry: 4 dust specks drift up and fade.
  - Game over: the board desaturates 40% and the pieces settle down 2 px.
- **Type:** condensed sans, all caps, wide tracking, like a maker's stamp:
  `"Avenir Next Condensed", "DIN Condensed", "Arial Narrow", sans-serif`, weight 700,
  letter-spacing 0.12em, tabular numbers. (Lantern Drift uses a rounded sans, Burrowbank a heavy
  italic serif.) Title "WHEELTHROWN" set in bone on the moss wall.
- **Panels:** title and game-over panels are dark moss slabs (#2f3a2b, 18 px radius, no border)
  with bone text and one terracotta stamp circle for the score. No cream cards.

## Sound (WebAudio via `GameKit.sound`, silent until the first tap)

- Plop: sine 260 Hz falling to 140 Hz over 0.08 s, quiet.
- Merge: a soft squelch (sine 180 Hz, 0.05 s) then a wheel hum that rises with tier
  (triangle, 300 Hz x 1.12^tier, 0.12 s).
- Slip splash: three tiny sine blips 900, 1000, 1150 Hz, 0.02 s each.
- Rescue: triangle 660 Hz, 0.06 s.
- Firing: a ceramic "ting" (sine 2100 Hz, 0.25 s fast decay) plus 1400 Hz under it.
- Bone-dry tap: square 120 Hz, 0.03 s, very quiet.
- Low-space tick: sine 440 Hz, 0.02 s, once a second.
- Game over: sine 330 then 220 Hz, 0.15 s each, plus `GameKit.buzz()`.

## Review note

Tap to start. Drag a clay piece onto an identical piece to merge them into the next pot; drop it
on an empty square to move it. Pieces that dry out (pale and cracked) are stuck until a merge next
to them wets them again. The game ends when the board is full.
