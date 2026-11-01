# Glasswright

**Tagline:** Draft your panes. Fill the window. Let the light in. (51 chars)

**Genre (registry):** roguelike block puzzle

**Accent:** `#c8203f` (ruby glass)

## Trend and evidence

- **Trend:** block puzzle (drag a shape onto a grid, fill a full line to clear it), crossed with
  the roguelike deck-builder (a short run where you shape your options between rounds).
- **Evidence:** scout report `data/scout/2026-10-31.md`. Trend #1: AppMagic H1 2026 calls block
  puzzles the standout hotspot of the year, with over 2,000 releases in H1 (up 89% YoY). Trend #3:
  Mobi.gg lists a roguelike deck-builder among October 2026's standout new releases. The scout
  names both as the strongest candidates tonight. `data/trends/` still has no chart snapshots, so
  the evidence comes from industry summaries.
- **Why both at once:** the block puzzle is crowded, and a plain one would read as "a version of"
  the big chart game. The deck-builder has the freshest signal but the least evidence on its own.
  Putting a deck-building run on top of the line-clear verb gives us a familiar verb (one thumb,
  readable at a glance) with a structure the charting block games do not have.
- **Genre spacing:** the last games are slingshot mini golf (Bank Shot), one-touch flyer (Lantern
  Drift), hex arrow puzzle (Burrowbank), merge puzzle (Wheelthrown) and pancake sort puzzle
  (Griddlewise). We have no block or deck game yet.

## The twist (what makes it its own game)

The charting block puzzles share one shape: a square grid, three random pieces at a time, no
rotation, and you play until the board jams. Glasswright changes the goal, the board, and where
the pieces come from:

1. **Your pieces are a deck you build.** Pieces are not random. You start with a deck of 12 pane
   cards (each a shape in one glass colour) and draw a hand of 3 from it. Between windows you visit
   the workshop: add a new pane, add a special pane, or remove a card you don't want. The run is
   about building a deck that suits you.
2. **Colour matters.** A cleared line scores more if its glass is all one colour (x3) or only two
   colours (x2). So the deck you draft (lots of ruby? a mix?) changes how you place.
3. **A goal, not a survival timer.** Each window has a **light target** and only **12 cuts**
   (placements). Reach the target to finish the window; run out of cuts first and the run ends. A
   good player is efficient and sets up combos, rather than just staying alive.
4. **Arched windows.** The board is a stained glass window, not a square: a pointed lancet, a twin
   lancet and a round rose window, in turn. Short rows near the top of the arch are easy to fill but
   score little; long rows score a lot.
5. **Tap to rotate.** Any card in your hand turns 90 degrees with a tap, for free.
6. **Tracery.** Every third window you choose one permanent boon (a "tracery") for the rest of the
   run.

A player would describe it as "the stained glass game where you build your own deck of pieces",
not as a reskin of a block game.

## Words used in the game

- **Window:** one round. Numbered with roman numerals (Window I, II, III...).
- **Cut:** one placement. 12 per window.
- **Light:** score. Each window has a light target.
- **Sweep:** throw away your whole hand and draw 3 new cards. 1 per window.
- **Old glass:** grey frosted panes already in the window when it starts (from Window III).
- **Workshop:** the draft screen between windows.
- **Tracery:** a permanent boon, offered after every third window.

## Controls

- **Drag** a card from the tray onto the window. While you drag, the piece floats 64 px above the
  finger (so the thumb does not hide it) and a ghost snaps to the nearest valid cell. The ghost is
  the piece's colour at 45% opacity when it fits, and a thin ruby outline when it does not.
  Every row and column that this drop would complete glows faintly gold as a preview.
- **Release** over a valid spot to set the piece (uses 1 cut). Release anywhere else and the card
  slides back to the tray (no cost).
- **Tap** a card in the tray (finger moves less than 10 px) to rotate it 90 degrees clockwise (120
  ms spin). Monominoes and the square ignore rotation (small wiggle).
- **Sweep button** (left of the tray, a small brush icon with pips for sweeps left): discard the
  hand and draw 3. Greyed out at 0.
- **Deck button** (right of the tray, a stack icon with the draw-pile count): opens a sheet showing
  every card in the deck, the draw pile and the discard pile. Tap anywhere to close. It does not
  pause anything, since there is no clock.
- Workshop and tracery screens: tap a card or medallion to choose; "Keep my deck" skips.
- Mouse: the same with click and click-drag. One thumb, portrait.

## Deck, hand and drawing

- **Hand:** 3 cards (4 with the Steady Hand tracery).
- **Drawing:** play a card and it goes to the discard pile; draw one to replace it. When the draw
  pile is empty, shuffle the discard pile into a new draw pile (a short shuffle animation).
- At the **start of each window** the whole deck (including the hand) is shuffled and a fresh hand is
  drawn.
- **Starting deck (12 cards):** 3 cards in each of ruby, sapphire, emerald and amber.

| Card | Shape | Colour |
|---|---|---|
| 1 | I2 (domino) | ruby |
| 2 | I2 | sapphire |
| 3 | I3 (straight 3) | emerald |
| 4 | I3 | amber |
| 5 | L3 (corner of 3) | ruby |
| 6 | L3 | sapphire |
| 7 | O4 (2x2) | emerald |
| 8 | O4 | amber |
| 9 | I4 | ruby |
| 10 | L4 | sapphire |
| 11 | T4 | emerald |
| 12 | S4 | amber |

## Windows (boards)

The board is a 2D grid with a mask. Only cells inside the mask are glass. A **line** is every glass
cell in one row, or every glass cell in one column. A line is complete when every glass cell in it
is filled. Windows rotate in this order: Lancet, Twin Lancet, Rose, Lancet, ...

| Window shape | Grid | Mask (rows top to bottom; filled column ranges) | Glass cells |
|---|---|---|---|
| Lancet | 7 x 9 | row 0: cols 2-4; row 1: cols 1-5; rows 2-8: cols 0-6 | 57 |
| Twin Lancet | 8 x 8 | row 0: cols 1-2 and 5-6; rows 1-7: cols 0-7 | 60 |
| Rose | 9 x 9 | rows 0, 8: cols 3-5; rows 1, 7: cols 1-7; rows 2-6: cols 0-8 | 65 |

In the Twin Lancet the two halves of row 0 are one line (4 cells). The window frame drawing follows
the mask: pointed arches for the lancets, a circle for the rose.

## Scoring (light)

- **Setting a piece:** +1 light per cell.
- **Clearing a line:** base = 10 x the number of cells in the line.
- **Colour multiplier per line:** count the distinct colours in the line (old glass counts as its own
  colour, "grey"; wild panes count as any colour and never add one):
  - 1 colour = **Pure line, x3**
  - 2 colours = **Two-tone, x2**
  - 3 or more = x1
- **Sun panes:** x2 for each sun cell in the line (they stack).
- **Combo:** if one drop clears N lines at once, the sum of those lines' light is multiplied by N.
- Cells where a row and a column cross are cleared once but count in both lines.
- **Finishing early:** when a window reaches its target it ends at once. Each unused cut adds
  15 x window number light to the score (not to the next window).
- Light always adds to the run total. The run total is the score and the best score
  (`GameKit.saveBest(total)`). Also store the best window reached in localStorage
  (`glasswright.bestWindow`, read and write wrapped in try/catch).

Worked example: a 7-cell row of ruby and amber = 70 x 2 = 140. Clear it at the same time as a
9-cell pure sapphire column = (140 + 270) x 2 = 820.

## Fail states

1. **Out of cuts:** cuts reach 0 and light is still below the target. The window "goes dark" and
   the run ends.
2. **Jammed:** no card in the hand fits anywhere in any rotation, and no sweeps are left. The run
   ends. (If a sweep is left, the Sweep button pulses and a hint shows "Nothing fits. Sweep the
   bench." The game never ends while a sweep could help.)

Game over card: "THE LIGHT FADES", window reached (roman numeral), total light, best light, best
window, "Tap to begin a new window".

## Difficulty curve (n = window number, starting at 1)

| Lever | Formula | I | III | V | VIII | X | XII |
|---|---|---|---|---|---|---|---|
| Light target | round to 10 of 160 x 1.3^(n-1) | 160 | 270 | 460 | 1000 | 1700 | 2870 |
| Cuts per window | 12 (+2 with Extra Came) | 12 | 12 | 12 | 12 | 12 | 12 |
| Sweeps per window | 1 (+1 with Rose Tracery) | 1 | 1 | 1 | 1 | 1 | 1 |
| Old glass cells at start | 0 if n < 3, else min(14, 2(n - 2)) | 0 | 2 | 6 | 12 | 14 | 14 |

- **Old glass placement:** random glass cells, at most 2 per row and 2 per column, never completing
  a line, never more than 25% of any line.
- **Pacing:** a starting deck averages 3.3 cells per card, so 12 cuts is about 40 cells. Window I is
  meant to finish in 4 to 6 cuts. Around Window VI to VIII a deck with no plan runs out of cuts. To
  go deeper you need pure lines, sun panes, combos and a lean deck. Expected run: 5 to 9 windows,
  4 to 9 minutes. Strong runs reach Window XII and beyond. The target keeps growing x1.3 with no cap.

## The workshop (after each window you finish)

Screen title "THE WORKSHOP". Three offers side by side plus a "Keep my deck" button.

- **After Windows III, VI, IX, ... (every third):** the offers are 3 traceries you don't own yet
  (see below). Once all 7 are owned, use the normal workshop.
- **Otherwise:** the three offers are
  1. a new pane card,
  2. another new pane card,
  3. a workshop service: **Remove a card** after odd windows (opens the deck sheet; tap a card to
     remove it; the deck can't go below 6 cards), or a **special pane** after even windows.
- **New pane cards:** pick a shape by weight, then a colour evenly from ruby, sapphire, emerald,
  amber, amethyst. Amethyst only appears in the workshop, so taking it is a choice (it can hurt
  purity). Each new pane card has a 15% chance to be a special pane instead.

| Shape | Cells | Weight |
|---|---|---|
| Mono | 1 | 2 |
| I2 | 2 | 2 |
| I3, L3 | 3 | 3 each |
| O4, I4, L4, J4, T4, S4, Z4 | 4 | 2 each |
| I5, V5 (3x3 corner), P5, U5, plus | 5 | 1 each |

- **Special panes** (shown with a small sun or crystal mark in the card corner):
  - **Sun pane:** a single gold cell. Wild colour, and every line cleared through it scores x2.
  - **Crystal pane:** a clear I2. Both cells are wild.
  - **Gilded pane:** a random 3- or 4-cell shape in a normal colour with one gold sun cell in it.

## Traceries (permanent for the run)

Drawn as round medallions with a simple geometric glyph (no text in the art).

| Tracery | Effect |
|---|---|
| Extra Came | +2 cuts per window |
| Rose Tracery | +1 sweep per window |
| Prism | Two-tone lines score as pure (x3) |
| Old Master's Eye | Old glass counts as wild instead of grey |
| Steady Hand | Hand size 4 |
| Tall Lancet | Column clears score x1.5 |
| Kiln Mark | The first line you clear in each window scores x3 |

## Screens and layout (portrait)

- **Top bar** (inside safe area): left, "WINDOW IV" in spaced serif capitals. Centre, the **rose
  meter**: a small round rose window (diameter 72 px) with 8 petals that fill with coloured light
  in order as light approaches the target; the number "310 / 460" sits under it. Right, the cuts
  left, drawn as a row of thin lead strips with the number beside them (strips turn ruby at 3 or
  fewer).
- **Middle:** the window, as wide as fits (max 94% of the width, keeping room for the tray), set
  into a carved stone surround.
- **Bottom tray:** a dark slate bench with three card slots, the Sweep button on the left and the
  Deck button on the right. Each card is a rounded slab (radius 10) showing its piece centred at a
  scale that fits.
- **Title screen:** the lancet window fills cell by cell with random glass, then a gold light sweep
  passes across it. Name "GLASSWRIGHT" in spaced serif capitals, "Tap to begin". Best light and
  best window below.
- **Workshop:** stone background, the three offers as tall cards with a soft drop shadow, a
  one-line description under each, and the "Keep my deck" button.
- First-run hints (only in the first window of the very first run, stored on the device): "Drag a
  pane into the window", "Tap a pane to turn it", "Fill a row or column to let the light in",
  "Same colour lines shine brighter".

## Art direction

A sunlit chapel workshop: pale limestone, dark lead, jewel glass with light coming through it. No
neon, no night, no sand, no clay, no breakfast. All drawn in canvas.

**Palette**

| Role | Hex |
|---|---|
| Limestone background | `#e9e1d0` (top) to `#d9cdb5` (bottom) |
| Stone surround / carved reveal | `#c7b898`, shadow `#a8987a` |
| Lead came (cell borders, frame) | `#24212b` |
| Empty (unglazed) cell | `#f4eee0` with a faint diagonal hatch `#e3d9c4` |
| Tray bench | `#2c2833`, top edge `#3c3744` |
| Ruby (accent) | `#c8203f` |
| Sapphire | `#1f58c9` |
| Emerald | `#13916a` |
| Amber | `#e89c1f` |
| Amethyst | `#7a3fc2` |
| Sun / gold | `#ffd45e`, glow `#fff3c2` |
| Crystal (wild) | `#e8f4f6` with a white streak |
| Old glass | `#9c9a94` frosted, with 3 tiny pale speckles |
| Ink (text) | `#2a2530`; muted `#6d6457` |

**Glass cells:** each filled cell is its colour with a radial highlight (20% white at the top
left, fading out) and a darker inner edge (colour mixed 25% toward `#24212b`). Each cell gets 1 or 2
tiny seed bubbles (white, 18% opacity) at fixed random spots, so the glass looks hand-made. Lead
lines are 3 px at a 40 px cell (scale with cell size) with round joins. The window frame is a 6 px
lead line inside a 14 px stone surround.

**Colour-blind support:** each glass colour has a faint etched mark in the centre of the cell
(ruby: small diamond; sapphire: ring; emerald: leaf (two arcs); amber: dot; amethyst: small cross),
so pure lines can be read without colour.

**Type:** serif capitals with wide tracking (`"Iowan Old Style", Palatino, "Palatino Linotype",
ui-serif, Georgia, serif`, weight 600, letter-spacing 0.18em) for headings and the window numeral.
Old-style figures for numbers (`font-variant-numeric: oldstyle-nums`). Window numbers are always
roman numerals. No rounded sans anywhere.

**Motion**

- Set a piece: it drops in with scale 1.08 to 1 over 90 ms, and a thin bright line runs around its
  lead once (120 ms).
- Clear a line: a soft beam of white-gold light sweeps along the line (260 ms), the cells flash
  to their glow colour, then each cell becomes a coloured mote that arcs up into the rose meter
  (400 ms, staggered 20 ms). The meter petal glows when a mote lands. A light score popup ("+820",
  with "PURE" or "TWO-TONE" in small caps) rises from the line.
- Combo of 2 or more lines: diagonal light rays fall across the whole screen for 500 ms.
- Window finished: every remaining cell lights up, the whole window glows, and the light pours down
  as rays (900 ms) before the workshop opens.
- Run lost: the window greys out from the top down over 800 ms.
- Ambient: dust motes drift slowly through the light above the window (8 to 12 specks, 10%
  opacity), always drawn, 60 fps with delta time.

## Sound (WebAudio via `GameKit.sound`, silent until first tap)

Glass chimes, all sine or triangle.
- Set a piece: short "tink", 1760 Hz, 40 ms, triangle.
- Rotate: 2349 Hz, 25 ms, very quiet.
- Clear a line: rising pentatonic notes (C6, D6, E6, G6, A6), one per line in the combo, 80 ms apart.
  A pure line adds a soft high bell (2093 Hz, 300 ms, sine).
- Window finished: 5-note arpeggio up.
- Can't drop / jam warning: dull 196 Hz, 80 ms.
- Run lost: two low notes falling, 220 Hz then 165 Hz.
- Haptics: `GameKit.buzz()` light on set, medium on each clear, heavy on window finished.

## Technical notes for the Builder

- Load `../../shared/game-kit.js`, call `GameKit.init({ slug: 'glasswright' })`, use
  `GameKit.fitCanvas()`, best score through `GameKit.best()` / `GameKit.saveBest(n)`.
- `window.__game = { state: () => ({ mode, score, window: n, cuts, target, light }), demo(on) }`.
  `mode` is `title | play | paused | over`; while the workshop is open, mode stays `play`.
- **demo(on):** autopilot that plays well. Every 0.55 s it tries every hand card x 4 rotations x every
  position and picks the move with the highest value: light gained now + 6 x (cells in lines that
  are now 1 cell from complete) - 4 x (isolated empty cells left that no 1x1 or 1x2 could fill).
  It sweeps only when nothing fits. In the workshop it waits 0.8 s, then takes a pane card whose
  colour is the deck's most common colour (else the first offer), and the first tracery offered. On
  game over it restarts after 1.5 s. The ghost and drag animation should show while demo plays, so
  screenshots look like real play.
- Seeded RNG per run is fine but not required.
- Everything offline, no external URLs, no fonts loaded from anywhere.

## App Review note

Tap to begin. Drag a glass pane from the tray into the window; tap a pane to rotate it. Fill a full
row or column to clear it and earn light. Reach each window's light target within 12 placements,
then pick a new pane for your deck in the workshop. The run ends when you run out of placements
before reaching the target.
