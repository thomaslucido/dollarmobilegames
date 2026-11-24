# Whirlwhelk

**Tagline:** Spin the rings. Shells sink inward. Match three. (48 chars)

**Genre (registry):** radial-gravity shell match puzzle

**Accent:** `#cfa24a` (maki-e gold)

**Category:** GAMES_PUZZLE

## Trend and evidence

- **Trend:** tile-matching puzzles (scout report `data/scout/2026-11-23.md`, trend #1). You line up
  three or more of a kind to clear them, on one board, in short sessions.
- **Evidence:** Sensor Tower October 2026 worldwide top grossing has a match-3 title in the top
  five. AppMagic H1 2026: puzzle earned about $7.6B (+20% YoY, about 44% of casual spend) and
  match-3 is about half of puzzle spend. `data/trends/` is still empty, so this is **directional
  only** (medium confidence on direction).
- **Why this trend and not the scout's #2:** the scout's strongest candidate (idle tap builder)
  sits in the same idle family as Sow Far, which is in our last 6 games. Our last 6 genres are
  fuse-route timing puzzle, falling-leaf word glide, flytrap snap arcade, wind-up lane defense, cozy
  tending sim and idle garden runner. None of them is a tile-matching game. Kids casual and party
  are too thin on evidence.
- **What we take and what we leave:** we take "three of a kind clears" and the satisfying cascade.
  We leave behind everything a player associates with the charting match-3 games: there is **no
  grid, no swapping, no level map, no move counter, no booster bar, no characters, no lives timer
  and no currency**. The board is round, the verb is turning a ring, and the session is one endless
  tide with a best score.
- **Distance from our own puzzles:** Griddlewise sorts stacks by flipping them with a spatula.
  Glasswright places drafted blocks on a window. Burrowbank taps birds out of a hex bank.
  Wheelthrown merges pairs into bigger pots. Whirlwhelk never moves a single piece on its own: you
  turn a whole ring, and gravity pulling toward the centre does the rest.
- **Distance from other games:** ring-turning puzzles we know of ask you to align a fixed picture
  once. Whirlwhelk has live arrivals, inward gravity and no fixed solution, so it plays like its own
  thing.

## The pitch

A round black lacquer tray, inlaid in gold, holds a little tide pool that swirls toward its centre.
Shells wash in at the rim and sink inward along the gold spokes. Turn any of the four rings and every
shell outside it re-settles toward the eye of the whirl. Line up three of a kind along a spoke or
around a ring and they spiral down the eye. Let a shell wash in where the spoke is already full and
it spills. Three spills and the tide is in.

## The twist (what makes it its own game)

1. **Gravity points inward.** Every spoke is a little column that stacks from the centre outward.
   Shells always rest against the hub or against the shell beneath them.
2. **You never move one shell. You turn a whole ring.** Turning a ring slides its shells onto new
   spokes. Any shell that now has an empty cell beneath it (toward the hub) sinks, and every shell
   outside the turned ring re-settles. Turning the innermost ring reshuffles the whole board; turning
   the outermost moves only the rim.
3. **Two ways to match.** Three or more of a kind in a row **along a spoke** (radial) or **around
   a ring** (wraps all the way round). Turning makes radial matches; sinking and arrivals make ring
   matches. Clears sink more shells, so cascades happen.
4. **The tide never stops.** A new shell arrives at the gold wave mouth at 12 o'clock on a steady
   clock, and the next one is always shown. Your outer ring is how you choose where it lands.
5. **Deep dive.** Four of a kind on one spoke, hub to rim, clears the whole spoke (leaving a pearl at the hub end) and wins back a
   spill.

A player would describe it as "the gold lacquer tide pool game where you spin rings and the shells
sink to the middle", not as a version of any other game.

## Controls

- **One verb: turn a ring.**
  - **Drag** anywhere on a ring: it follows the finger's angle around the board centre (the ring is
    picked by the radius where the touch starts). On release it snaps to the nearest notch (45
    degrees) with a 0.16 s back-out ease. Several notches in one drag are fine.
  - **Tap** a ring (moved under 8 px, under 0.25 s): turn it one notch clockwise.
  - A touch on the hub or outside the board does nothing; the rings give a faint gold shimmer to show
    where to touch.
- Only one ring turns at a time. While a ring is held, shells on it are drawn following the finger;
  gravity and matching run on release.
- If a shell is due to arrive while a ring is held, it waits until release (at most 1.5 s, after
  which the held ring snaps to its nearest notch and releases).
- Works the same with a mouse. One finger. Tap the card to start, retry or resume.

## Geometry (portrait)

| Zone | Where |
|---|---|
| HUD | top safe area to `0.13 H`: score centred in gold numerals, best under it in small caps. Spills (3 gold wave crests) at the top right. The top-left 60 x 60 px stays clear for the web Back button |
| Mouth and next shell | `0.15 H` to `0.21 H`, centred above the board |
| Board | centre `(0.5 W, 0.52 H)`, radius `R = min(0.46 W, 0.29 H)` |
| Chain caption | `0.84 H` to `0.90 H`: "Chain x2", "Deep dive", "Full circle" in gold italic |

- **Rings:** hub radius `0.16 R`. Four rings of width `0.21 R` each, ring 0 (inner) to ring 3
  (outer, ending at `R`). Eight spokes at 0, 45, ..., 315 degrees, spoke 0 at 12 o'clock.
  32 cells in all.
- **Shell size:** every shell is drawn with diameter `0.17 R` at the centre of its cell (so inner
  cells look full and outer cells have lacquer around them).
- **Mouth:** a gold wave-crest arch outside the rim at 12 o'clock. It always drops into spoke 0's
  outer cell. From 120 s a second mouth opens at 6 o'clock (spoke 4).

## Board rules

- **Settled board:** after any change, each spoke's shells sit in rings 0..h-1 with no gaps
  (`h` = spoke height, 0 to 4). Sinking moves a shell one ring inward per 0.07 s.
- **Arrival:** when the arrival clock fills, the shell in the mouth drops into the mouth's spoke and
  sinks to the lowest empty cell. If that spoke has height 4, it is a **spill**: the shell bounces
  off the rim and skitters away off-screen, one wave crest cracks off the HUD, the board shakes 3 px
  for 0.15 s and `GameKit.buzz()` fires.
- **Spill warning:** during the last 1.0 s of the arrival clock, if the mouth's spoke is full, the
  mouth arch turns vermilion and pulses at 4 Hz.
- **Matching:** after settling, find every run of 3 or more same-type shells, contiguous **along a
  spoke** (radial) or **around a ring** (wrapping from spoke 7 to spoke 0). Pearls are wild. Clear
  all matched cells at once (a cell in two runs counts once), settle, then check again. Each extra
  pass is the next chain step `c` (1, 2, 3...). Arrivals wait until the cascade ends (cascades are
  at most about 0.5 s per step).
- **Turning:** turning ring k by n notches moves each of its shells from spoke s to spoke
  `(s + n) mod 8`, then the board settles and matches as above.
- **Pearl:** a single run of 4 or more leaves a pearl in the run's innermost cell (it sinks
  like any shell). Pearls are wild. A run made only of pearls also clears.
- **Barnacle stone** (from 90 s): a crusty dark stone that arrives like a shell, sinks, and never
  matches. It crumbles when a match clears any cell next to it (same spoke one ring in or out, or
  same ring one spoke either side).
- **Eddy** (from 150 s): every 20 s a random ring (not the one being held) shows two gold arrows for
  1.5 s, then turns itself one notch in the arrow direction, then settles and matches. Matches it
  makes score normally.
- **Starting board:** 12 random shells of the first 4 types, spoke heights 1 or 2, with no runs of
  3. The first arrival is at 3 s.
- **Shell picks:** uniform over the unlocked types, but never the same type three arrivals in a
  row. With two mouths, the drops alternate top, bottom, top. Each mouth shows its own next shell.

## Scoring, fail state, best

| Event | Points |
|---|---|
| Run of 3 | 30 x c |
| Run of 4 | 60 x c |
| Run of 5 | 100 x c |
| Run of 6+ | (150 + 30 per shell past 6) x c |
| Deep dive (4 of a kind on one spoke) | +100 x c, and win back one spill (max 3) |
| Full circle (all 8 cells of one ring) | +500 x c |
| Barnacle crumbled | +20 each |

- `c` is the chain step (1 for the first clear after a move or arrival). A gold score pop rises from
  the hub: "+60", "Chain x2 +120".
- **Fail state:** three spills. The whirl stops, the remaining shells lift slightly and settle still,
  and a lacquer card reads **"The tide is in"**. It shows score, best, shells sunk, longest chain,
  deep dives and time (m:ss). Tap to play again.
- **Best score** persists with `GameKit.best()` / `GameKit.saveBest(n)`. A new best gets a gold
  ripple ring around the score on the card.

## Shell types

Each type has its own colour **and** its own silhouette, so the board reads in grayscale too.

| # | Shell | Silhouette | Unlocks |
|---|---|---|---|
| 1 | Scallop | fan with 5 gold ribs, a small hinge at the base | start |
| 2 | Moon snail | round, with a 1.5-turn spiral line | start |
| 3 | Starfish | five-arm star with three dot rows | start |
| 4 | Mussel | long tapered oval, turned 30 degrees, with a pale streak | start |
| 5 | Urchin | round body with 12 short spines | 45 s |
| 6 | Sand dollar | flat disc with a five-petal flower | 180 s |
| - | Pearl (wild) | sphere with a gold rim | from 4+ runs |
| - | Barnacle stone | lumpy rock with three volcano bumps | 90 s |

## Difficulty curve (t = seconds played)

- Arrival interval `A(t) = max(1.1, 3.0 - 0.008 t)` s.
- Barnacle chance from 90 s: `min(0.20, 0.10 + 0.0005 (t - 90))` of arrivals.
- 5th type at 45 s, barnacles at 90 s, second mouth at 120 s, eddies at 150 s, 6th type at 180 s.

| t | new shell every | types | new things |
|---|---|---|---|
| 0 s | 3.0 s | 4 | 12 shells on the board |
| 45 s | 2.64 s | 5 | urchins |
| 90 s | 2.28 s | 5 | barnacle stones (10%) |
| 120 s | 2.04 s | 5 | second mouth at 6 o'clock |
| 150 s | 1.80 s | 5 | eddies every 20 s |
| 180 s | 1.56 s | 6 | sand dollars, barnacles 15% |
| 240 s | 1.10 s (floor) | 6 | everything |

- **Why it lasts 3+ minutes:** the board holds 32 shells and each clear of three makes room for
  three arrivals. With 4 types and a 3 s clock, the first minute is calm and teaches that turning an
  inner ring re-settles everything outside it. From 120 s the second mouth means the outer ring can
  no longer aim both drops at once, barnacles clog spokes until a neighbouring match breaks them,
  and eddies shove a ring you were counting on. Three spills, plus one back for each deep dive,
  carry a new player to about **3 to 4 minutes**. A strong player passes 6.
- **Expected scores:** a first run 1,500 to 3,000; a good run 8,000+.
- **Tuning knobs** for QA if runs are far from 3 to 5 minutes: the floor of `A(t)`, the 6th-type
  unlock time and the barnacle chance.

## Demo autopilot (`__game.demo(on)`)

- Every 0.55 s (and never while a cascade runs), try every action: each of the 4 rings turned by
  -3 to +4 notches (28 options) plus "do nothing". Simulate settle and full cascade on a copy of the
  board.
- Rate each option: `points + 40 x (shells cleared) - 120 x (mouth spoke is full) - 8 x (tallest
  spoke height) + 15 if the next shell would land next to a shell of its own type`. Pick the best,
  ties to the smaller turn.
- Animate the turn as a drag (0.25 s) so screenshots show the finger's work. The demo should
  survive several minutes and show chains on the board.

## Art direction: black lacquer and gold, a maki-e tray

Nothing like our earlier games. Bank Shot is neon. Lantern Drift is a dark purple night lake with an
orange glow. Burrowbank is sunny paper-cut sand in teal and navy. Wheelthrown is matte moss and
terracotta clay. Griddlewise is a cobalt-tile screen print. Glasswright is limestone and jewel glass.
Sow Far is a pink and green risograph zine. Simmerstone is a pastel felt diorama. Tintrot is tin toys
with black outlines on walnut. Gulpwort is a coral vinyl sticker sheet. Glideleaf is a gouache picture
book on sky blue. Wickwalk is coloured chalk on a green slate. Whirlwhelk looks like **a precious
lacquerware tray**: deep glossy black lacquer, fine **gold line inlay** (thin, even, hand-laid
hairlines), a **vermilion lacquer rim**, scattered gold-dust flecks, and shells that look like
**mother-of-pearl and coloured-lacquer inlay**, each with a soft iridescent sheen. It is our first
black-and-gold game and our first with a single round board at the centre. No outlines in black, no
chalk, no paper, no stickers, no tiles, no neon glow. The only shine is the long soft lacquer
reflection and the gleam of the gold.

| Use | Hex |
|---|---|
| Lacquer black (background) | `#15110f` |
| Lacquer reflection (one broad soft diagonal band, 35%) | `#2c221d` |
| Gold-dust flecks (nashiji, 1 to 2 px, 30%) | `#cfa24a` |
| Maki-e gold (accent: lines, numerals, mouth, hub) | `#cfa24a` |
| Gold highlight, gold shadow | `#f0d48a`, `#8c6a2a` |
| Vermilion rim, its highlight, its worn edge | `#a3301f`, `#c9503a`, `#5e1a12` |
| Tray well (inside the rim, very slightly lighter) | `#1d1714` |
| Flowing-water gold pattern on the well (12%) | `#cfa24a` |
| Scallop | `#e2603f`, ribs `#f0d48a` |
| Moon snail (mother-of-pearl) | `#efe6dc`, sheen `#f4c9d6` to `#c8e6dc` |
| Starfish | `#e8b23e`, dots `#8c6a2a` |
| Mussel | `#3f63a8`, streak `#a9c3ea` |
| Urchin | `#8e4b96`, spines `#c79ad0` |
| Sand dollar | `#5fae7f`, petals `#d7efd9` |
| Pearl | `#fff7ee`, blush `#f4d9cf`, rim `#cfa24a` |
| Barnacle stone, bumps | `#4b4744`, `#77706a` |
| Spill warning | `#c9503a` |
| Text | `#f0d48a` (gold) and `#e9dfcf` (ivory) on lacquer |
| Cards | `#1d1714` lacquer panel, 2 px `#cfa24a` gold line inset 6 px, vermilion corner dots |

- **Tray:** a round vermilion rim (width `0.06 R`) around the board, with a highlight arc at the
  upper left and the worn darker edge at the lower right. Inside it the well is near-black with a
  gold **flowing-water** pattern: five thin spiral curves from rim to hub that rotate slowly
  clockwise (one turn per 40 s), so the whole pool always reads as a gentle whirl.
- **Rings and spokes:** ring borders are 1.5 px gold hairlines; spokes are dotted gold hairlines at
  40%. The ring under the finger brightens its border to gold highlight. Each ring wobbles 1 px off
  true when it snaps, then settles (lacquer clack).
- **Hub (the eye):** a gold spiral of 2.5 turns on a black disc, turning slowly. When shells sink in
  it flares to gold highlight for 0.2 s.
- **Shells:** flat inlay shapes with a 1 px gold edge (gold, never black), a linear sheen that slides
  across them as the ring turns (angle follows the cell's angle), and a tiny white glint at the top
  left. Idle shells breathe 2% in scale on a 3 s cycle, out of phase.
- **Motion:**
  - Clear: matched shells pulse once (0.08 s), then spiral into the hub along a 3/4-turn inward
    spiral over 0.45 s, shrinking to 20% and leaving a trail of gold-dust specks that fade in 0.6 s.
  - Arrival: the mouth's gold wave curls over (0.2 s) and the shell slides down the spoke.
  - Pearl: forms with a small gold ripple ring that expands to `0.25 R` and fades.
  - Barnacle crumble: breaks into 5 grey chips that fall outward off the board.
  - Spill: the shell bounces off the rim in an arc and spins off-screen; a wave crest in the HUD
    cracks and drops.
- **Type:** the system serif (`"Bodoni 72", Didot, Georgia, serif`), numerals in gold at 44 px for
  the score, labels in letter-spaced small caps (tracking 0.18 em) in ivory. Captions in italic gold.
  No pixel fonts, no rounded sans.
- **Title screen:** the board turning slowly, the name in wide letter-spaced gold caps across the
  top, "Tap to begin" in ivory italic under the board.

## Sound (optional, WebAudio via `GameKit.sound`, silent until the first tap)

- Notch: a short dry wooden clack (triangle 520 Hz, 0.03 s, fast decay) for each notch passed.
- Sink: a soft low "bloop" (sine 260 to 180 Hz, 0.08 s).
- Clear: a plucked-string note (triangle with quick decay, 0.25 s) on a pentatonic scale, one step
  higher per chain step.
- Deep dive and full circle: two plucks a fifth apart plus a soft gong (sine 110 Hz, 0.6 s decay).
- Spill: a dull splash (short noise 0.06 s plus sine 140 Hz), with `GameKit.buzz()`.
- No music.

## Review note

Tap to start. Drag or tap a ring to turn it; shells sink toward the centre, and three of a kind in a
line along a spoke or around a ring clear. The game ends after three spills (a shell arriving where
its spoke is already full).
