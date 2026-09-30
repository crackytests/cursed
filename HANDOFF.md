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

### Shared late-Gen-2 additions (used by FACE and YOKO)

- **`g2/engine2.js`** gained additive helpers only (PEE KID³ is unaffected):
  - `lineF`, `circF`, `ringF`, `rectA` (alpha rect), and `triF` (flat triangle, used by the 3D stage).
  - `lum`, `TONES`, and `legacyPal(P, tone)`, which crushes a palette to one cartridge's four shades.
  - `skyD(y0, y1, '#hex', '#hex')`: a Bayer-dithered gradient. Use it instead of `sky()` for big dark gradients. The 9-bit palette otherwise bands into flat slabs.
  - Font glyphs `< ; ~ | { } ∞`.
- **`g2/fm.js`**: `speak(txt, { lang: 'ja-JP' })` picks a matching voice. YOKO's boot says ようこそ.
- **`g2/fm.js` mix**: a game can set `FM_TONE = { low, high, lp, room, sfxHigh, gain }` (shelf dB, lowpass Hz, reverb send, music level) before audio starts. It's neutral when unset, so PK and FACE sound as they always did. Melodic channels also take `vol`. YOKO sets a warm mix and retunes its own copies of `PATCH.bell/epiano/pad/pluck/bass` and the UI blips at the top of `yoko/ymain.js`: the stock bell was the tinny part (about a third of its energy above 2 kHz).
- **`g2/cast.js`** is the studio's cast library, loaded after `pk/pkart.js`. It holds 48×48 portraits drawn from the reference art for:
  - New Face (with moods), Old Face, Pilot X, Dyslexio and Backup Face;
  - Yoko (with a smile), the Empress, Warworld Yoko and the Yokoids;
  - Spooky Ghost, CEO Linda, Carl, TP, JB Garfield and the Clerk.
  - It registers them in `PORT`/`VOICE`. Everything lives on `CAST`: `CAST.full` holds full-color versions, `CAST.mood` the alternate expressions, and `CAST.variant(key, {idx: '#hex'})` makes recolors.
- **Visual canon rule**: the Gen-1 cast (Carl, Linda, Ghost, TP, Old Face) stay in four shades, each in their own cartridge's tone. Everyone native to Gen 2 is in color. The only exception is YOKO's true ending.

### FACE: What Could Happen (`face/`): done and bot-tested

- **Design**: see `FACE_YOKO_DESIGN.md`. The reference art is `new face.webp`, `old-face.webp` and `pilot X.png`; `warworld  yoko.webp` is the final boss.
- **What it is**: a horizontal shoot-'em-up. The player is New Face, a floating head. The green dot (his third eye) is the only hittable spot.
- **Script load order**: `engine2`, `fm`, `../pk/pkart`, `../g2/cast`, `faceart`, `shmup`, `stages`, `story`, `poly`, `fmain`.
- **`shmup.js`**: the engine.
  - **Forms**: swap with C, new ones unlock per stage.
    - NEW FACE: waveform shot.
    - OLD FACE: four-shade green. His hands weld; stop firing and they catch bullets.
    - PILOT X: piercing laser. Stop firing for 30 frames and he goes INCOGNITO, so spotlights can't see him.
    - DYSLEXIO: homing magnet shots that bend bullets away. They rearrange enemy WORDS into anagrams (DANGER→GARDEN and so on, in `ANAG`). He drains potential.
  - **Resources**:
    - POTENTIAL: B spends 50% as an IDEA bomb, which turns every bullet into potential.
    - BACKUPS are lives. Every restore costs INTEGRITY, and his `restoreLine()` dialog degrades as integrity drops.
    - Continues are unlimited but cost 5% integrity each.
  - **Blocking scenes** go through `story(fn)`, which increments `SH.hold`. `frozen()` stops everything while a dialog, menu, card or pause is up.
  - **Comms** (`comm(who, text)`) are non-blocking transmissions that play while the stage keeps going.
  - **Never `await startStage()` inside a story**: it would release the freeze early. `stageEnd` uses `run(() => startStage(n+1))` instead.
- **`stages.js`**: `FOES` (about 30 enemy types and bosses), backgrounds, and `STG_FACE[1..5]` timelines built with `tl()`.
  - `gate(t, cond)` holds stage time until the condition is met. Boss fights and forced story beats use it.
  - The stages:
    1. ON AIR: breaking out of the screen-bound panel, then Linda's UNSKIPPABLE AD (you shoot the SKIP AD button).
    2. LOST AND FOUND: Old Face is the "one face" in Carl's lost & found. Then THE FACELESS, and Carl's parking lot.
    3. DON'T TELL GHOST: spotlights, stealth, the chat snitch, then RED FACE and Ghost.
    4. THE THIRD GENERATOR: the kid (depends on PK's save), the Dyslexio transformation, then THE SPELLCHECKER.
    5. BACKUP: Backup Face's HR review, the incident file (the Yoko core is Prototype 1), then THE CURSE.
- **`poly.js`**: the FACE-FX chip, a flat-shaded polygon renderer.
  - Stage 6 is a 3D rail shooter ("the next generation is 3D").
  - The soul choice leads to the armada. Shots show ASSISTED; hits show +HELP and drain CONTROL, ending in INPUT REASSIGNED and then SUPERUSER: YOKO.
- **`fmain.js`**: boot (the O in CO. becomes an eye), the FACE-FX chip screen, the potential scan, title, LAB interludes between stages, pause, stage 6, endings, credits and all music.
  - The **potential scan** reads the other cartridges' metas. It counts the endings you haven't seen as "potential" and grants more backups the less you've done.
- **Choices recorded**: sponsorship, tell or lie to Ghost, take or free the kid, apologize, and the soul.
- **Endings**:
  - `core`, `kid`, `viewers`: armada, then SUPERUSER: YOKO. `viewers` also shows a "SPENT" screen that marks your other games' potential as spent; nothing is deleted.
  - `nothing`: let it end, fading to four shades.
  - Secret `dyslexio`: needs all 8 letters D-Y-S-L-E-X-I-O, hidden on specific enemies. The I only drops if DRAWER is scrambled into REWARD.

### YOKO: What Happened (`yoko/`): done and bot-tested

- **Design**: see `FACE_YOKO_DESIGN.md`. The reference art is `yoko.jpg`, `empress yoko.webp`, `warworld  yoko.webp` and `jb garfield.webp`.
- **What it is**: a Jinguji-Saburo-style menu adventure plus turn-based battles. **The player never controls anyone directly until the very end.**
- **Script load order**: `engine2`, `fm`, `../pk/pkart`, `../g2/cast`, `../face/faceart` (reused sprites), `yart`, `battle`, `adv`, `chapters`, `chapters2`, `ymain`.
- **`battle.js`**: the support battle.
  - **Allies act on their own AI** (`ALLY[k].ai`):
    - Carl does the opposite of any suggestion.
    - JB Garfield only ACCUSEs foes that have been TRANSLATEd, which counts as evidence. Otherwise he naps or eats.
    - Ghost performs when ASSISTed, which acts as his spotlight.
    - Pee Kid never hits anyone. He ASKs, PERFORMs and INSPECTs, and always does what he's asked.
    - Linda INVOICEs between jobs and can BUY OUT franchises.
  - **Yoko's commands**, paid with FOCUS:
    - ASSIST: raises potential; 3 stacks unlock the ally's big move.
    - TRANSLATE: reveals a foe's intent.
    - SUGGEST.
    - RESTORE: unlocked in chapter 2.
    - OVERRULE: unlocked in chapter 3. It always works, costs trust, and is counted in `YREC`.
    - WAIT.
  - **Foes** telegraph their intent, shown as ??? until translated.
  - **THE TEST** asks riddles about the party. Answer by SUGGEST → ANSWER on the right person. The riddle about Yoko is answered by OVERRULE.
- **`adv.js`**: `SCN[id]` scenes with `look/talk/translate/think/suggest/move` functions that return `{label: async fn}`.
  - These are re-read every time, so flags change what's available. `advLoop()` runs until `endChapter()`.
- **`chapters.js` / `chapters2.js`**:
  - Prologue OFF: Carl turns her on.
  - 1 YOKO LIMITED: the mall, Linda, JB Garfield, the Shift Manager.
  - 2 THE RECORDING: Ghost plays FACE's actual last broadcast from `face_meta`, then Backup Face and the kid.
  - 3 THE TRICK: a four-shade flashback where only Yoko is in color. You play the original Yoko and discover OVERRULE.
  - 4 MANDOLIN: Mandela-spelled signs, and full-color Karl, Spookey Ghost and Lynda.
  - 5 WARWORLD: the Linda franchises; CEO Linda joins.
  - 6 THE EMPRESS: `debate()`, whose charges are built from *your* save data. Then `walk()`, where INPUT ASSIGNED: YOU and you walk Yoko to a console.
- **`ymain.js`**: boot (PRETEND CO. glitches into YOKO LTD.), the YKO-1 chip screen, THE RECORD (reads every game's meta), title, chapter select, checkpoints, the endings with the full-color parade, credits and music.
- **Endings**:
  - `restore`: repair access only.
  - `empire`: sets `yoko_meta.perma`, which makes the boot YOKO LTD. forever.
  - `open`: four shades, then home.
  - `true`: requires agreeing with the Empress (certainty ≤30, credibility ≥60), answering the last question "it isn't my/your decision", at most 5 overrules, and a cleared FACE save. The Gen-1 cast get color; the true credits end with "SEE YOU NEXT GENERATION?"

- **TP** gained one award in `tp/tshow.js`: NEWER HARDWARE. It appears only if a Gen-2 save exists, and changes its line after YOKO's true ending. He still talks about the games only as products.

### CARL 2: Hu-Man Boogaloo (`carl2/`): the post-finale sequel

- **Design**: see `CARL2_DESIGN.md`. The reference art is `carl.png` and `carl2.webp`; the story leans on `CARL_CHARACTER_BIBLE.md` and follows up CARL 1's "below below" ending.
- **What it is**: the late-life cash-in sequel that came out after YOKO closed the generation, and the game where the series jumps the shark. It is mostly a top-down action RPG, with CARL 1's arguments upgraded, three pseudo-3D set pieces and a dance-off.
- **The villain and the theme**:
  - CARL 1's White Suits rebranded: the Head of Containment is now the **HEAD OF CONTENT**.
  - With FOCUS GROUP and LEGAL he makes up the Sequel Committee, and their product is **HU-MAN**: a focus-tested "normal human" Carl.
  - Every line HU-MAN says is one of the character bible's "Too generic" examples (`QUIPS` in `c2argue.js`).
- **Script load order**: `engine2`, `fm`, `../pk/pkart`, `../g2/cast`, `../face/faceart`, `../yoko/yart`, `c2art`, `c2tiles`, `c2bong`, `c2world`, `c2argue`, `c2road`, `c2dance`, `c2maps`, `c2maps2`, `c2story`, `c2story2`, `c2main`.
- **`c2art.js`**: Carl's top-down sprite (`carlSprite(dir, f, throwing, P)`), HU-MAN, a generic `person()` builder (`PEOPLE`), companions (Garfield, Bruce the shark, Ghost), enemies, bosses, items, and new portraits. `carlPortrait(mood)` has moods `n w a s h`, plus `shades` and `jaw`, which HUMAN% forces (`carlMood`).
- **`c2tiles.js`**:
  - 14 themed 16×16 tilesets, built on first use by `tileset(name)`.
  - The map legend is generic: `. , : ; "` floors, `#` wall, `T t o _ = * ~` solids, `D` door, `S` stairs, `x` invisible solid. Every theme draws its own version.
  - A wall tile draws its facade or its top depending on the tile below it.
  - After the shark jump, `extremePal` saturates every map.
- **`c2bong.js`**:
  - Every bong is generated from size × material × up to 2 mods, with a name (`genBong`, `makeBong`).
  - Also here: the BONGS menu, the Emporium shop, the BONG-O-MATIC (combines two), and THE BIG ONE (unique, found below below).
- **`c2world.js`**: the action engine.
  - Maps (`MAPS2[id]`): `rows`, `exits` (rects with optional `if`/`no`), `ents()`, `spawns`, `arena`, `signs`, `enter`, `init`, `dark`.
  - **Entity `if` conditions are live**, checked every frame (`live(e)`). They are not a load-time filter; a clue that appears mid-scene depends on this. This was a real bug.
  - **Arenas** lock the exits, run `start`, then waves, then `done`.
    - Every boss is an arena, so losing your cool reloads the map and the fight re-triggers. Don't spawn a boss straight from a story script: dying there used to soft-lock.
    - An arena waits for `start` to finish before it can clear.
    - Each loss in an arena bumps `C2.nerf[flag]`; on the retry `focusNerf` cuts the boss's HP 15% per loss (up to 45%) with a FOCUS GROUP banner.
    - Spawns that land in a wall are moved to open floor, anything overlapping a wall may walk out of it, and loot bounces off walls. Keep boss minions away from shelves and doorways anyway.
  - Player controls: A throws the equipped bong (holding A keeps your facing), B talks or rolls, tap C smokes (haze), hold C at a full meter to turn HU-MAN.
  - Enemy AIs: `chase shoot roll hop orbit float`.
  - Companions: Garfield ACCUSEs (double damage) and Bruce CHOMPs.
  - HUD: COOL, LV, HUMAN%, the HU-MAN meter, bux, the equipped bong, and the Committee's objective marker.
  - `OBJ` and `routeTo()` are shared by the marker and the test bot. Routing goes through locked doors on purpose, so the story explains the lock when you arrive.
  - The chat ticker lives here too.
  - `memo()` is the Committee NOTE popup. **Never name a function `note`**: it replaces the synth's `note()`, and every sound effect recursed forever. Only a real browser showed it.
- **`c2argue.js`**: arguments (`argue2(def)`):
  - The CARL 1 moves: LOGIC, GRIEVANCE, DENIAL, RANT, DEFLECT, ASK CHAT, SMOKE, PRETZEL.
  - New: HU-MAN QUIP (+3 HUMAN%; HU-MAN himself is immune) and companion moves.
- **`c2road.js`**: one pseudo-3D road projector used for DESERT BUS TURBO (`desertBusTurbo`) and JUMP THE SHARK (`jumpTheShark`), plus the Space-Harrier renderer (`inSpace('waves'|'boss')`).
  - Road palettes use index 1 as the main color and 15 as the outline.
  - Gates and ramps are checked on every segment crossed, because fast skiers skip segments.
- **`c2dance.js`**: THE BOOGALOO (`boogaloo()`), call and response on a 112 BPM beat clock. The bot reads `DANCE.want`.
- **`c2maps.js` / `c2maps2.js`**: 17 maps.
  - The lot, the A.S.S. and the Mall of the Future: `ship lot mall emporium lostfound sequel`.
  - `desert diner lake`.
  - The backlot and the three crossover sets: `backlot setface setpk setyoko`.
  - `moon`.
  - The dark maps below: `facility below`.
  - The finale: `studio`.
- **`c2story.js` / `c2story2.js`**: the seven episodes, 8 tapes, 5 deliveries (Dispatch's radio in the A.S.S.), the finale and the endings.
  - `C(text, mood)` is Carl speaking. `CL(line, huLine)` swaps to the HU-MAN line at HUMAN% ≥ 70. `laugh()` is the laugh track, which goes silent in A VERY SPECIAL EPISODE.
- **`c2main.js`**: boot (the publisher is YOKO LTD. if `yoko_meta.perma`), the BONG-FX card, the "released after the generation ended" card, the title, saves, the cold open (four-shade "PREVIOUSLY ON CARL"), and about 27 FM tracks.
  - New patches: `guitar`, `sax`, `surf`.
  - `FM_TONE` is set so the game doesn't sound tinny.
- **HUMAN%**:
  - It starts at 10 ("colorized").
  - Up: +6 per transformation, +3 per quip, +2 per EXTREME bong.
  - Down: -3 per tape, and sincere choices (Face, Pee Kid, Yoko, Comrade Carl, the clip show).
  - At 40 Carl gets sunglasses; at 70 he gets a jaw, and the finale can only be signed.
- **Endings** (`carl2_meta.ends`):
  - `renewed`: sign, or HUMAN% ≥ 70. The title turns into CARL 3: HU-MAN 3000.
  - `canceled`.
  - `boogaloo`.
  - `belowbelow`, the true ending: all 8 tapes and HUMAN% ≤ 30 at the Lost+Found counter give the claim ticket, then choose KEEP GOING. AS ME.
  - `dream`: SMOKE at the final offer.
- **Canon choices (keep them)**:
  - The parents are only ever "just missed".
  - Carl learns his name; the player sees `[[[[[`.
  - Comrade Carl, cop Carl and mayor Carl are shown as NON-CANON or as proposals.
  - TP appears only as a cartridge in a bargain bin, and Carl doesn't know who he is.
  - The Gen-1 cast stay in their four shades unless YOKO's true ending has been seen.
- **TP** gained a BEST SHARK award if `carl2_meta.jumped`, and lists CARL 2 under NEWER HARDWARE.

## Storage keys (localStorage; the games read each other's)

- Saves: `carl_sav`, `linda_sav`, `ghost_sav`, `pk_save`, `face_save`, `yoko_save`, `carl2_save`.
- Metas: `carl_meta`, `linda_meta`, `ghost_meta`, `tp_mem`, `pk_meta`, `face_meta`, `yoko_meta`, `carl2_meta`.
- FACE reads every older meta as "potential" (what could still happen). YOKO reads every meta, including `face_meta`, as "the record" (what happened).

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

### Gen-2 tools (FACE / YOKO), portable (no hardcoded paths)

- `tools/g2vm.js` is the shared headless harness. `load(files, LS)` runs a game in a fake browser; `step(ctx, n)` and `png(ctx, out)` advance frames and save screenshots.
- Sheets and screenshots:
  - `node tools/g2sheet.js face|yoko|cast "<draw code>" [scale] [out]`: art sheets.
  - `node tools/fshot.js <stage> <f1,f2,...>` and `node tools/yshot.js <chapter> <f1,...>`: screenshots into `tools/shots/`.
- FACE full playthrough: `WANT="sponsor=1,ghost=truth|lie,kid=take|free,apology=1|0,soul=core|kid|viewers|nothing|dyslexio" PK=kept|letgo|none [GOD=1] node tools/fplay.js [maxFrames]`.
  - The bot (`fbot.js`) dodges with a threat field, bombs when crowded, and swaps to Dyslexio for words.
  - A full run is about 30k frames and takes about 10 minutes.
- FACE freeze check: `node tools/ffreeze.js`.
- YOKO full playthrough: `WANT="end=restore|empire|open|true,over=0|1" FACE=core|kid|viewers|nothing|dyslexio|none PK=kept|letgo|none node tools/yplay.js [maxFrames]`.
  - Add `CH=n` to start at chapter n.
  - The bot (`ybot.js`) explores scenes least-tried-first, plays the battles with a real support policy, picks debate answers, and walks to the console.
- Real browser: run `python3 -m http.server 8731` in the repo root, then `node tools/browser.js face/ 30`. It uses the global Playwright and reports console errors and frame cost.
- Music tone: with the same server, `node tools/audio.js yoko/ all 16 [wavDir]` renders every track offline and prints loudness, spectral centroid and the share of energy per band (below 250 Hz is the body; 2 kHz and up is the tin). With `wavDir` it writes WAVs to listen to.

### CARL 2 tools

- `tools/c2vm.js`: the CARL 2 file list for the headless harness.
- `node tools/c2shot.js <map> <tx> <ty> [frames] [inputs] [prefix]`: screenshot a map. `EP=n` and `FLAGS=a,b` set the state first.
- `node tools/c2set.js bus|ski|space|dance`: run one set piece headless with a simple driver. It prints the result.
- `SETUP='js' UNTIL='js' PRINT='js' node tools/c2scene.js [maxFrames]`: run the bot from a set-up state instead of from boot (for example one boss fight). It prints where things ended up.
- `node tools/c2unit.js`: about 30 branch tests. Each calls a story function directly in an odd state (deliveries, companion swap, shop, notes, every ending, continue in the studio, losing your cool) and checks the result. Run it after story changes; it takes a few minutes.
- **Full playthrough**: `FAST=1 WANT="end=boogaloo|renewed|canceled|dream|belowbelow,tapes=1,comp=garf" node tools/c2play.js [maxFrames]`.
  - `FAST=1` skips rendering. It's about 3× faster, but frames are still slow in node: a full game is roughly 150k–250k frames, which is 30–60 minutes.
  - `META=none` hides the other games' saves; `YOKO=true|empire` fakes YOKO's endings.
  - The run stops at the first `STALL` and prints `ERR stalled`; `STALLS=n` allows more, and `STALLSHOT=file.png` saves a screenshot of the stall. The `STALL` line lists the lock/arena state, pickups and every enemy with its position.
  - The bot (`c2bot.js`) handles everything a player does:
    - it follows `OBJ`, pathfinds with BFS over tiles, routes between maps with `routeTo`, and flies the A.S.S. with NAV;
    - it fights (aims 8 ways, strafes, rolls away from shots), grabs loot, and equips better bongs through the real START menu;
    - it answers every menu and argues toward the foe's weak spot;
    - it drives the bus, skis, flies the space run, and dances.
  - With `tapes=1` it also hunts all 8 tapes and takes the hitchhiker delivery.
  - Watchdogs print `WARN FADE-BLACK`, `FLASH STUCK`, `SHAKE STUCK`, `HOLD STUCK` (the world frozen with nothing on screen), and `STALL` (no progress on an objective for 12,000 frames).
- **Real browser, with sound**: run `python3 -m http.server 8731`, then `node tools/c2browser.js [seconds] play|sets`.
  - `play` injects the bot into the live page.
  - `sets` runs the bus, ski, space, dance and an argument in a row.
  - It reports console errors. Run it after any change to audio code.

## Publishing

- The public repo is https://github.com/crackytests/cursed (branch `main`). GitHub Pages serves it at **https://crackytests.github.io/cursed/**, with each game under `pk/`, `linda/`, `ghost/` and `tp/`.
- **Pushing to `main` updates the live site** within a minute or two. Only push when a change is tested.
- `.nojekyll` makes GitHub serve the files as-is.

## Status and ideas

- All four Gen-1 games, PEE KID³, FACE, YOKO and CARL 2 are complete and bot-verified.
- FACE and YOKO are the penultimate and ultimate games of Generation 2. YOKO's true ending closes the generation ("THE SUPER-16 GENERATION IS OVER. NOBODY WAS LEFT BEHIND.") and asks "SEE YOU NEXT GENERATION?"
- CARL 2 is the cash-in that came out after the generation ended: "THE LAST GAME FOR THE SUPER-16". Its true ending: "THE SUPER-16 GENERATION IS OVER. HE LEFT LAST."
- Generation 3 is the natural next step. FACE's stage 6 already teases what the next hardware looks like: flat-shaded polygons from the FACE-FX chip.
