# PRETEND CO. — project handoff

Read this first, then the character bibles in this folder.

## What this is

This is a series of fake "lost" retro games from a made-up studio called **PRETEND CO.** The user plays them on stream as if they were real games that never came out. The tone is creepypasta: surreal, psychedelic and meta, with jokes played deadpan. Each game should feel like a complete retail release, with a boot logo, title screen, saves, several endings, secrets and credits.

The user said: "so far the games have been great so i trust your creativity and feel free to get crazy with it."

There is no build step. Everything is plain HTML and classic `<script>` files. To play a game, open its `index.html`.

## Generation 1: fake Game Boy, 160×144, 4 shades (all done and bot-tested)

| Game | Entry | Palette | Notes |
|---|---|---|---|
| CARL: Above & Below Nevada | `index.html` + `js/*.js` | DMG green | The main game. It has an RPG, minigames and a secret ending. |
| CEO LINDA | `linda/index.html` | pink | Spin-off by "the same studio". |
| SPOOKY GHOST: Live From Beyond | `ghost/index.html` | red | Split into episodes. It uses `linda/lcore.js` as a shared "studio library". |
| TP: Throwing In The Towel | `tp/index.html` | gray | A meta hangout game. TP is **outside the lore**: other characters never know him, and he talks about the other games only as products. The vault in it opens if you knock three times, slide a note under, or wait 15 seconds. |

- The shared engine is `js/engine.js`. It provides a 4-shade palette buffer, an `fx` object for effects, async scripting (`say`, `choose`, `wait`), tile maps and entities.
- `HERO` sets the scenery nameplate shown in each game.
- `DBG` exposes read-only minigame state for the test bot.
- `P.phase(x, y)` lets the player walk through walls.
- Shared sprites live in `js/art.js`.

## Generation 2: "SUPER-16", a fake PC Engine/Genesis console, 320×224 with 512 colors

The generation 2 engine is in `g2/`:
- **`engine2.js`**
  - Graphics: a 16-color palette sprite builder `spr(w, h, g => …)` with `outline()`, raster skies, and a 5×7 font that includes `³`.
  - Post-processing: fade, flash, wave, shake, and `post.legacy`, which crushes the screen to 4 Game Boy greens.
  - Input: a 3-button pad. Z is A, X or Space is B, C is C, Enter is Start.
  - Dialog: 48×48 portraits registered in `PORT[name]`, with typing sounds set in `VOICE[name]`.
  - **`say()` is queued**, so only one dialog shows at a time. This was a real soft-lock fix; don't remove it.
  - `say(text, who, {port})` swaps in a different portrait for that line.
  - Other helpers: `choose`, `ask`, `showCard`, `banner`, `store` and `fetchStore`.
- **`fm.js`**: a 2-operator FM synth with patches and drums, plus a sequencer that plays `TRACKS[name]` through `music(name)`.
  - `LEGACY_AUDIO` switches every instrument to square waves.
  - `speak()` uses browser text-to-speech.
- **9-bit color gotcha**: every color is rounded to 3 bits per channel, so dark browns come out olive. Pick hex values from the grid 00/24/49/6D/92/B6/DB/FF.

### PEE KID³: Third Time's the Charm (`pk/`), done and bot-tested

The story source is `PEE_WEE_KID_AND_COMPANY.md`. The reference art is `peekid.png`, `peeweekid.png`, `peeweekid_shock.png` and `peeboy.png`.

**The user supplies reference images for new characters, so check the repo root before designing any sprites.**

Script load order is `engine2`, `fm`, `pkart`, `pkplat`, `pkstages`, `pkstory`, `pkmain`.

- **`pkart.js`**: kid sprites and portraits (`KIDPAL`, `kidSprite`, `kidPortrait`, `WEE_SHOCK`), the adult sprites, and the Gen-1 characters as 4-shade `LEGACY` relics.
- **`pkplat.js`**: the platformer.
  - **POTENTIAL** is how badly he needs to pee, and it also powers the console. Power doors need 60%. Below 25% the game drops into **LEGACY mode**: the screen turns green, lasers shut off, adults can't hurt you, and old `L` platforms appear. At 100% he has an accident.
  - Bathrooms (`T`) flush potential to 0 and act as checkpoints and save points.
  - There are three kids, swapped with C:
    - **Pee Kid**: asks questions that stun adults, and fits through vents.
    - **Pee-Wee Kid**: jumps highest, and performs by holding A, which freezes adults.
    - **Pee Boy**: inspects, which reveals hidden `?` blocks and stuns things.
  - Gimmicks, set per section: `chase` (the generator wall), `wind` and `signs` (bus roof), `k` (dodgeball machines), `l` (spotlights).
  - `world(id)` gives a section's stage number and `secName(id)` its label.
- **`pkstages.js`**: `STAGES` level layouts built with `LB()`. The tile legend is at the top of the file.
  - IDs 1 to 5 are the first section of each stage, 11 to 51 the second section, and 99 is the secret stage.
  - `ORDER` holds the play order.
  - NPC helpers: `legacyNPC` (only visible in legacy mode), `talker`, `kidTalker`.
- **`pkstory.js`**: the story and set pieces.
  - Intros for each section.
  - Bus stage: testimony objections.
  - Stage 3: stand-up timing minigame, Miss Nose quick-time orders, then re-education with THE PROFESSOR.
  - Stage 4: Takahashi (chat types, text-to-speech says it, then a d20 action roll), and a suspect who moves only when you look away.
  - Stage 5: the finale with two endings.
  - Also: the Presentation rhythm game, 16 photos (`PHOTOS` and `photoText(id)`), the secret stage, and the "Biscuit" dog ending.
- **`pkmain.js`**: boot (chrome logo and a spoken "Pretend co!"), a screen that "imports" Gen-1 save data, the title screen, stage select, the secret-stage unlock, pause and photo album, credits, and every FM track.

**Endings**
- **GET BACK IN**: colorful credits.
- **GO**: sets PERMA, which makes the whole game permanently legacy. The title screen then offers to turn the colors back on.
- **Collect all 16 photos**: a "???" option appears on the title and leads to *The First Generator*.

**Content decisions made with the bible (keep them)**
- Real public figures are replaced with fictional stand-ins: THE MOVIE STAR and THE PROFESSOR.
- No school-shooting depiction.
- The killer stays unnamed and uncaught.
- The kid never uses violence. His verbs are asking, performing and inspecting.

## Storage keys (localStorage; the games read each other's)

- Saves: `carl_sav`, `linda_sav`, `ghost_sav`, `pk_save`.
- Metas: `carl_meta`, `linda_meta`, `ghost_meta`, `tp_mem`, `pk_meta`.

## Gotchas

- Scripts share one global scope:
  - Never declare the same `const` or `let` name in two files.
  - An object literal in an earlier file must not reference a function from a later file by value. Wrap it in an arrow instead (`() => fn()`). This caused a real bug.
  - Later files may redeclare *function declarations* (for example `boot`).
- Keep an in-world, deadpan voice for any in-game text.

## Testing (`tools/`)

- Static checks: `node tools/check.js`, `lcheck.js`, `gcheck.js`, `tcheck.js`. `reach.js` audits Gen-1 maps for unreachable spots.
- Gen-1 bot: `node tools/play.js carl|linda|ghost|tp` plays the whole game headless with button inputs, using `botlib.js` and `bot_<game>.js`.
- PEE KID³ bot: `node tools/pkplay.js <startStageId> <maxFrames>`.
  - Set `WANT=GO` to take the GO ending.
  - It prints dialog, "stuck at…" lines and CREDITS. A full run is about 55k frames and takes about 10 minutes of real time.
  - The AI is in `pkbotbody.js`. It uses `DBG.mode` hooks for the minigames: `standup`, `qte`, `kbd`, `rhythm`.
- `node tools/freezecheck.js` checks that the player can't move, fall or get hurt while a dialog is open. This was a real bug.
- `node tools/groundcheck.js` checks that standing counts as on-ground every frame and that one tap of Up opens a bathroom. Gravity's sub-pixel steps once made ground contact flicker, so Up at doors worked only 1 frame in 3. Run both checks after touching movement.
- `node tools/shot.js <stageId> <tileX> <potential> [out.png]` renders a gameplay frame to a PNG.
- Door UX: doors show WC or EXIT signs, the WC sign blinks at 75% potential or more, and an "↑ BATHROOM / EXIT / TALK" prompt appears over the player when Up would do something.
- Sprite preview: `node tools/sheet.js "<draw code>" [scale] [out.png]` renders the framebuffer to a PNG you can view with Read.
- Browser checks:
  1. Run `python -m http.server 8731` in the repo root, then open `http://localhost:8731/pk/`. The Chrome extension can't open `file://`.
  2. Bust the cache with `fetch(file, {cache: 'reload'})` for each script, then reload.
  3. Set `requestAnimationFrame = () => 0`, then step frames yourself: `acc = 16.7; lastT = __t; __t += 16.7; loop(__t)`, yielding with `await Promise.resolve()`. Background tabs throttle `setTimeout`.
  4. Release keys between presses.
  5. Don't set `anyKey`, or boot will run over your test.

## Status and ideas

- All four Gen-1 games and PEE KID³ are complete, content-passed and bot-verified.
- The user said Gen 2 is "the next generation … should feel like an upgrade". More Gen-2 games (spin-offs, possibly on `g2/`) are the likely next step. Expect a new bible and reference art in the repo root for each one.
