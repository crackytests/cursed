# CHROME FORCE: Requiem of the Wardragon

Pretend Co., 1993, SUPER-16. A Shining Force 1 clone set on the War World long after the War destroyed civilization. It's a space opera made of chrome centaurs, laser sabers and synthwave sunsets.

The cast is original, drawn in the stream's house style: screens for faces, sheet ghosts in shades, little green couriers, pink-ponytailed bioroids. The stream's own characters never appear. They are history: murals, tapes, posters, a note on a door. Lore marked **[NEW]** is invented for this cart.

## Play

- `cf/index.html` (served, or from disk). Z/J = A (confirm), X/K/Space = B (back), C/L = C (back), Enter = START, arrows/WASD.
- Towns: walk, A to talk or search, START for FORCE / ITEMS / ARCHIVE / OPTIONS. Every door opens into a room (36 in all) with townsfolk, chests to search, archive relics (a glint marks the spot) and hidden recruits. Shop, church (SAVE, RAISE, PROMOTE at level 10+) and quartermaster (who rides, max 12; the DEPOT).
- Route screen between battles: march, manage, or go back to town.
- Battle: per-unit turns ordered by agility each round. The cursor roams the lit tiles (you can pass over friends); A opens the diamond menu (ATTACK up, MAGIC left, ITEM right, STAY/SEARCH down). START on your turn opens MEMBERS / MAP / OPTIONS / SUSPEND.
- Some fields send reinforcements partway through (a banner and a camera pan announce them).
- Dax falls = defeat: half your gold, the whole force wakes in town, EXP kept (as in SF1). HP/MP refill after every battle. Units that fall in a battle you win stay down until the church raises them.

## Systems (cfrules.js, all pure)

- Terrain costs per movement type (foot, cent, heavy, beast, hover, fly) and land effect (0/15/20/30%, fliers get none).
- Hits: ATK - DEF, ±10%, reduced by land effect. Miss chance grows with AGI difference and terrain. Crits are x1.5. Second attacks and counters happen on chance.
- EXP: up to 48 per kill, scaled by the level gap. Heals and buffs also earn EXP. 100 EXP = level. Growth is a per-class average with random rounding.
- Promotion at level 10+: level resets to 1, stats stay with a bonus, and the class learns new spells. Promoted units count as level+10 for EXP.
- Spells: MEND, DETOX, PLASMA, CRYO, ARC, HASTE, OVERDRIVE, HUSH, DRAG, RECALL, UNPLUG. Each has levels with MP, range and area.
- Enemies scale from a tier T (plus a per-chapter bump of +0.5 tiers per chapter, in cfmaps, to pay for the extra fields' EXP) (HP 11+2.6T, ATK 5.5+2.1T, DEF 3+1.4T, AGI 4+1.3T) times per-type multipliers. Casters have finite MP.
- AI: score every reachable tile × action (expected damage, kills, land, heals, buffs, debuffs). HOLD units wake on proximity. Bosses stay on a leash. Healers keep back.

## Story [NEW unless noted]

The War ended everything. In the ribs of a dead titan, SIGNALHOLD keeps one law: keep the Signal burning, never open the Gate of Leaving. The Curator, an archive AI that kept everything from Before, wants the Gate opened. He believes the War's prize is behind it. He needs five keys, one from each power that fought: the Signal (Chrome), the Broadcast (Spooky Ones), the Factory (X Industries), the Assessment (Optimizers), the Materia (Linda Hordes).

1. **The Signal Still Burns**: Rust Gate (free LYN), Scrapwood, the Scrap Bridge (HARROW, left behind by his own side), the Static Shrine (Capt. Vress). The Black Visor kills Marshal Oren and takes the Signal.
2. **The City of Glass**: Gorp delivers Oren's posthumous letter. Glass Flats, the Mirror Mines (RIVET, walled in for nine days), Glassreach Gate (Glassjaw), the Black Tower (Warden Kroll; rescue VEXA).
3. **The Dead Broadcast**: Antenna Fields, Transmitter Bridge (The Repeater; SKYE), the Drowned Studio (PATCH, a stage nurse drone), the Broadcast Tower (The Anchor). The tower reveals the Chrome were cavalry frames inhabited by spirits. The Visor takes the Broadcast.
4. **Ship of Ash**: Dune Sea, Skimmer Deck (Captain Ash), the Wreck Field (BOLT-ON loses a bet), the Industrial Ark (Foreman-9; OMNI-7). The force keeps the Factory key.
5. **The Optimized**: Ordered Gardens, the Quiet Suburb (DELTA fails her own assessment), Plaza of Assessment (The Auditor), the Assessor Spire (Assessor Zero; AIKO). The Assessment key is sent to the Curator.
6. **Mother Materia**: the Bonefields, the Pink Cathedral (STITCH sews someone back the way they were), Reassembly Pits (Guttermouth), the Nest (Mother Materia, who insists she is *the* Linda; Lyn: "a Linda, not the Linda"). CINDER hatches. The force keeps the Materia key.
7. **The Black Visor**: Iron Road, the Burning Stables (GREYMANE, who taught both brothers to ride), Ironmane Walls (the Visor retreats), Throne of Hallan. The possessed king dies and names the Visor as KAEL, Dax's brother taken in a raid. The Curator pulls the force's two keys away and discards Kael, who joins.
8. **Requiem**: Pilgrim's Stair, Hall of the Cast (five plinths: FACE, LINDA, YOKO, GHOST, CARL; the first has footprints leading away), The Curator, THE WARDRAGON. The Wardragon is the four factions' last weapons welded together, with one directive: retrieve the Face, no one leaves.

Ending: the Gate opens on a concourse, "MALL OF THE FUTURE. NOW CLOSED." The War was fought over someone who belonged to himself, and he left long ago. Dax closes the Gate because there is work to do on this side. With 18+ of the 20 archive entries, a note falls from the frame: "IF YOU FIND THIS, STOP FIGHTING. I'M NOT THERE ANYMORE. -え"

Continuity care (per `ref/DARK_NIGHTS_METAL_AND_WAR_WORLD.md`):
- Bioroids are never confirmed as CEO Linda.
- Endless Yoko is only "Y." on a plaque.
- Tycoon X is only "X", and the red visor heirloom quotes Pilot X's "no spoilers" without naming him.
- The Spooky Ones' founder is "the Saint of the Sheet", never confirmed as Ghost.
- New Face is only the え and "the one who belonged to himself". His escape to the mall stays canon: he got out.

## The Chrome Force (30)

| | Class | Joins |
|---|---|---|
| DAX | Star Knight → Nova Lord (centaur, saber) | start |
| BRONC | Knight → Paladin (centaur, lance) | start |
| SISTER STATIC | Healer → Vicar (screen face) | start |
| MR. BOOTH | Mage → Wizard (sheet ghost in a junk walker) | start |
| LYN | Bioroid → Prima (self-repair) | after b11 |
| SKIP | Ninja → Master | Signalhold, after b11 |
| GORP | Courier → Sniper (little green alien on a sled) | Glassreach |
| VEXA | Rail Knight → Storm Rider (centaur, range 2-3) | after b23 |
| KRANK | Warrior → Gladiator (speaker head) | Antenna Port |
| SKYE | Jet Knight → Sky Lord (flies) | after b32 |
| FR. FEEDBACK | Priest → Vicar (preaches in loops) | Ashport |
| OMNI-7 | Robot (red visor, gun 1-2) | after b43 |
| AIKO | Assistant → Oracle (hologram drone) | after b53 |
| HOWLER | Warhound → Direhound | Serenity Grid |
| CINDER | Wyrmling (fire breath, flies) | after b63 |
| RONIN-9 | Ronin (promoted) | Ironwell |
| KAEL | Dark Knight (promoted centaur) | after b73 |
| BRO. TONE | Monk → Abbot (test-pattern face, heals at 440) | Signalhold Bell House, after b12 |
| HARROW | Knight → Paladin (ex-Ironmane lancer) | after b14 |
| MOTH | Jet Knight → Sky Lord (a spirit with wings) | Glassreach attic, talk twice |
| RIVET | Gunner → Heavy Gunner (glass miner) | after b24 |
| DJ NULL | Mage → Wizard (pirate radio sheet) | Antenna Port station, after b31 |
| PATCH | Healer → Vicar (studio nurse drone) | after b34 |
| SALT | Courier → Sniper (harpooner) | Ashport shack, after b41 |
| BOLT-ON | Warrior → Gladiator (raider who lost a bet) | after b44 |
| DELTA | Rail Knight → Storm Rider (failed warden) | after b54 |
| 404 | Not Found (the joke unit, as SF1's Jogurt) | Serenity Lost and Found |
| STITCH | Vicar (defected Horde stitcher) | after b64 |
| GREYMANE | Paladin (the brothers' riding master) | after b74 |
| THE PROJECTIONIST | Wizard (has seen the last reel) | Pilgrim's Rest booth |

Hidden goods: Pilgrim's Rest vault holds the SHINING EDGE; Last Camp's pink house has the POWER RING. Archive a17-a19 sit in rooms, a20 in a Pink Cathedral chest.

## Files

- `cfart.js`: the material painter. Shapes write materials, and each material is shaded by its own local coordinates (album-cover chrome: sky, hard horizon, burning ground). Also parametric rigs (cent, bip, heavy, bird, tiny, walker, drone, beast, tank, blob, wyrm, dragon, throne), heads, weapons, 24px chibi map sprites (mSprite + drawUnit), 48px portraits, 16px tiles, icons. Battle sprites paint at 1.4x.
- `cfdata.js`: classes, heroes, items, spells, enemy types, the ARCHIVE OF BEFORE.
- `cfrules.js`: pure rules and AI.
- `cfmaps.js`: chapters, 32 battle maps (waves = reinforcements), 8 towns, shops.
- `cfstory.js`: town NPCs, TOWN_ROOMS (the house interiors, keyed by each building's leftmost door) and every scene.
- `cfui.js`: menus, status, items, shop, church, HQ, options.
- `cfbattle.js`: map view, turns, diamond menu, targeting, cut-ins, suspend.
- `cftown.js`: walking towns, rooms, chests and signs, and the route screen.
- `cfmain.js`: FM metal soundtrack (gallop chugs + distorted leads), title, flow, save (`cf_save`, `cf_meta`, `cf_opt`), credits.

## Tests

- `node tools/cfplay.js`: validates every map and town, then plays the whole campaign headless with AI on both sides. The bot avoids tiles several enemies can reach, retreats when hurt with a medic alive, and goes back to town to raise the fallen. It also checks that every door has a room, every room's contents sit on the floor, wave foes stand on open ground and every archive entry is placed once. 8 seeds all clear the campaign with 0-2 losses, ~4.5 s each, recruiting all 30.
- `node tools/cfflow.js`: the real UI by key presses: title, opening, shop, church save, field menu, walking into the armory and opening its chest, gate, route, and a whole battle (b11) played through the cursor and diamond menu.
- `node tools/cfshot.js title|town:<id>|room:<town>:<x,y>|map:<b>|cut:<b>|fx:SPELL:LV:<b>|route:<ch>|status`: PNG screenshots.
- `node tools/cfbrowser.js` (PLAYWRIGHT_PATH, CHROME_PATH): real Chromium. Measures 60 fps on title, town, battle and cut-in, and checks there are no console errors.

Not yet checked by a person: audio by ear, difficulty for a human player, gamepad.

## The force talks back (2026-11-08)
`cfbanter.js`, from a read-through of the full bot transcript (`TRANSCRIPT=file node tools/cfplay.js`):
- QUARTERMASTER > TALK: every member has a line per chapter (BANTER[id][ch], latest at or below the chapter). Lines only reference
  events already seen: chapter climaxes are talked about in the next chapter.
- TOWN_LATER: street townsfolk change after the chapter's 1st-2nd and 3rd wins (checked against each chapter's battle order).
- FATES: the end credits give each recruited member an epilogue line instead of their class.

## Soundtrack v2: Genesis meets chromewave (2026-11-08)
- `cfsynth.js` is a CF-only sound board on top of the shared `g2/fm.js` (which stays untouched for the other carts): 3-operator FM
  (slap/fmbass, chrome, bellx, brassx, epx), FM guitar with pre-envelope drive (gtr/palm), supersaw saw/pad, square arp/psg;
  per-channel pan, ping-pong dotted-8th echo, dark hall, kick sidechain (`duck`), 8-bit crushed drums with a gated-reverb snare,
  clap, 3 toms, crash, ride, orchestra hit; chord tokens `E3+G3+B3`; score helpers xPad/xArp/xOct/xPulse/xT/xDr.
  LEGACY_AUDIO still falls back to the old chip path.
- `cfscore.js` holds all 16 tracks: same 1993 melodies, re-voiced with doubled L/R FM guitars, slap/octave bass, pumping pads,
  echoing arps, chrome octave doubles, tom fills and a crash on every loop.
- `node tools/cfmusic.js [outdir] [tracks] [secs]` renders WAVs in Chromium and prints peak/loudness/width (no clipping, battles ~-18 dB).
