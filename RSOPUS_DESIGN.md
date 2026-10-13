# ROMANCING STREAM: THE TEN CARTRIDGES (`rsopus/`)

A Romancing SaGa (1992) clone for the HYPER-32, cast entirely from the stream. Out of continuity, like the gaiden carts: everybody shares one world, and everybody is the hero of their own version of it. References: the Super Famicom Japanese guidebook and the Time Weaver art book (repo root PDFs).

**The look: sprites on hand-painted renders.** Every backdrop is painted at runtime by a small watercolor model (`rspaint.js`): warm paper with fibers, transparent washes that multiply into each other, pigment pooled at wet edges, granulation, masking fluid (reserved paper) for buildings, sepia pen lines, white gouache highlights, then ordered-dithered into the 9-bit palette the way the HYPER-32 prerenders everything. Characters are 2D cel-shaded rigs (`rsrig.js`, `rscast.js`, `rsmon.js`) outlined in sepia ink to sit on the paper. Portraits are painted from the rigs. The UI is parchment.

## The frame
Long ago the TEN CARTRIDGES (the ten Pretend Co. games that never came out) sealed THE CURSE inside THE OLD STREAM. They got scattered; the things the Curse touched hold them. Three servants keep the road shut: the WHITE SUIT DIRECTOR, GENERAL RED, and DYSLEXIO. (New lore for this cart; it is a gaiden.)

## SaGa rules kept
- **Free scenario, eight origins.** Choose CARL, CEO LINDA, SPOOKY GHOST, NEW FACE, YOKO, JB GARFIELD, PEE KID or PILOT X. Each opens with a full chapter: two setpiece fights, a lead, a first job on the journal, and two extra places on the map; after that the world is open.
- **Two ranks, two clocks.** The BATTLE RANK rises with every fight (won or fled). The EVENT RANK rises with deeds: jobs, story, cartridges. Quests open, change and expire on both. COURTROOM 88 adjourns at BR 40, the MIRROR GARDEN closes at BR 46, the ROOKERY phone number goes dead at BR 26; their cartridges are lost with them.
- **The map is a list of places**, painted on parchment, six lands on one sheet. Places appear when a pub tells you about them (RUMORS in `rsdata.js`), when a job points at them, or when a boat can reach them.
- **Ships.** Eight ports on four fare routes. Fix Carl's ship (a job in the LOT 9 pub, or Carl's own personal event) and the A.S.S. sails every route free, forever. Crossings can be interrupted by things that follow the wake.
- **No experience levels.** Ten weapon skills (SWORD, FENCING, CLUB, AXE, GUN, STAFF, SLING, BOW, MIC, MARTIAL), six techniques each, learned at weapon levels. HP grows after fights that were big for you; WP/JP grow with skill and school levels.
- **Eight spell schools** bought in seven school towns: STATIC, CHAT, SIGIL, MANDOLIN, GATE, DEEP, LIVE, TAPE. Opposed pairs refuse to share a head: LIVE hates TAPE, STATIC hates DEEP. Buy three spells of a school and you are a MEMBER: the top spell unlocks and everything gets cheaper.
- **Formations.** Five, learned by deed: front rows deal and take melee; back rows are safer and weaker in melee (ranged weapons don't care). BUS QUEUE lines everyone up; PYRAMID SCHEME puts one hero up front and buffs back-row spells; COUCH is everyone in back; FREE FORM alternates and crits more.
- **Status effects.** Poison (ticks every round, walks out with you), sleep (chance to wake on hit), charm (you attack your friends), stone (halve damage taken, 1.3x damage given, needs SOLVENT after the fight), stun. Cures: PICKLE JUICE, COFFEE, HAND MIRROR, SOLVENT, the CLEANSE spell.
- **Elemental weaknesses.** Every family has an element and a weakness: 1.5x into the weak spot, 0.7x into their own. Techniques and spells carry elements.
- **Rank-scaled drops.** Every family drops from a four-step table; the rank picks the step. Chests have three tiers by battle rank.
- **Combined attacks.** Ten pairs (CARL+DRIVER: SPECIAL DELIVERY...). Both in the party and standing: the option appears once a fight.
- **Equipment: six armor slots** (head, body, hands, feet, shield, extra) plus weapons. The bag holds nine of anything; the surplus auto-stashes. Every inn and shop counter keeps THE STASH.
- **Guilds and titles.** The FIXERS' GUILD in LOST & FOUND: join as a SNITCH, do guild jobs, rise to FIXER, then CLOSER (each rank discounts shops). School MEMBER. The board CERTIFIED title, the depot ROADIE. Titles show on the status screen and change what shops charge.
- **The Fatestones are the cartridges.** Ten dungeons each hold one, behind a guardian (a true-form monster at the last door) and its boss. Each cartridge hums a passive while carried (NIGHT OF THE MALL discounts shops 10%, ANOTHER BOOGALOO adds evade, THE END empowers spells...). The final fight needs only the three servants beaten; each cartridge you bring weakens THE CURSE by 4.5%.
- **The world does not wait, and it remembers.** Pub talk changes when bosses fall; shopkeepers restock at ER 8; the ending counts your battles, deeds, jobs and cartridges, and every party member gets an epilogue card that reflects what they did (personal events settled, recruit stories finished).

## The map (six lands, fifteen towns, twenty-six dungeons and fields)
THE WEST SHORES: LOT 9 (port) · MALL OF THE FUTURE · PUDDLE PARK · GATE FRONT · LASAGNA CITY (port) · DESERT BUS DEPOT · THE BADLANDS · THE GENERATOR · THE GNERATOR · THE RED GATE · THE FOOD COURT DEPTHS · LASAGNA WORKS · THE FOOD COURT FREEZER · THE SERVER PYRE · THE ENDLESS ROAD · THE OLD STREAM (center of the world)
THE EAST SHORES: THE STARLITE LOUNGE · MANDOLIN (port) · THE WIDE WEB · THE ALIMONY COURTS (port) · COURTROOM 88 · THE ROOKERY · THE MIRROR GARDEN
THE SOUTH ISLES: THE STUDIO · LOST & FOUND (port, guild) · THE ARCHIVE · THE WHITE ROOM · THE DRYER DEPTHS · THE LOST & FOUNDRY
THE NORTH REACHES: REWIND CITY (port, TAPE school) · LIVEHOUSE GULCH (LIVE school) · THE LONG STATIC · APARTMENT 4 · THE REWIND VAULTS · THE CHORUS HALLS
THE BRINE: BRINEPORT (port, DEEP school) · WRECK SHALLOWS · THE PICKLE CELLARS · THE BRINE TRENCH
THE GATE HINTERLAND: GATE CITY (GATE school) · THE GATE SPIRE

| dungeon | boss | cartridge |
|---|---|---|
| THE GENERATOR | POTENTIAL GENERATOR | ABOVE AND BELOW NEVADA |
| FOOD COURT DEPTHS | AUNT PRETZEL | NIGHT OF THE MALL |
| COURTROOM 88 (expires BR 40) | SPOOKY ALIMONY | LIVE FROM BEYOND |
| THE ARCHIVE | BACKUP FACE | STILL HERE |
| MIRROR GARDEN (expires BR 46) | EVIL YOKO | ANOTHER BOOGALOO |
| LASAGNA WORKS | BIG LASAGNA | SAVE THE WORLD |
| APARTMENT 4 | MIMI (copies your last move) | PEE KID 3 |
| THE WHITE ROOM (BR 16) | WHITE SUIT DIRECTOR | RETURN TO SENDER |
| THE RED GATE | GENERAL RED | RESIDENT HUMAN |
| THE GNERATOR (BR 24) | DYSLEXIO | THE END |
| THE ENDLESS ROAD | THE BUS | (no cartridge; it holds the schedule) |
| THE REWIND VAULTS | THE LATE FEE | - |
| THE PICKLE CELLARS | MOTHER PICKLE | - |
| THE DRYER DEPTHS | THE DRYER LORD | - |
| THE FOOD COURT FREEZER | THE WALK-IN | - |
| THE ROOKERY | THE PIZZA PIGEON | - |
| THE SERVER PYRE | THE PYRE | - |
| THE GATE SPIRE | THE GATEKEEPER | - |
| THE LOST & FOUNDRY | THE FINDER | - |
| THE CHORUS HALLS | THE CHORUS | - |
| THE BRINE TRENCH | SARGASSO | - |
| THE OLD STREAM | THE CURSE, then THE CURSE, LIVE | - |

## Quests (52: ask around at any pub)
Eight opening chapters (hero-locked) · THE HUM, THE STAIRS, THE DOCKET, THE RESTORE, THE OTHER YOKO, THE LAYER, THE VOICE, THE OTHER RED.
Fetch: A LID FOR EVERY POT, DRY FEET, A RING FOR THE EMPRESS, THE LUTHIER, ONE GOOD MIC, OPEN MIC OPEN ROAD, THE FROG ATE IT, A BLADE FOR THE WALL, PLEASE REWIND, ARCHIVE DUST, THE BRINE LEDGER, EMPIRE PAPERWORK, FILE IN TIME, A SHIP IN A PARKING LOT.
Kill: SPAM DETAIL, ESCALATOR RATS, THE WISP STRIKE, NICE COMMENTS, PAYROLL, GULL WASH, POTENTIAL SPONSOR, THE PATROL, TAPEWORMS, FEEDBACK, THE BRINE LEDGER, CONTEMPT OF COURT, THE FILING QUEUE, DRY CLEANING.
Visit: THE HUM, THE COLD INVENTORY, PAPERS FROM ANOTHER TOWN, THE RESUME, SPELL CHECK, DO NOT ANSWER, WHAT THE SPIRE SAYS, WHAT THE NEIGHBORS KEEP, ENDLESS HOURS, SMOKE GETS IN YOUR EYES, THE PHONE NUMBER, THE TRENCH MAP.
Boss jobs: NINE PEOPLE ONE LAYER (garf), THE APPEAL (ghost), THE ROOKERY, THE LATE FEE, MOTHER PICKLE, THE WALK-IN, THE CHORUS, THE GARDEN OF WRECKS, THE FOUNDRY, THE SPIRE, THE SCHEDULE, THE DRYER DEPTHS, THE SERVER PYRE, THE LEFT SOCK (guild; exclusive with DRY CLEANING and vice versa).
Gold/title: THE WHITELIST (CERTIFIED), THE CHARITY KEEPS THE ROAD (ROADIE + BUS PASS).

## New lore (this cart only; the gaiden shelf)
The six lands; the A.S.S. (Carl's ship; fixed, it sails the water routes free — CREW title); the ALIMONY COURTS town (a whole town of paperwork; the Wisp Strike); REWIND CITY and LIVEHOUSE GULCH (two towns that hate each other over tape; the LATE FEE accrued since 1998; the Room with no doors follows THE BUSKER); THE LONG STATIC (white-noise country; STATIC SHEEP); BRINEPORT and MOTHER PICKLE (the cellars want to preserve you); LOST & FOUND (everything lost gets filed by size, then by sadness; THE FINDER runs the desk; the Fixers' Guild); THE DRYER DEPTHS (socks go in, wrath comes out; THE DRYER LORD); the WALK-IN freezer that waited; the PIZZA PIGEON answering the request line; the SERVER PYRE (a fire that learned patience and kept working); THE GATE SPIRE (whispers coordinates; THE GATEKEEPER sells keys to everywhere); THE CHORUS (every song one beat late; it cuts the sad part); SARGASSO's garden of wrecks; THE ENDLESS ROAD and THE BUS (eleven years on schedule; the charity keeps the road); the ten cartridge legends (the pub journal retells each one); THE MEDIUM's chord (ten cartridges together would be a chord; the Curse hates the chord); the eight FINAL CHAPTERS (one monologue each, at the mouth of the Old Stream); every recruit's small story (THE INTERN's review, THE FINDER's finished sentence, THE DECKHAND's brine recipes...). The EMPRESS of MANDOLIN, the INTERN, the DISPATCHER, the HARBORMASTER, the LUTHIER, the BAKER are new townsfolk. Still open on purpose: Carl's real name, Carl's parents, Linda's human name.

## Controls
Arrows move, Z = A (confirm / talk / open), X = B (sail, on the map at a port), C cancels, Enter = START (menu: status, equip, items, order, formation, quests, cartridges, save). In town press UP at a door. Save from the menu (not inside dungeons) or at an inn. In battle: pick a command, then a target; C backs out.

## Files
`rsrig.js` (rig renderer) · `rscast.js` (heroes, extras, townsfolk, poses) · `rsmon.js` (families, bosses, guardians) · `rspaint.js` (watercolor painter, themes, towns, rooms, battle fields, sea, world map, portraits) · `rsdata.js` (techniques, spells, items, cast numbers, places, rumors, origins, formations, ships, combos) · `rsworld.js` (state, parchment UI, map, towns, shops, stash, ships, dungeons, guardians, menu) · `rsbattle.js` (formations, elements, statuses, combos, drops) · `rsstory.js` (origins, personal events, recruit events, town talk, bosses, final chapters, endings) · `rsquest.js` (quests, the guild, cartridge legends, the journal) · `rsmain.js` (music, portraits, boot, title, hero select).

## Tools
`node tools/rsoshot.js` screenshots of 36 screens (title, select, map, 7 towns, dungeons, battles, sea, sail, guild, jobs, journal, formation, stash, guardian...). `node tools/rsocast.js` / `rsomon.js` / `rsopaint.js` sprite and painting sheets. `node tools/rsoplay.js` bot (HERO, GOALS=place,place, FRAMES, SHOTS=1, START=js). `node tools/rsobot.js` blind journey bot (HERO, FRAMES, SHOTS, GOALS — walks, talks, fights, takes jobs, sails; use for soak tests). `node tools/rsosim.js` balance sim (PARTY, WARM, BOSSES, CARTS, GEAR; ERLY=1 for the early-game economy check, EHERO=carl,peekid). `node tools/rsoreach.js` reachability: 374 static checks (every quest, item, family, place, ending reachable; expiries openable before they expire). `node tools/rsoprobe.js` 25 feature probes (formations, ship, guild, quests, statuses, guardians, migration, personal/recruit events, bake-everything). `node tools/pngpeek.js file.png [cols]` ASCII preview of a screenshot.

## Test log (headless; nothing checked in real Chrome yet)
- `rsoshot.js` all 36 screens render without errors (2026-10-05).
- `rsoprobe.js` 25/25 pass: formations and back-row math, ship unlock + sail + sea painting + port routes, guild join/rank, kill/fetch/ship quest turn-ins (items consumed, gold paid, ER up), opposed school lock, poison battle resolves, guardian blocks and clears, stash, journal, v1→v2 save migration, carl PE1 grants the free ship, intern recruit event, all 15 towns + 26 dungeon themes + 23 bosses + 20 families × 4 ranks bake.
- `rsoreach.js` 374/374: every town/dungeon opens, every quest completable (kill families encountered, fetch items obtainable), all ten cartridge legends point at the boss that holds them, both expiring cartridges reachable before expiry, all ports reachable from LOT 9 through the route graph, every hero has epilogue + final chapter, every recruit eventable and recruitable, every school taught, every place's music track exists.
- `rsosim.js` full boss ladder: all 23 bosses winnable by a WARM=30 party (several at 1 HP — the intended SaGa texture). ERLY=1: carl and peekid duos survive the early game solvent (9W/1L, gold positive).
- Origin smoke: all 8 origin chapters complete headless with a smart-but-simple fighter (ghost and face setpieces reduced from 2 tutorial foes to 1 after solo-hero unwinnability was found; the fiction covers it: THE MEDIUM holds the door).
- Journey bot: long blind runs walk, fight, die, reload, take jobs, sail; no game errors over 120k frames.
- NOT verified: real Chrome (fonts, audio, save-slot persistence, performance of paint cache over hours). Please test in the browser and report.