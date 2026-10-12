# DARK MONDAY — stream cut and build plan

Supersedes the scope in `DARKMONDAY_DESIGN.md` (look, systems, cast and lore there still stand). This game is for **playing live on stream**: shorter than a retail crawler, but every minute has to look and sound like a real lost 1992 X68000 game, with something for viewers to react to every few minutes.

## 1. Stream cut (REVISED: four levels, between a slice and a full game)
- **Length:** about 90 to 120 minutes first time with banter, chat and dying; about 45 minutes if you know the routes. Saves anywhere, so it can split over two streams.
- **Four levels** across two "disks" (the disk swap is a bit). Each level is a complete set piece with its own palette, monsters, puzzle idea and banter, so it feels like a real chunk of a game and not a demo:

| Disk | Lvl | Name | Size | What the viewers see | Boss / beat |
|---|---|---|---|---|---|
| 1 | 1 | **GARF'S CELLAR** | 18x18 | doors, levers, a pit, lasagna, first fights (INTERNS), intro banter | none; the first descent |
| 1 | 2 | **THE SERVICE TUNNELS** | 22x22 | pressure plates, a spinner, poison (PHONE SPIDERS), a rhythm-free **COLLECTOR patrol**, **PEE KID** joins through a vent | the A.S.S. in a side room; end of disk 1 |
| 2 | 3 | **THE SERVER CRYPT** | 24x24 | consoles (Face), a dark wing, MIDDLE MANAGERS (Meeting = hold), teleporters, Yoko's glyph doors, the optional **TP alcove** | **THE COLLECTOR PRIME** |
| 2 | 4 | **THE SANCTUM** | 20x20 | the Road Below (a sunset sky hall), the memory door, the calendar room | **THE BEHOLDEN**, then the ending choice |

- **Party:** pick 4 of 6 (Carl, Linda, Ghost, JB, Face, Yoko) plus Pee Kid at level 2 for a party of 5. About 7 monster types plus 2 bosses.
- **Three endings** as in the design doc (COLLECT, FORGIVE THE DEBT, TAKE THE JOB).
- **Cut from the design** (kept in the design doc as an expansion path): the Dance Floors, the Glyph Library, the Foundry and its boss, Pilot X (a cameo hint in the Sanctum if time allows), the VENDING GOLEM and LICENSED ARMOR enemies. Their best ideas move: collector patrols to level 2, glyph doors to level 3, the sunset sky to level 4.
- **Cut line for scope trouble:** if time runs short, drop Pee Kid and the TP alcove first, then the spinner and the dark wing.

## 2. The illusion (what viewers see)
Everything that sells "this is a real old game":
- **Boot:** BIOS memory check, disk drive seek noises, "PRETEND CO. SOFT" logo, title with scrolling grid and the eye. Press-start jingle.
- **Copy protection:** a **code wheel page** gag at first boot (the manual page is on a screen you can open, the answers are slightly wrong for a joke), skippable after the first success (`dm_meta`).
- **Disk swaps:** after level 2 ("INSERT DISK 2"): fake drive activity, a loading bar that visibly stutters, then a title card. The save file asks for the right disk if you load into level 3 or 4.
- **Intro:** 8 to 10 stills with narration and music (Garf's diner, the door, the party picking up weapons), skippable.
- **The manual** in the pause menu (class list, spell list, a map legend), written as a manual.
- **Chat hooks:** three "CHAT DECIDES" prompts (a door, a lever, a risky chest): a banner and a timer, the streamer reads chat, one key picks.
- **Party talk:** banter between the members actually in the party. A `Tab` entry replays it.
- **Death and failure** are theatrical: derez, a "GAME OVER?" card that comes back with "CONTINUE (Y/N)".
- **Credits** after every ending, with a "THANKS" line that mentions the stream.

## 3. Milestones (each ends with something runnable and a screenshot or bot proof)
- **M0 Scaffold.** `dm/index.html`, copy `x68.js` and `fm.js`, headless harness (`tools/dmvm.js`, `dmshot.js`), an empty scene that draws. *Proof:* a PNG of the 512x256 screen.
- **M1 The dungeon view.** `dmgfx.js`: perspective renderer for cell-block levels (walls, doors, floors with neon grid, ceiling, fog, glow braziers), wall-face decorations in face space, themed palettes, movement and turning with a short step animation. Level 1 stub walkable by keyboard. *Proof:* screenshots of three vantage points; bot walks a loop.
- **M2 Party and HUD.** Six portraits (rim-lit busts), party panel with HP and food bars, two hands per character, compass, arrow pad, message strip; portrait click and keyboard cursor. *Proof:* HUD screenshot with all six.
- **M3 Real-time combat.** Monster entities in cells with sprite scaling, approach and attack timers, hand cooldowns, damage, death, XP, derez; INTERN and PHONE SPIDER. *Proof:* bot clears a room; test checks damage math and cooldowns.
- **M4 Items, spells, food, rest.** Inventory screen, equip rules, pickups and chests, keys, potions, the spell page and casting (a dozen spells to start), memorization on rest, food. *Proof:* test casts every spell and uses every item class.
- **M5 Levels 1 and 2.** Full map data with levers, plates, spinner, pit, vent, collector patrol, monsters and loot, banter, music, Pee Kid. *Proof:* `dmreach.js` solves each level (every key reachable) and the bot plays them.
- **M6 Levels 3 and 4.** Consoles, the dark wing, glyph doors, teleporters, the Collector Prime, the Sanctum and the Beholden. *Proof:* as M5, plus both bosses beaten by the bot.
- **M7 Story and endings.** Intro, hub note, level banters, the memory door, three endings, credits, cross-cart reads and writes (`dm_save`, `dm_meta`, `*_meta` imports). *Proof:* full-game bot reaches each ending.
- **M8 Stream polish.** Boot and disk swaps, code wheel, manual, chat prompts, options (RETAIL MODE vs NOTEBOOK map, text speed, mouse on/off), audio pass per level, glyph and text lint, performance pass, a real-Chrome pass, HANDOFF, memory, publish.

## 4. Technical decisions
- **Level format.** Per level: a row-string grid (`#` wall block, `.` open, `D` door, `S` secret, `P` pit, etc.) plus lists of objects keyed by cell: decorations on a face (`N/E/S/W`), items, monsters, triggers, text. Cell-block walls with doors as cell slabs.
- **Renderer.** Draws the whole view every frame into an offscreen 248x160 buffer (no caching, so lights animate), back to front, with faces defined in a (u, v) face space so wall decorations and texture lines work on front and side faces alike. Fog by per-depth color tables.
- **Sprites.** Pre-drawn once into buffers, nearest-neighbor scaled per depth.
- **Time.** 60 fps loop from `x68.js`; combat timers in frames so the bot and the game agree.
- **Input.** Mouse plus keyboard from M2; the bot only uses keys.
- **Saves.** `dm_save` (3 slots), `dm_meta` (boots, disk, endings, protection passed).
- **Testing.** Same pattern as neomonday: `tools/dmvm.js` loads scripts into a fake browser; `dmshot.js` for PNGs; `dmreach.js` flood-fill; `dmplay.js` bot; `dmlint.js` for glyphs and long lines. Long bot runs go in the foreground, with a frame cap, not as background jobs.

## 5. Risks
- **Content volume** is the real cost (four hand-built maps, seven monster types plus two bosses, eight portraits, many lines). Each level is built to completion before the next, and the order is chosen so the game can end after level 3 with a stub Beholden if time runs out.
- **Look.** The neon-edged glass look has to read at a glance; M1 settles it before anything else gets built on it.
- **Performance.** Per-frame render is expected to be fine in Chrome; if not, cache the static layer per facing.

## 6. Status
- **M0 done.** Scaffold, engine copied, headless harness.
- **M1 done.** dmgfx.js: first-person renderer (neon glass, rim colors, fog, doors, floor marks, wall decor, dark-zone fog).
- **M2 done.** Eight portraits, party panel, arrow pad, compass, log, mouse.
- **M3 done.** dmmons.js: INTERN and PHONE SPIDER (sprites, BFS pathing, aggro, real-time attacks, poison), per-hand cooldowns, melee from the front rank only, ranged down a clear line, derez deaths, XP and levels, game over. tools/dmcombat.js.
- **M4 done.** dmitems.js (item table, equipment and AC, floor items, grab-and-place inventory screen, food and potions), dmspells.js (14 spells, SP, SYNERGY/ASSIST/LUMEN timers, poison and hold, PHASE, DEDUCE, TRANSLATE hook), dmmain.js (interaction, locked doors and keys, levers/plates/signs through lv.ev, party menu, rest with ambush, food clock, 3 save slots). Tests: dmtest.js, dmcombat.js, dmsys.js, dmspell.js. Checked in real Chrome (portrait click opens the inventory, grab, place, close).
- **M5 done (levels 1 and 2).** dmdata.js has a map builder and the two real levels; dmstory.js has per-party banter, the Pee Kid recruit scene and speaker portraits; dmflow.js has boot, title (the eye), party select, intro, disk swap and the end-of-disk card; the Collector (patrolling monster), spinners, stairs, sealed doors and declarative triggers are in. Verified by tools/dmreach.js (data wiring, solvability, door gates), tools/dmplay.js (an autopilot that plays levels 1 and 2 with real inputs and finishes) and a real-Chrome run through boot, title, party select, intro and into level 1.
- **M6 done (levels 3 and 4, bosses, endings).** dmlevels2.js: the Server Crypt (consoles with a password puzzle, a dark wing with teleporters, a glyph vault for Yoko, a secret gray TP alcove, Middle Managers that hold you in a Meeting from two cells away, **Collector Prime** who calls in interns at half health) and the Sanctum (a painted sunset sky over low walls, the memory gate, the calendar hall, **the Beholden**: a stationary eye that fires ten named debt-rays). dmstory2.js: banter, the console, Prime, the memory gate (each member answers one question, one option is true), the Beholden choice, three endings (COLLECT, FORGIVE THE DEBT needs all three IOUs and enough true answers, SIGN ON), credits, `dm_meta`. Bosses only wake from their scene (`wakeOnly`). Progress never needs a particular character: glyph vault, secret wall and dark wing are optional. Balance checked with the autopilot across party compositions (all-caster parties are the hard case).
- **Left: M7/M8 polish.** Code-wheel copy protection, the in-game manual, "CHAT DECIDES" prompts, options (retail vs notebook map, text speed, mouse on/off), a notebook automap, a title-screen endings list, audio pass, intro stills, final real-Chrome pass on the whole game, HANDOFF, publish.
- **Controls:** arrows move and turn, A/D strafe, Z or click uses or picks up, X drops the held item, 1-6 attack with that character's main hand, F casts, Tab opens the party menu (inventory, rest, save, load). Click a portrait for the inventory, right-click a portrait to cast, click a hand slot to attack.
- **Test commands:** node tools/dmtest.js, dmcombat.js, dmsys.js, dmspell.js, dmreach.js [--map], dmplay.js [startLevel] [maxFrames] (env PARTY=CARL,LINDA,JB,FACE VERBOSE=1), dmflowshots.js, dmshot.js. In a real browser tab, step frames with microtask yields (await null) because a hidden tab freezes rAF and throttles timers.
- **Art direction (revised after M5):** Dark Monday has its own look, not a Neo Monday reskin. Portraits are faceted dark-glass forms with a magenta left rim and cyan right rim, violet airbrush shadows, a gradient-and-rays backdrop with a grid horizon, and a neon ID-card frame (dmart.js toolkit: F, rimEdges, shadeSide, bgCard, cardFrame, slit). Monsters, the Collector and Pee Kid use the same toolkit (dmmons.js) with sglow so glows never paint boxes on transparent pixels. JB is redrawn (no longer copied from Neo Monday). tools/dmportsheet.js and tools/dmmonsheet.js render contact sheets.
- **Test commands (all):** node tools/dmtest.js, dmcombat.js, dmsys.js, dmspell.js, dmreach.js [--map], dmflowtest.js, dmplay.js [startLevel] [maxFrames] (env PARTY=CARL,LINDA,JB,FACE  WANT=end=collect|forgive|job,truth=1  VERBOSE=1). dmreach also renders every cell of every level, which the autopilot does not.
- **Art replaced (2026-10-06):** every item has its own icon (dmicons.js) and the intro has seven animated stills (dmstills.js); checked headlessly (tools/dmiconsheet.js, dmstillshots.js, dmpolish) and by sheet screenshots. Real-Chrome screenshots came back flat in this environment, so look at it once by eye.
- **M7/M8 polish done (2026-10-06):** copy protection (code wheel, first boot only), the manual, three CHAT DECIDES prompts (red button, bottle, vending machine), options (text speed, music and sfx level, mouse, chat, map mode), JB's notebook map, mouse-aware menus and click-to-advance dialogue, endings list on the title, a PRESS ANY KEY boot prompt, dmlint, dmpolish, dmall. Real-Chrome pass done for boot, protection, title, party select, game start, mouse paths, the Sanctum and an ending, audio context confirmed running. **Not done:** publish (nothing is committed or pushed), a human playtest for pacing and difficulty, music tuning by ear (tracks are untested by a listener), item icons and intro stills are first-pass.
