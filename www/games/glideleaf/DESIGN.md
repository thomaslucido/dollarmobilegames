# Glideleaf

**Tagline:** Spell a path up the falling leaves. Keep gliding. (49 chars)

**Genre (registry):** falling-leaf word glide

**Accent:** `#e5481f` (maple vermilion)

**Category:** GAMES_WORD

## Trend and evidence

- **Trend:** word games. You form words from letters, sessions are short (3 to 8 minutes), the goal
  is clear and there is a best score to beat.
- **Evidence:** scout report `data/scout/2026-11-16.md`, trend #1 (low confidence). A standalone
  multiplayer word game from a major newspaper's games arm is reported at over 1M downloads
  (PocketGamer.biz). A Sensor Tower Q4 2025 page shows a calm word-puzzle title rising in US
  Android downloads late in the quarter. `data/trends/` is still empty, so this is **directional
  only**.
- **Why this trend:** it is the scout's strongest candidate. We have never made a word game, and
  word games are not in our last 6 genres (pancake sort, roguelike block puzzle, idle garden runner,
  cozy tending sim, wind-up lane defense, flytrap snap arcade). The scout flagged that word games sit
  close to puzzle. Glideleaf is not a grid or tile puzzle. It is a word game with real-time movement
  and a spatial route to plan: the board falls, and you climb it. Trend #2 (kids casual) had too
  little evidence. Trend #3 (party) needs multiplayer, which breaks our offline rule.
- **Core verb, checked against our earlier games:** **drag a route through floating leaves, one
  letter per leaf, then let go to glide along it.** Burrowbank uses taps. Wheelthrown drags one
  piece to one cell. Bank Shot drags back to aim. In Glideleaf the trace is a word, and the shape of
  that word on screen is where the hero goes next.
- **Distance from famous word games:** there is no fixed grid, letter wheel, tile rack, crossword,
  daily hidden word or falling-block well. Letters ride on separate leaves that fall and sway, and
  what you can reach depends on where the squirrel is standing. There are no lettered tiles to
  place, no board squares and no opponent.

## The pitch

A crisp autumn noon in a birch wood, painted like a mid-century picture book. A small flying
squirrel sits on a falling maple leaf. Hundreds of leaves drift down past her, and each one carries
a big letter. To stay up she glides from leaf to leaf, and every glide has to spell a word. Drag a
route up through the leaves, spelling L-E-A-F or G-L-O-W or B-R-A-N-C-H, and let go. She glides
along it and lands on the last letter. Everything keeps falling, a little faster each minute. If her
leaf reaches the leaf pile on the ground, she uses up an acorn. When the acorns run out, the run is
over.

## The twist (what makes it its own game)

1. **Your word is a route.** Each letter must be on a leaf within the squirrel's glide reach of the
   letter before it, so the order of your letters is also a path across the screen. A long word
   that climbs is worth more than a short one. You read the board for words that go *up*.
2. **The board falls and you climb it.** Leaves drift down steadily and sway, so the board is never
   still. Standing still means sinking, so the timer is the ground coming up.
3. **You land on your last letter.** The squirrel finishes on the final leaf of the word. If the
   next word starts on that same leaf (the last letter of the word before), it is a **chain** and
   earns a growing multiplier. A word ending in S that sits next to T, O and P is a good place to
   land. A word ending in X is not.
4. **Leaves have moods.** Gold leaves double a letter. Wet leaves fall faster than the rest.
   Brittle leaves crumble a few seconds after you land on one. Acorn leaves give back a life.

## Controls

- **One verb: drag and let go.** Put a finger on a leaf within reach of the squirrel. This is the
  first letter (it can be the leaf she is standing on). Drag through more leaves to add letters, then
  lift to glide.
- A leaf is added when the finger enters its hit circle (radius `0.085 W` around its centre) and it
  is within reach `R` of the last leaf in the route, measured at that moment. A leaf already in the
  route or out of reach is ignored (no error). If more than one leaf qualifies, the one with the
  nearest centre wins.
- **Backing up:** dragging back into the second-to-last leaf removes the last leaf.
- **Release:** if the route spells a listed word of 3 to 8 letters, the squirrel glides. If not,
  the route leaves give a 0.2 s shake and a soft "hm", and nothing else happens (no penalty, the clock
  just kept running).
- Input is ignored during a glide (at most 0.9 s). Works the same with a mouse. Tap the card to
  start, retry or resume. One finger only (a second touch is ignored).

## Geometry (portrait, share of screen width W and height H)

| Zone | Where |
|---|---|
| HUD | 0 to 11% H. Score centred, best under it, three acorns top right, chain multiplier under the score. The top-left 60 x 60 px stays clear for the web Back button |
| Word banner | 11% to 15% H, a cream painted strip showing the word being traced (or the last word and its points) |
| Leaf field | leaves fall from above the top edge. They can only be **selected** between 15% and 87% H. Above that they pass behind the HUD |
| Leaf pile (ground) | top edge `G = 0.87 H` down to the bottom, above the bottom safe area |

- **Layout of leaves:** leaves spawn in **staggered rows** above the screen. Even rows have 5 slots at
  x = 0.1, 0.3, 0.5, 0.7, 0.9 W. Odd rows have 4 slots at x = 0.2, 0.4, 0.6, 0.8 W. Rows are
  `0.17 W` apart, so the field is a loose hex layout with neighbours about 0.2 W apart. Each slot is
  jittered by up to +-0.025 W in x and y. A new row spawns each time the field has fallen 0.17 W.
  At the start, rows are pre-filled from the top down to G.
- **Leaf size:** about 0.15 W across (its silhouette varies by shape), letter centred, 0.075 W
  type. Leaves never overlap at spawn. Wet leaves may slide past others later; draw wet leaves on
  top.
- **Squirrel:** sits on her leaf's centre, about 0.11 W tall, and rides it down. She starts on the
  leaf nearest (0.5 W, 0.55 H).
- **Reach ring:** a dotted cream circle of radius `R` drawn around the squirrel when idle. While
  tracing it moves to the last leaf in the route, and leaves inside it lift slightly (scale 1.05).

## Falling, swaying, leaf kinds

- The field falls at `v(t)` (H per second) and every leaf moves with it, so neighbours stay
  neighbours. Each leaf also sways sideways: `x = x0 + A(t) x sin(2 pi t / P + phase)`, with P
  random from 2.8 to 3.8 s per leaf. It tilts +-10 degrees in time with the sway, and the letter
  stays upright.
- A leaf that reaches G settles onto the pile with a small puff and is removed.
- **Kinds** (chosen per leaf at spawn):

| Kind | Look | Rule | Share |
|---|---|---|---|
| Plain | maple red, persimmon, burgundy or olive | none | the rest |
| Gold | `#f6c445` with a sparkle | that letter scores x2 | 6% from the start |
| Wet | dark umber with a gloss streak and a droplet | falls at 1.5 x v(t), so it slides down through the field | from 45 s: 6%, rising to 12% at 150 s |
| Brittle | pale tan, cracked, curled tip | 2.5 s after the squirrel lands on it, it crumbles (it shakes from 1.2 s). Using it inside a route is fine | from 90 s: 8%, rising to 14% at 200 s |
| Acorn | an olive leaf with a small acorn badge at its stem | spelling through it (any position) gives +1 acorn (max 3), or +100 points if full | from 30 s, only while acorns < 3: 3% per leaf, at most one on screen |

- **Crumbling under her:** if a brittle leaf crumbles while the squirrel is on it, she drops
  straight down at 1.2 H/s and grabs the first non-brittle leaf whose centre is within 0.15 W
  sideways and 0.3 H below. If there is none, she lands in the pile (see Fail state).

## Letters

- **Weights** (our own table, normalised): vowels about 40%: E 12, A 9, O 8, I 8, U 3. Consonants:
  T 7, N 6, S 6, R 6, L 5, D 4, H 3, C 3, M 3, P 3, G 2.5, B 2, F 2, W 1.5, Y 1.5, K 1.2, V 1,
  J 0.3, X 0.3, Qu 0.3, Z 0.3.
- **Qu** is one leaf showing "Qu". It adds "qu" to the word and counts as 2 letters for length and
  the 8-letter cap.
- **Local balance at spawn:** look at the leaves within 0.45 W of the new slot. If fewer than 30%
  are vowels, force a vowel. If more than 55% are vowels, force a consonant. Never more than 2 of the
  same letter within 0.45 W. Never two Qu leaves on screen.
- **No dead ends:** once a second, run the word search from the demo (below) from the squirrel's
  reach. If no word of 3+ letters has existed for 3 s in a row, re-letter the 2 consonant leaves
  nearest the squirrel (within R) to A and E, with a little rustle (leaf flips 360 degrees over 0.3 s).

## Word list (offline, inside the game)

- **Source:** the ENABLE word list (`enable1.txt`, public domain, 172,823 words), fetched once by
  the builder's generator script at build time. The script and the raw list are **not** shipped.
  Only the packed output goes in the game folder.
- **Filter:** lowercase a to z only, length 3 to 8. That leaves 80,272 words (3: 972, 4: 3,903,
  5: 8,636, 6: 15,232, 7: 23,109, 8: 28,420).
- **Keep it 4+:** the generator removes a **blocklist** written only in the generator script (never
  shipped): slurs of any kind, sexual and anatomical slang, profanity and its inflections, crude
  bodily words, and drug words. Aim for a thorough list (300+ entries with plural/-ed/-ing forms).
  The game simply does not accept those words. Also drop `firebase` so the validator's tracking-word
  check never trips.
- **Packing:** `www/games/glideleaf/words.js` sets
  `window.GLIDE_WORDS = { 3: "...", 4: "...", ..., 8: "..." }`. Each value is that length's sorted
  words joined with **no separators** (fixed width, so word i of length n is `s.substr(i*n, n)`).
  That is about **0.54 MB**. It has no spaces, slashes or brackets, so it cannot trip the
  validator's network checks.
- **Lookup:** at load (after the title shows), decode into a `Set` of words and a `Set` of prefixes
  (lengths 1 to 7) for the route search. Or use binary search on the fixed-width strings. Both
  are fine on a phone.
- **Budget:** `words.js` at most 560 KB; the whole game folder at most 1.0 MB (the limit is 1.5 MB).
  If space is ever tight, drop length 8 (saves 227 KB).

## Glide

- On a valid word, the squirrel glides through each leaf in order: 0.11 s per hop, along a shallow
  arc (0.03 W high), with her membrane spread wide. She lands with a squash (1.15 x 0.85 for 80 ms).
- Every route leaf except the last one **crumbles** after she leaves it. It breaks into 5 tumbling
  pieces plus a few flecks and is removed. Her old leaf crumbles only if it was the first letter.
- New rows keep arriving from the top, so the field above stays full, and the field below thins
  out where you have been.

## Scoring, fail state, best

- **Letter points** (our own table): 1 point: A E I O U L N R S T. 2 points: B C D G H M P Y.
  3 points: F K V W. 4 points: J X Z and Qu. A gold leaf doubles its letter.
- **Word score** = `10 x (sum of letter points) x length x chain`, rounded.
  - length multiplier: 3 letters x1, 4 x1.5, 5 x2, 6 x3, 7 x4, 8 x5.
  - **chain:** if the route starts on the leaf she is standing on, the chain count c goes up by
    1 and the multiplier is `min(3, 1 + 0.5 c)` (x1.5, x2, x2.5, x3). A word that starts on any other
    leaf resets c to 0. A landing in the pile also resets it. When c > 0, the multiplier shows under
    the score as a small leaf badge.
  - Example: LEAF = 10 x (1+1+1+3) x 1.5 = 90.
- **Climb points:** +5 for each 1% of H the squirrel ends higher on screen than she started the glide
  (only when she gains height).
- A score pop rises from the landing leaf, showing the word, its points and "chain x2" when
  chained.
- **Acorns (lives):** start with 3, shown top right. When the squirrel's leaf (or the squirrel)
  reaches G, she **lands in the pile**: one acorn pops off, the leaves puff, and she springs back up
  in an arc to the plain leaf nearest (0.5 W, 0.5 H). The field then falls at 30% speed for 1.5 s
  while she recovers.
- **Fail state:** a landing that uses the last acorn ends the run. She sinks into the leaf pile with
  only her tail sticking out, and the card reads "Landed in the leaves". It shows the score, best,
  words spelled, longest word, top-scoring word and time aloft. Tap to glide again.
- **Best score** persists with `GameKit.best()` / `GameKit.saveBest(n)`. A new best shows a "new
  best" leaf stamp on the card.

## Difficulty curve (t = seconds played)

- Fall speed `v(t) = min(0.060, 0.018 + 0.00018 t)` H/s. After 240 s, add 0.003 for every full
  30 s, up to 0.075.
- Reach `R(t) = max(0.215 W, 0.25 W - 0.0002 W x t)`.
- Row fill (the chance each slot gets a leaf) `= max(0.80, 1 - 0.001 t)`.
- Sway amplitude `A(t) = min(0.03 W, 0.018 W + 0.00006 W x t)`.

| t | fall (H/s) | time to cross the field | reach | fill | wet | brittle |
|---|---|---|---|---|---|---|
| 0 s | 0.018 | 40 s | 0.250 W | 100% | none | none |
| 60 s | 0.029 | 25 s | 0.238 W | 94% | 7% | none |
| 120 s | 0.040 | 18 s | 0.226 W | 88% | 10% | 10% |
| 180 s | 0.050 | 14 s | 0.215 W | 82% | 12% | 12% |
| 240 s | 0.060 | 12 s | 0.215 W | 80% | 12% | 14% |
| 300 s | 0.066 | 11 s | 0.215 W | 80% | 12% | 14% |

- **Why it lasts 3+ minutes:** a 4-letter word that climbs gains about 2 rows (0.34 W, about 0.16 H
  at 390 x 844). A new player finds a word every 6 to 8 s (about 0.02 to 0.027 H/s of climb). That
  keeps up with the early fall, but falls behind around 90 to 150 s, as reach shrinks and gaps and
  brittle leaves appear. Each acorn buys about 20 to 40 s more. **A typical run is 3 to 5 minutes.**
  A strong player who chains and chases long words climbs about 0.05 H/s and passes 6 minutes.
- **Expected scores:** a first run 1,500 to 4,000; a good run 8,000+.
- **Tuning knobs** for QA if runs are far off 3 to 5 minutes: the slope of `v(t)`, the floor of
  `R(t)`, and the brittle share.

## Demo autopilot (`__game.demo(on)`)

- While idle (not gliding), every 0.7 s: run a depth-first search over the leaf graph, starting at
  every selectable leaf within R of the squirrel. Edges link leaves within R of each other. Prune with
  the prefix set, and stop at length 6.
- Score each found word as `word score + 400 x (height gained as a share of H) + 150 if it chains`.
  Subtract 200 if it lands on a brittle or wet leaf. Pick the best one, then wait a 0.3 s "think".
- Trace it with a visible soft finger dot that moves through the leaf centres at 0.12 s per leaf, so
  the ribbon and the word banner show, then release.
- If no word exists, wait. The dead-end rule will re-letter leaves within 3 s.
- `demo(true)` must comfortably pass 4 minutes at 390 x 844 and 375 x 667. `demo(false)` hands
  control back.
- Screenshot moments: (01) about 20 s, a 4 to 5 letter ribbon mid-trace with the word in the
  banner; (02) about 80 s, the squirrel mid-glide with a "chain x2" score pop; (03) about 150 s, gold
  and brittle leaves on screen, acorns in the HUD, a 5-figure score.

## Art direction: a mid-century picture book, autumn noon

Nothing like our earlier games. Bank Shot is neon. Lantern Drift is a dark purple night lake with an
orange glow. Burrowbank is sunny paper-cut sand in teal and navy. Wheelthrown is matte moss and
terracotta clay. Griddlewise is a cobalt-tile screen print. Glasswright is limestone and jewel glass.
Sow Far is a pink and green risograph zine. Simmerstone is a pastel felt diorama. Tintrot is tin toys
with black outlines on walnut. Gulpwort is a coral sticker sheet with white die-cut borders.
Glideleaf looks like a **1950s to 60s children's picture book painted in gouache**: flat matte
shapes with a **dry-brush texture**, slightly wobbly hand-painted edges, **no outlines at all**,
overlapping semi-transparent shapes for depth, and a **clear pale sky-blue** page (our first sky
background). Tall white birch trunks with black marks give the vertical rhythm. No borders, no
halftone, no stitches, no ink lines, no gloss, no glow.

| Use | Hex |
|---|---|
| Sky (flat page) | `#a8d8e8` |
| Dry-brush streaks on the sky (horizontal, 40%) | `#c2e5f0` |
| Sun disc (upper left, radius 0.22 W, partly behind a birch) | `#f7f1dc` |
| Far birches (thin, pale), their marks | `#d4e9ef`, `#b5d2dc` |
| Near birch bark, shade side, marks | `#f5f2ea`, `#dcd6ca`, `#2d2b36` |
| Leaf: maple vermilion (accent) | `#e5481f` |
| Leaf: persimmon | `#f3892b` |
| Leaf: burgundy | `#9b2f4a` |
| Leaf: olive | `#7f9a3a` |
| Leaf veins | leaf colour mixed 30% toward `#3a1e17` |
| Gold leaf, its highlight | `#f6c445`, `#fff1b8` |
| Wet leaf, gloss streak, droplet | `#6a4636`, `#a07a62`, `#dff3f8` |
| Brittle leaf, its cracks | `#d8b98a`, `#8e6c47` |
| Acorn badge: cap, nut | `#7a5130`, `#c98b4a` |
| Letters on dark leaves, their shadow | `#fff7e6`, `#3a1e17` at 35% (2 px down) |
| Letters on gold and brittle leaves | `#3a1e17` |
| Squirrel fur, belly, membrane | `#8b8796`, `#f4ead8`, `#a6a1b0` |
| Squirrel tail, tail tip, eyes, nose | `#7a7686`, `#c9c4d2`, `#1f1c26` (white glint), `#e88a8a` |
| Route ribbon, reach ring | `#fff7e6` |
| Valid-word ribbon core, HUD ink | `#2c2433` |
| Leaf pile (layered blobs), soil band | `#c9622b`, `#9b2f4a`, `#e0a03a`, `#7f9a3a`; `#5a3a2a` |
| Danger pulse on the pile edge | `#e5481f` |
| Cards and word banner | `#fff7e6` with a wobbly painted edge |

- **Gouache look (all in canvas):** build a 256 x 256 dry-brush tile once at load (short
  horizontal streaks of random alpha). Draw it with `multiply` at 8% over the sky, the trunks, the
  pile and the cards. Each leaf's outline is jittered by +-1.5% of its size at its outline points,
  using a seed stored at spawn, so every leaf looks hand-cut but stays steady from frame to frame.
  Leaf veins are 2 to 3 soft strokes, not lines with ends.
- **Leaf shapes:** three silhouettes, picked at random: a 5-lobed **maple**, a pointed **birch**
  oval, and a round-hearted **aspen**. Each has a short stem tick. The letter is big and centred:
  Futura Bold capitals.
- **Layout:** two near birch trunks, one at the left edge (0 to 0.07 W) and one at the right
  (0.93 W to the edge), painted behind the leaves. Three pale far birches stand between them. The
  leaf pile is a lumpy mound across the bottom with the soil band under it. The HUD sits on the sky
  with no panel. The word banner is a narrow cream strip.
- **Squirrel:** sitting, she is a round grey body with a cream belly, big dark eyes, small round
  ears and a flat fluffy tail curled up behind her. Gliding, she becomes a flat rounded square with
  the membrane spread between her four paws and her tail straight out behind, so her silhouette
  changes clearly. Idle: she blinks every 2 to 4 s and flicks her tail.
- **Tracing:** route leaves lift (scale 1.12, a soft 4 px shadow down-right in sky shade `#7fb3c6`)
  and get a 3 px cream ring. A cream ribbon (0.018 W thick, 85%, round caps) joins their centres.
  When the letters spell a listed word, the ribbon gains a `#2c2433` core and the banner word turns
  vermilion. Invalid release: the route shakes +-3 px for 0.2 s.
- **Motion:** leaves sway and tilt. Gold leaves twinkle with 3 small sparkle ticks. Wet leaves drip
  a droplet every 1.5 s. Brittle leaves shake +-2 px at 18 Hz before they crumble. A crumble breaks
  the leaf into 5 tumbling pieces. A landing in the pile throws up 10 small leaves. When the
  squirrel is below 0.72 H, the pile edge pulses vermilion at 2 Hz and the acorns jiggle.
- **Type:** a **geometric sans**, a new voice for us. Lantern Drift uses a rounded sans, Burrowbank
  a heavy italic serif, Wheelthrown and Sow Far condensed caps, Griddlewise a slab or typewriter
  serif, Glasswright old-style serif caps, Simmerstone humanist lowercase, Tintrot a wide grotesque,
  and Gulpwort bouncy lowercase stickers. Use
  `Futura, "Century Gothic", "Avenir Next", "Trebuchet MS", sans-serif`. Leaf letters are weight 700
  capitals. UI text is weight 500, in sentence case, with letter-spacing 0.06em and tabular numbers.
  The **title** "glideleaf" is lowercase, and each letter sits on its own leaf drifting down
  across the title screen. Never italic, no strokes, no outlines.
- **Cards:** the title, pause and game-over cards are cream with a wobbly painted edge and a soft
  sky-shade shadow. Big numbers are in `#2c2433`, with a small vermilion maple-leaf stamp for a new
  best.

## Sound (optional, WebAudio via `GameKit.sound`, silent until the first tap)

- Leaf added to the route: a soft wooden tick (triangle, 0.03 s). The pitch climbs a pentatonic
  step with each letter (C D E G A C D E).
- Valid word on release: a two-note "whoosh-chime" (filtered noise sweep plus sine 660 to 990 Hz).
  Chained words go up a fourth.
- Not a word: a low triangle 140 Hz, 0.05 s.
- Leaf crumble: a short noise crackle, 0.06 s.
- Acorn collected: a woody "pok" (sine 520 Hz, 0.04 s), then 780 Hz.
- Landing in the pile: a soft noise thump plus a triangle sliding from 330 to 160 Hz over 0.3 s,
  with `GameKit.buzz()`.
- No music, no constant wind noise.

## Review note

Tap to start. Drag your finger from a leaf near the squirrel through other nearby leaves to spell a
word of 3 or more letters, then lift. She glides along the word. Keep her from falling to the leaf
pile. The game ends after three landings.
