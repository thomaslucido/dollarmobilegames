# Griddlewise

**Tagline:** Sort the stacks. Flip with the spatula. Beat the rush. (54 chars)

**Genre (registry):** pancake flip sort puzzle

## Trend and evidence

- **Trend:** sort puzzle (stacks or tubes of mixed colours; move the top piece or run onto a
  matching stack until every stack is one colour).
- **Evidence:** scout report `data/scout/2026-10-26.md`, trend #1. Mobidictum reports that Sort
  Puzzle passed Blast as the third-largest puzzle subgenre by IAP revenue at the start of 2026, and
  the subgenre keeps coming up as a rising hybrid-casual mechanic. PocketGamer.biz H1 2026 has puzzle
  revenue up about 20% YoY. The scout notes the data is from industry summaries, since there are no
  chart snapshots in `data/trends/` yet.
- **Why sort, not screw/cut physics:** the scout calls both "cleanest". Sort is the stronger evidence
  (a revenue ranking, not one chart jump), it is deterministic, it fits one screen, and a solver
  makes every deal provably solvable. A physics puzzle needs a rigid-body solver written from scratch
  and is judged on feel, which is risky for one evening.
- **Genre spacing:** the last games are slingshot mini golf (Bank Shot), one-touch flyer (Lantern
  Drift), hex arrow puzzle (Burrowbank) and merge puzzle (Wheelthrown). We have no sort game yet.
  Block puzzle (trend #2) is skipped tonight, as the scout says to pick only one grid or tube puzzle.

## The twist (what makes it its own game)

In a normal sort puzzle you can only reach the top of a stack, so buried pieces wait until
everything above them has moved. In Griddlewise the stacks are **pancakes**, and you hold a
**spatula**:

1. **Flip.** Swipe up from any pancake in a stack. The spatula slides under it and flips that
   pancake and everything above it in one go, so their order is **reversed** (the classic
   "pancake flip"). A buried pancake can come to the top in one move, but every pancake above it
   turns over too.
2. **Flips cost time.** Every flip takes **1.0 s** off the rush clock. Moves are free. So the puzzle
   becomes "when is a flip worth it?". A good player plans flips that also line up runs, because a
   flip that puts three matching pancakes on top sets up a big move.
3. **Served stacks lock.** When a plate holds a full stack of one flavour, butter and syrup go on top,
   it is served (+time, +points) and it can't be touched again. That plate is no longer free space.
4. **A breakfast rush, not a level list.** A run is a series of griddles that keep getting harder
   against one shared clock (drawn as a melting butter pat). Clearing griddles quickly earns time.
   You lose when the butter melts away.

A player would describe it as "the pancake game where you flip stacks with a spatula", not as a
re-skinned tube sort. The flip changes the strategy, not just the art.

## Controls

- **Tap a stack** to lift its top run (every pancake of the same flavour touching the top). The run
  rises 10 px and gets a soft shadow. **Tap another plate** to drop it there. Tap the same stack
  again, or empty griddle, to put it back.
- **Move rule:** a run can go onto an empty plate or onto a pancake of the same flavour. As many
  pancakes as fit move over; the rest stay. Any other drop gives a 2 px shake and a dull tock.
- **Flip:** put a finger on any pancake that is not the top one and **drag up at least 24 px**,
  then let go. While you drag, a spatula slides in under the chosen pancake and the part above it
  tilts up 6 degrees as a preview. Drag back down below the start point to cancel. Release flips it.
  Swiping on the top pancake alone does nothing (a one-pancake flip changes nothing); it shakes.
- A swipe always wins over a tap: if the finger moves 24 px up, it is a flip, not a selection. If a
  run is lifted when a flip starts, it drops back first.
- Served stacks ignore taps and swipes.
- Mouse: the same with click and click-drag. One thumb, portrait.
- Hit area for a stack is the full column above its plate (plate width x the area from the plate
  to the top of the column), so short stacks are easy to hit.

## Flavours (in the order they join the run)

Each flavour has its own colour **and** its own mark, so the game can be played without telling the
colours apart.

| # | Flavour | Batter | Rim (bottom band) | Mark |
|---|---|---|---|---|
| 1 | Buttermilk | #f0b04a | #c98a2e | plain, one light crust line #ffd98a near the top |
| 2 | Strawberry | #f48fb1 | #d06a8e | 4-5 small cream seed ticks #fff3c4 |
| 3 | Matcha | #8bc46a | #64a046 | one wavy swirl line #5a9440 |
| 4 | Blueberry | #5fa8ee | #3f80c8 | 4 round navy berries #24398a |
| 5 | Cocoa | #6b4230 | #4a2c1f | 5 small square chips #2e1c14 and a light crumb dot #9a6a52 |
| 6 | Red velvet | #c9303c | #962230 | 5 round cream crumbs #fff3e0 |
| 7 | Ube | #a86ad8 | #8048b0 | two short white diagonal streaks #f4eaff |

Deal order inside a griddle is random, but a run uses flavours 1..N.

## The rush (one run)

A run is a series of **griddles**. Each griddle is one deal: N flavours, H pancakes of each, on
N + E plates (E empty plates). Each flavoured plate starts full (H pancakes), dealt at random.

| Griddle | Flavours N | Height H | Empty plates E | Plates | Layout |
|---|---|---|---|---|---|
| 1 | 3 | 4 | 2 | 5 | 3 + 2 |
| 2 | 3 | 4 | 1 | 4 | 2 + 2 |
| 3 | 4 | 4 | 2 | 6 | 3 + 3 |
| 4 | 4 | 4 | 1 | 5 | 3 + 2 |
| 5 | 5 | 4 | 2 | 7 | 4 + 3 |
| 6 | 5 | 4 | 1 | 6 | 3 + 3 |
| 7 | 5 | 5 | 2 | 7 | 4 + 3 |
| 8 | 6 | 5 | 2 | 8 | 4 + 4 |
| 9 | 6 | 5 | 1 | 7 | 4 + 3 |
| 10, 11 | 7 | 5 | 2 | 9 | 5 + 4 |
| 12+ | 7 | 5 | 1 | 8 | 4 + 4 |

- **Two rows** of plates; the top row holds ceil(plates / 2), centred. Each column is
  min(88 px, (screen width - 32) / plates in the row) wide. A pancake is 84% of the column wide and
  22 px tall (24 px when the row has 4 or fewer plates), so a height-5 stack plus the plate fits in
  about 140 px.
- **Deal rules:** shuffle all N x H pancakes into the N flavoured plates. Reject and re-deal if any
  plate is already a single flavour, or if any plate's top 3 are one flavour. Then run the solver
  (below); re-deal if it fails. Up to 30 tries; there is always a valid one at these sizes.
- **Never stuck:** there is always spare room somewhere (E >= 1 plate's worth), so some plate has
  room. If it is empty, any run can go there. If its top is flavour c, another c pancake exists
  elsewhere (a short plate can't hold all H of them), and one flip brings it to the top. So the player
  always has a legal play, and the only way to lose is the clock.

## The clock (butter pat)

- Starts at **45 s**, drains at **1 s per second**, capped at **99 s**.
- **Serve a stack:** +3 s (+4 s when H = 5).
- **Clear a griddle** (all flavours served): +4 s, then the next griddle slides in (0.6 s; the clock
  is paused during the slide).
- **Flip:** -1.0 s each.
- From griddle 10 the drain speeds up: 1.15 s per second, +0.05 per griddle after that, cap 1.5.
- **Low butter:** under 10 s the pat flashes red-orange (#ff6b3d) and a soft tick plays every second.
- **Fail:** the clock reaches 0. The game-over card says "OUT OF BUTTER", with score, best, griddles
  cleared and stacks served. Tap to start a new rush.

Pacing check: griddle 1 takes a decent player about 10-15 s and pays 3 x 3 + 4 = 13 s. Griddle 5
pays 5 x 3 + 4 = 19 s but takes about 25-35 s. Griddle 8 pays 6 x 4 + 4 = 28 s and takes 40 s or
more. A new player's run lasts about 3 minutes (griddles 4-6); a good player reaches griddle 9-11 at
4-6 minutes. A flip-heavy player loses time; a careful one wins it back.

## Scoring

- **Serve a stack:** 50 + 25 x (griddle - 1) points.
- **Short order:** a serve within 3 s of the last one raises a combo x2, then x3 (cap). The combo
  stamp shows next to the score and resets after 3 s.
- **Clear a griddle:** 200 x griddle number.
- **Tidy griddle:** clear a griddle with at most (N - 1) flips for a +150 bonus, shown as a small
  spatula stamp. This rewards planning without banning flips.
- Best score persists with `GameKit.best()` / `GameKit.saveBest(n)`. The title screen also shows
  the best griddle reached (localStorage key `griddlewise.bestGriddle`, read and written in
  try/catch).

## Solver (deal check and demo)

State: an array of plates, each an array of flavour ids from bottom to top. Moves are: (a) every
legal run move, (b) every flip of k >= 2 pancakes on a plate that is not served. Use best-first
search with a priority of `breaks + 0.5 x depth`, where `breaks` counts neighbouring pancakes of
different flavours, plus 1 for each non-empty plate whose bottom flavour also sits at the bottom
of another plate. Memoise states by sorting the plate strings. Cap at 40,000 expanded states; fail
over the cap. Keep the found path; it drives the demo. At the sizes above it runs in well under
100 ms.

## Demo autopilot (`__game.demo(on)`)

On each new griddle (or when switched on mid-griddle), run the solver from the current state and play
its path, one step every 0.45 s (flips animate as usual and cost time like a player's). If the
state ever differs from the plan, solve again. It should reach griddle 6+ so the screenshots show
served stacks, syrup and a real score. `window.__game.state()` returns `{ mode, score }` with mode
`title | play | paused | over`. Tap anywhere on the title screen starts a rush (the screenshot script
taps at 215, 520).

## Art direction: Sunday kitchen, cobalt tile and butter

Nothing like our earlier games. Lantern Drift is a dark night lake with an orange glow. Burrowbank
is sunny paper-cut sand, teal and navy, with cream cards. Bank Shot is neon. Wheelthrown is matte
moss and terracotta. Griddlewise is a bright, glossy-free **kitchen in bold flat colour**: a
saturated cobalt tile wall, a charcoal griddle, white enamel plates and candy-coloured pancakes. It
looks like a cheerful screen print. Hard edges, no gradients, no glow, no textures beyond the tile
grid.

| Use | Hex |
|---|---|
| Tile wall (background) | #1d46a8 |
| Tile grout lines (64 px grid, 13% white) | #ffffff |
| Griddle slab | #26262b, front lip highlight #3a3a40, shadow #141417 |
| Enamel plates | #f7f4ec, inner well #e4dfd2, rim line #1d46a8 |
| Butter pat (clock), panels, highlights | #ffd23f, top face #fff0a0 |
| Syrup | #b5651d, shine #e09a4a |
| Low-butter warning | #ff6b3d |
| UI text on cobalt | #fff8e7 |
| Text on butter panels | #26262b |
| Spatula | blade #26262b with two cobalt slots, handle #ffd23f |
| Accent (registry, combo stamp) | #1f4fbf (cobalt) |
| Flavours | see the flavour table |

- **Layout (portrait):**
  - Top 16% (below the safe area): the score stays top right (the web Back button takes the top-left
    60 x 60). The **butter pat clock** sits top centre: a yellow rounded square on a small
    buttermilk pancake. Its size goes from 100% (99 s) down to a sliver, with whole seconds in
    charcoal slab numerals under it. On the left, under the Back-button zone: "GRIDDLE 4" and best.
  - Middle: the charcoal griddle slab fills about 62% of the height, with rounded top corners of
    18 px. It holds two rows of plates. Each plate is a flat ellipse (column width x 14 px) and its
    pancakes stack up from it.
  - Bottom 12%: a cobalt strip with a thin row of served-stack tokens for this rush (tiny
    pancake-stack icons in served flavours, up to 12, then "+N").
- **Pancakes:** side view. Each is a rounded rectangle (radius 8 px at 22 px tall) in the batter
  colour, sitting on a 4 px darker rim band, with its flavour mark. No outlines. Stacked pancakes
  overlap by 2 px so a stack reads as one soft pile.
- **Served stack:** a butter pat drops on top (scale 0 to 1.15 to 1 over 180 ms), then syrup pours:
  a #b5651d band runs down both sides of the top pancake over 300 ms with two drips. The plate rim
  turns butter yellow. It stays like that until the griddle clears.
- **Motion:**
  - Lift: the run rises 10 px with ease-out over 90 ms; idle lifted pancakes bob 1 px.
  - Move: the run travels on a low arc (peak 40 px above the higher of the two stacks) over 220 ms
    and lands with a squash (scale 1.08 x 0.9 for 70 ms).
  - Flip: the spatula blade slides in from the right of the column (120 ms). Then the flipped part
    rises 30 px and turns over: draw it as a group that scales vertically 1 to -1 about its centre
    over 260 ms (the order reverses at the halfway point). It lands with a squash and the spatula
    slides out. A "-1s" in #ff6b3d floats up from the butter pat.
  - Griddle clear: the served stacks slide down off the bottom of the slab one after another, 60 ms
    apart, into tokens in the bottom strip. The new deal drops in from above, plate by plate.
  - Game over: the butter pat melts into a puddle (squashes flat over 400 ms), the griddle dims 35%.
- **Type:** a slab serif, a new voice for us (Lantern Drift uses a rounded sans, Burrowbank a heavy
  italic serif, Wheelthrown a condensed sans). Use
  `Rockwell, "Rockwell Nova", "American Typewriter", "Courier New", serif`, weight 700, numbers
  tabular. Title "GRIDDLEWISE" in caps, cream on cobalt, with a 4 px charcoal drop shadow offset
  down-right (a print look, not a glow).
- **Panels:** title, pause and game-over cards are **butter-yellow** (#ffd23f) rectangles with 10 px
  corners and a hard 6 px charcoal offset shadow (no blur), with charcoal text, like a sticker on
  the tiles. Buttons are charcoal pills with cream text. No cream cards, no navy borders.
- **Title screen:** a single live stack in the middle that flips itself every 2 s, the title above
  it, "Tap to start" and the best score and best griddle on the butter card.

## Sound (WebAudio via `GameKit.sound`, silent until the first tap)

- Lift: soft sine 520 Hz, 0.03 s.
- Drop / land: a "pat" made of a low sine 180 Hz plus a short filtered-noise-like square 90 Hz,
  0.05 s each.
- Flip: rising triangle sweep 300 to 700 Hz over 0.12 s (the toss), then the land pat.
- Invalid drop: square 120 Hz, 0.03 s, quiet.
- Serve: sizzle-ish triple blip (sine 1200, 1500, 1800 Hz, 0.02 s each), then a warm triangle
  660 Hz, 0.1 s. Combo raises the last note by 1.12x per step.
- Griddle clear: rising arpeggio 523, 659, 784, 1046 Hz, triangle, 0.06 s each.
- Low-butter tick: sine 440 Hz, 0.02 s, once a second.
- Game over: triangle 392 then 262 Hz, 0.18 s each, plus `GameKit.buzz()`.

## Review note

Tap to start. Tap a pancake stack, then tap another plate to move the top pancakes onto an empty
plate or a matching flavour. Swipe up on a pancake to flip it and everything above it. Make every
plate one flavour before the butter (the timer) melts.
