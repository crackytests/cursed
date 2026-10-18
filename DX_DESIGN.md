# CARL DENTON: DEUS EX NEVADA

デウス・エクス・ネバダ — Pretend Soft, Sharp X68030, 1994. Five disks. Requires 4MB, mouse recommended.

The lost cartridge that should not exist: a full immersive sim on the 68k-X, six years before Deus Ex, with the stream's cast in it, and a chat window in the HUD of a game from 1994.

**The fusion.** JC Denton is an augmented agent who learns his agency works for the people who made the plague, and that he was built by them. Carl is an alien who escaped an underground facility below Nevada and wants everyone to agree he is a normal human. Put them together and you get the shape of the whole game: **a government hands Carl an ID that says SPECIES: HUMAN, and the price of keeping it is hunting the people it's lying to.** Deus Ex ends at Area 51. Carl is from below Nevada. The game ends where he started.

Everything marked *(new)* is new lore for this cart. Nothing here settles Carl's real name, his parents, his homeworld, or the facility's full history. The facility records in the last disk are redacted or say **STILL IN TRANSIT**.

---

## 1. Look and feel

- **Engine:** 68k-X 512x256, tall pixels, 12-bit color, FM sound (dm/'s x68.js + fm.js copied into dx/).
- **View:** top-down 3/4 like Ultima VII and the MSX2 Metal Gear 2 (the real 1990 stealth game a 1994 X68k team would have worshipped). Tiles 24x12, walls rise 18px, actors drawn in depth order, Carl shown as an outline when a wall hides him.
- **Light is a mechanic.** Every map has a tile light map from its lamps. Darkness is dithered through 12-bit color tables. Carl's visibility to guards is the light where he stands. Shooting a lamp out changes the room.
- **Line of sight.** Carl sees what his eyes can see: tiles out of view are drawn in a cold "remembered" tint, actors there are hidden. Unexplored is black.
- **Portraits** for conversations are 90s anime cels (Snatcher / Policenauts era) converted to 16 colors with the PEE BOY pipeline (tools/pbgen.js + pbconv.py, retargeted to 512x256 tall pixels). Procedural fallbacks exist for every speaker, so the game runs before art lands.
- **HUD** is Deus Ex's, rebuilt for 1994: body-damage figure top left (Carl's silhouette, big head and all), aug icons down the right, ammo box, a 10-slot belt, bioelectric bar. Plus the thing a 1994 game cannot have: **the CHAT window** scrolling along the right edge.

## 2. Chat is the infolink

DX's infolink is how the world talks into JC's head. Carl's is a stream. *(new)* The FATCO "infolink" is a chat feed: Yoko on ops, Pilot X, the Director, later Old Face; and between them, **chat** — anonymous usernames reacting to everything Carl does (sneaking, killing, getting spotted, picking up a bong, reading emails). Chat gives hints, wrong hints, polls at big decisions ("KILL HIM 61% / SPARE 39%"), and remembers. Carl answers chat sometimes. The bible's rule holds: chat is company, witness, accomplice, irritant.

## 3. Systems (what Deus Ex has, all of it)

| System | How it works here |
|---|---|
| **Movement** | WASD/arrows, Shift walk (quiet), C crouch (smaller, quieter, enters vents), Speed aug vaults fences. Swimming in water tiles uses breath. |
| **Aiming** | Mouse crosshair; DX-style accuracy reticle that tightens while standing still and widens on movement, damage, poor skill. No mouse: auto-aim to the nearest visible target in the facing arc. |
| **Body damage** | Head, torso, L/R arm, L/R leg like DX. Arms hurt = aim worse. Legs hurt = slow, both gone = crawl. Head or torso to zero = dead. Medkits heal all parts, Medicine skill boosts. |
| **Stealth** | Guard vision cones, light, crouch, distance, movement. Suspicion meter ? then !. Noise radii for running, gunfire, breaking glass, bodies falling. Guards investigate, search, call others, hit alarm panels. Found bodies (dead or unconscious) raise alert. Carl can carry bodies and hide them. |
| **Security** | Cameras (sweeping cones), laser tripwires, turrets, alarm panels, keypads, card readers, security computers that turn cameras/turrets off or onto the guards. |
| **Locks** | Doors and lockers have strength. Lockpicks (doors) and multitools (electronics) are consumables; skill = fewer used. Keys and keycards. Keypad codes found in the world. Breakable doors: explosives or enough damage. |
| **Hacking** | Every computer has accounts. Logins found in emails, datacubes, conversations; or hack with Computer skill: a timed intrusion where the trace bar fills while you work. Hacked accounts read mail, open doors, cameras, turrets. |
| **Weapons** | 18 weapons with ammo types and mods (accuracy, clip, range, reload, recoil, laser, scope, silencer). Nonlethal path the whole game: baton, riot prod, tranq darts, gas, Carl's smoke. |
| **Augmentations** | DX's slot-choice system: each canister offers two augs for one body slot, upgrade canisters raise levels 1-4, bioelectric energy drains, biocells refill. F1-F9 toggle. |
| **Skills** | DX's 11 + Carl's own: Computer, Electronics, Environmental, Lockpicking, Medicine, Swimming, Weapons: Pistol, Rifle, Heavy, Low-Tech, Demolition, and **DENIAL** *(new)* — talk your way past people by being so obviously, insistently human. Points from objectives, exploration and secrets. |
| **Inventory** | DX's grid: items have sizes. Belt slots 1-0. Drop, use, equip, combine (mods onto weapons). |
| **Conversations** | Portrait dialogue, branching choices, skill/aug/flag-gated options, consequences that echo hubs later. Eavesdropped barks everywhere. |
| **Reading** | Every computer has mail. Datacubes, newspapers, books. JB Garfield's serialized noir paperback *THE BIG LITTER* is the Jacob's Shadow of this world, one chapter per hub. |
| **Economy** | Credits (P$, Pretend Dollars). Shops, bribes, the smuggler, the quartermaster. |
| **Screens** | Inventory, Health, Augmentations, Skills, Goals/Notes, Images, Conversations log, Chat log. |
| **Saves** | 8 slots + quicksave/quickload. Disk swap cards between hubs. |

## 4. Factions *(all new for this cart)*

- **FATCO** — the Fascism Inc. Anti-Terrorist Coalition. Linda's corporate security wearing a public-service badge. HQ in the back offices of the Mall of the Future. Issues agents the surname **Denton** ("the Denton program").
- **THE P.P.F.** — the Prop Pills Front. Rebels who stole the recalled Prop Pills and give them to the Buffered. The NSF.
- **MALLJESTIC 12** — the twelve seats on Linda's private board. MJ12.
- **THE SPOOKY ORDER** — the stage magicians who ran the world from the green room for a century until Linda bought the theater. The Illuminati. Spooky Ghost wants his seat back.
- **FREE CHAT** — Takahashi's Akihabara collective. Turn it off, go outside. Tracer Tong's line.
- **THE MEN IN WHITE SUITS** — the bible's own fear made into Malljestic's agents. DX's MIBs.

## 5. The plague

**THE BUFFERING** *(new)*: people slow, stutter, freeze mid-sentence like a lagging stream, then stop. The only thing that cures it is **Prop Pills**, the Pretend Co. product that got recalled for being *more effective than placebo* (the bible's actual joke, now the Ambrosia plot). Pretend Co. didn't recall them because they were fake. It recalled them because they worked, and a cure you can hoard is worth more than one you sell.

## 6. Cast mapping

| Deus Ex | Here | Notes |
|---|---|---|
| JC Denton | **CARL "DENTON"** | Denton is the program's surname. FATCO's ID says SPECIES: HUMAN; he loves that card more than anything he owns. |
| Paul Denton | **PILOT X (DENTON)** | The senior Denton. Knows everything, won't say: spoilers. Calls Carl "little brother" and never confirms anything. Defects to the P.P.F. Survives the motel raid only if Carl stays and fights. |
| Alex Jacobson | **YOKO** | Ops and infolink. Helps Carl past FATCO's own security after he defects. Later becomes HELIOS. |
| Joseph Manderley | **DIRECTOR FACE** (New Face) | The Face Carl isn't friends with yet. Remembers freeing Carl, though it was Old Face who did. Carl can make him admit it. |
| Daedalus | **OLD FACE** | The voice that freed Carl from the facility. Does it again from a detention cell. |
| Icarus | **ICARUS** — Linda's network | |
| Helios | **YOKO // HELIOS** | Old Face and Icarus merge through Yoko. "Helping you doesn't mean doing what you say." |
| Bob Page | **CEO LINDA** | Chair of Malljestic 12. Wants to merge with the network and be the last CEO. The woman under it didn't want an empire; she got one. |
| Gunther Hermann | **HU-MAN** | The focus-tested normal-human Carl. Mech-augged, resents the original. Killphrase: "BE YOURSELF." |
| Anna Navarre | **ROBO MALL COP** | Mech-aug enforcer, issues citations while shooting. Killphrase: "CITATION DISMISSED." |
| Walton Simons | **MR. WHITE** *(new)* | Head of the Men in White Suits. |
| Smuggler / Underworld Tavern | **JB GARFIELD** at **THE LITTER BOX** | Bar, information, contraband, noir narration. Author of THE BIG LITTER. |
| Tracer Tong | **TAKAHASHI** | Akihabara hacker-streamer. Removes the killswitch. Wants the Dark Age. |
| Maggie Chow | **IDOL LINDA** *(new)* | A second Linda: Akihabara's pop idol face of Gatebox. |
| Morgan Everett | **SPOOKY GHOST** | Lounge-singer who thinks he's James Bond, runs the Spooky Order from the Spooky Sands casino. |
| Morpheus | **DYSLEXIO** | Old Face in a Magneto helmet, sealed in a jukebox under the casino. Sincere, Magneto cadence, HOMO BASIC. No misspelling gags. |
| Lebedev | **DOC PROPER** *(new)* | The pharmacist who proved Prop Pills work. Founder of the P.P.F. Kill or spare. |
| Gary Savage | **DR. DAMM** *(new)* | Hoover Dam engineer building the cure press. |
| The Universal Constructor | **THE PROP PRESS** | Under the drowned town of St. Thomas in Lake Mead. |
| Area 51 | **BELOW NEVADA** | The facility. |
| Dark Age reason | **PEE KID** | The potential generator at the bottom of the facility powers the network. Letting the kid go to the bathroom turns off the world. |
| TP | gray TP product placement only | TP stays outside the lore. |

## 7. Hubs (10, about the size of Deus Ex)

**DISK 1 — ABOVE**
1. **MALL ISLAND** — P.P.F. seized the STATUE OF LINDA-TY. Docks, parking lot with the A.S.S. (Carl's home base), statue interior. First op: get the P.P.F. commander. Kill or knock out.
2. **FATCO HQ** — briefing, Yoko, HU-MAN, Robo Mall Cop, quartermaster, medbay. Revisited three times and changes each time.
3. **THE LOT** — the shanty city in the mall's endless parking lot. Subway hostages, the Lot Motel, JB's Litter Box, the P.P.F.'s pirate transmitter, sewers.
4. **PRETEND AIR** — freight airfield, hangars, the crashed Pretend Co. blimp where Doc Proper hides.

**DISK 2 — INSIDE**
5. **THE LOT, NIGHT** — Pilot X's side revealed; the killswitch; the motel raid; send the P.P.F. signal; ambush.
6. **DETENTION** — Carl wakes in a cell under the mall. Old Face on the speaker. Escape through FATCO HQ in revolt. The A.S.S. hangar. Director Face.

**DISK 3 — ACROSS**
7. **AKIHABARA** — Takahashi's junk lab, the Gatebox tower, Red Chat vs. the Lurkers and the DRAGON'S BONG, Idol Linda, canals.
8. **LAS VEGAS** — the flood tunnels where people live, the Strip at night, the Spooky Sands, Ghost's lounge, Dyslexio's jukebox, the Chapel of Love full of Malljestic gold.

**DISK 4 — BELOW**
9. **HOOVER DAM / ST. THOMAS** — the dam, Dr. Damm, the drowned town, the Prop Press.
10. **BELOW NEVADA** — the surface hangars, the facility Carl escaped (a room he half remembers; records redacted), the generator, the core.

**DISK 5** — endings, credits, the manual, the chat log.

## 8. Endings

1. **DARK AGE — "TURN OFF THE STREAM."** Let the kid go. The network dies. Takahashi's world.
2. **HELIOS — "BECOME THE STREAM."** Merge with Yoko. Carl becomes everybody's infolink and argues with them forever, gently.
3. **BACKSTAGE — "THE SPOOKY ORDER."** Kill Linda's link, hand the world back to Ghost and the magicians.
4. **ABOVE** *(Carl's own)* — refuse all three. Fix the A.S.S. (warp parts hidden across the game) and go up, carrying a transit slip that says STILL IN TRANSIT. Does not say to where.

## 9. Files

`dx/` — `x68.js` `fm.js` (engine copies), `dxcore.js` (input, mouse, constants), `dxart.js` (tiles, sprites, icons), `dxworld.js` (maps, light, LOS, render), `dxactor.js` (player, AI, combat), `dxitems.js` (items, weapons, inventory), `dxaugs.js` (augs, skills), `dxui.js` (HUD, screens, computers, keypads, shops), `dxconv.js` (conversations, barks, chat), `dxmain.js` (boot, title, saves, flow), `dxhub*.js` (one per hub: maps, people, words). Tools: `tools/dxvm.js` (headless), `tools/dxplay.js` (bot), `tools/dxreach.js` (reachability), `tools/dxshot.js`.

## 10. Status

See bottom of this file; updated as built.

### Status (2026-10-13)
Built: all 10 hubs (29 maps), 4 endings, engine (light/LOS/stealth AI/cameras/turrets/hacking/keypads/augs/skills/grid inventory/saves), chat infolink, blackjack.
Verified: `node tools/dxcheck.js` (maps), `node tools/dxplay.js` (+ `ENDING=dark|helios|backstage|above`, `POLICY=cold`) all pass; real Chromium `tools/dxbrowser.js` passes (2.5 ms/frame).
Portraits: `node tools/dxgen.js` (Codex) then `python tools/dxpack.py` -> dx/dximg.js; procedural fallbacks fill any missing.
Uncommitted. Not yet in README/HANDOFF. No human playtest yet (balance, stealth feel).
