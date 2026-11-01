# JB GARFIELD: THE MISSING ORIGINAL

A HYPER-32 survival horror cart, (C)2003 PRETEND CO., in `mo/`. Resident Evil structure (fixed cameras, tank controls, door transitions, scarce ammo, an item locker, saving costs a consumable, key-item locks), Silent Hill story (the building is about you, the ending is about what you did). Built on the CARL 3 engine: `c3gfx` prerendered backdrops + live low-poly models, `c3world` scenes/cameras/walkability, `c3ui` dialog plates. Nothing in `carl3/` is edited; `mo/` overrides from its own files.

Follows `JB_GARFIELD_CHARACTER_BIBLE.md`. **New lore, labeled as such:** the Meridian Continuity Center, Otis and Ruby Keel, Margaret "Maggie" Keel, Subject 41, the double, the Composite, the Wednesday ward and its Recall Theater, Dale the projectionist, the director's journal (41's master was a donated recording, source redacted). Nothing here settles how JB survived Face, or which Face the facility recorded. The game never answers "whose memory"; it only asks.

## The case

Sunday, 11:52 PM. RUBY KEEL hires JB: her uncle OTIS, the caretaker who stayed on alone at the closed MERIDIAN CONTINUITY CENTER ("WE KEEP YOU."), went quiet nine days ago, Friday before last. JB drives out. It becomes Monday on the way. He doesn't work Mondays. He makes an exception.

Inside, every clock says FRIDAY 11:14 PM. The front door scanner greets him: **WELCOME BACK, SUBJECT 41.**

The incident the records and Otis describe (the recording's donor and JB's origin remain unresolved): the stacks were failing and corrupting stored backups. Otis, alone, ran the file labeled JB GARFIELD because it was "a detective" and he wanted help. The run came out wrong: a corrupted JB (THE DOUBLE) signed the visitor book in JB's handwriting at 11:14, took Otis's card, and walked him down to the Monday ward "to find the original." The vault sealed with Otis inside. The real JB was on live television at 11:14 that Friday. Otis taped it.

The evidence implicates JB in order, and each act lowers the ceiling on his composure:

| Act | Voice | Evidence against him | Composure cap |
|---|---|---|---|
| I THE CASE | confident | the sign-in book (his hand, 11:14 PM, nine days ago); the 1989 intake interview tape in his voice; the empty SUBJECT 41 MASTER slot | 100 |
| II THE SUITES | strained | security footage of a fedora walking Otis toward the lift; the suites rebuild memories he knows; a recorded diner visitor has his voice and asks for the original; the facility prints him a subject card | 75 |
| III MONDAY | plain | there is more than one of him; Otis says "you came back" | 50 |

The exoneration is optional. The powered lounge VCR shows FRI 11:14 PM LIVE; Yoko independently checks the Channel 8 producer's continuity sheet. In CASE NOTES, establish the visitor's route using the visitor log + control camera record, then establish the simultaneous live appearance using the VHS + station sheet. Otis's last log corroborates the incident later. Present the tested alibi to Otis; if deferred, he can hear it on a return visit. Watching the VHS alone no longer clears JB; rescue remains possible without proof.

## Systems

- **Difficulty.** At NEW GAME: HOW DO YOU TAKE YOUR NOIR? WITH CREAM (easy: half damage taken, weaker backups, more rounds), BLACK (normal), MONDAY (hard: 1.5x damage, tougher backups, fewer rounds).
- **Controls.** Tank by default (up/down walk, left/right turn, X run, down+X quick turn); MODERN (camera-relative) in OPTIONS. Hold C to aim the revolver (auto-targets the nearest backup in front), Z fires; with C held, X swings the sap (no ammo). Z examines/opens. ENTER: inventory. SHIFT: map; left/right browse floors and Z/C/Shift returns. Only visited rooms or rooms on the lobby directory appear. The current lead has a gold edge; the map also reports Friday, lift and boiler feeds.
- **Health.** 12 HP, shown only as an ECG line in the inventory: FINE / CAUTION (slower) / DANGER (limp, heartbeat).
- **Composure.** 0..cap. Damage, sightings and evidence lower it; coffee and safe rooms restore it. Holding C on the same target for 60 active frames settles rushed revolver accuracy (45-98% close up) toward at least 85% close up; distance still costs accuracy. Composure also chooses **the narration register**: every examine line exists three ways (confident / strained / plain). In the fidelity suites the confident voice lies to protect him; the documents on screen are always true. *Trust the page, not the cat.* At 0 his orange drains to gray.
- **Inventory.** Eight supply slots for ammunition, healing, coffee, tapes, and the shotgun. Keys, cards, film cans, and reels use a separate pouch and always fit. In ITEMS, X switches SUPPLIES / KEY-ITEM POUCH; arrows select across pages, Z uses/examines, C returns. The shared safe-room LOCKER can store either kind; retrieving keys works even with eight supplies. Older mixed-list backups retain every item, including any existing supply overflow.
- **Saving.** The BACKUP TERMINAL consumes a BLANK TAPE only after browser storage accepts the backup. CONTINUE CASE resumes that checkpoint without adding a restore. Restoring after death increments and persists the restore count on the same checkpoint, and clears attack/reload state. The restored world stays paused until the fade finishes. SUSPEND AND QUIT in the pause menu writes a separate, single-use session, with no tape, backup, or restore cost. RESUME SUSPENDED CASE keeps position, health, inventory, reloads, live enemies, pursuit, and theater/boss progress; it consumes that session after successful reconstruction. Death can restore only the terminal checkpoint. Choosing CONTINUE CASE while a suspend exists confirms discarding suspended progress. Failed storage keeps the live case and terminal backup; new games and endings clear both saves.
- **Healing.** COLD LASAGNA (+4); the lounge microwave (power) heats every cold one into HOT LASAGNA (+10). COFFEE (+35 composure).
- **Weapons.** The revolver (6, aim roll set by composure) and, from 2F security, a pump SHOTGUN (4 shells, no aim roll, a cone: 5 damage up close, 3 mid, 1 far, big stagger). USE the shotgun in ITEMS to switch; shells and .38 rounds are separate. The sap (C+X) never runs out.
- **Enemies (corrupted backups).** DRIFTER (slow, telegraphed swipe, 5 HP), CRAWLER (no legs, low and quick, 3 HP), LOOP (walks one remembered path forever; can't be killed, only staggered; shoves), THE DOUBLE (fast, 8 HP, retreats; boss 16 HP), THE AUDIENCE (2F set piece: six of them in the dark, two at a time), THE COMPOSITE (vault boss; three heads, sweeping telegraphed lanes).
- **The stalker.** After Suite A or B, the first gallery appearance is authored and explains escape/repel options. Random arrivals wait until that introduction. Non-safe doors can then bring him through behind you; if he was in the room you left, he follows. Safe rooms and the service passage exclude pursuit. Four damage drives him off for a while; left alone, he loses interest after about 40 seconds. Killed backups stay "deleted"; the count is in the ending.
- **Power lines.** The generator carries two lines at most, and the STACKS line alone trips it. First time: exactly Otis's note (FRIDAY + LIFT). In Act III you re-route for the boiler (BOILER + LIFT), which takes the FRIDAY line off: the Friday ward locks and the lounge's TV, microwave and coffee go dark. Watch the tape before you re-route, or route back.
- **Case notes.** ENTER -> CASE NOTES offers several leads, source-backed theory tests, observations/tested conclusions, and requested help in three layers: a question, the relevant source, then an answer. KEEP INVESTIGATING or C stops at either layer; help does not complete puzzles or establish evidence. Static on 2F permits the same help from JB's notes. Two distinct records must support a correct theory. The four conclusions cover the visitor route, live alibi, missing kitchen action, and the diner visitor's claim about the original. Wrong hypotheses expose a contradiction and permit revision; proof earns 15 composure once. The alibi changes Otis's conversation. REVIEW MEMORY ANSWERS revisits completed suites; READ DRAFT REPORT lists current findings.
- **Current lead.** FOLLOW LEADS starts with the next main question. Equipment, the client lookup, Maggie, and the alibi remain optional leads; the rescue advances without collecting them. Stored required keys/cards/cans direct the player to a shared locker on the current floor. Friday/lift power failures direct the player to the generator before a blocked return route. Maggie's storage location requires her client file; the VCR lead follows Otis's camp log or an independently watched tape.
- **Friday relay and service route.** Control's local relay chooses gallery lights or the service shutter. Opening service darkens the gallery and connects control directly to the lounge. Its Loop porter can be sent to the central tea hatch by ringing once, as the shift notice explains; two rings resume the round. After proving and reconstructing Suite B, its recorded tea round also sends the porter to the hatch. Both passage exits stay usable if the main supply goes off. The map reports known relay and porter state.
- **Memory suites.** Suite B has a damaged recording and a physical cupboard trace; prove the missing action, then perform the tea routine to uncover the desk key. Suite C plays the recorded visitor's account and asks what the director's definition of a master supports. It establishes a recording and destination without certifying JB's origin. Completed suites from older backups remain completed.
- **Memory answers.** Current suite answers, including revisions, determine the counts in the results. Yoko, Otis, and the closing narration acknowledge mine/Face's/unknown/mixed answers; none is a rewarded correct origin. A revision changes the claim, not the evidence, and survives terminal loading. Completed older suites with no saved answer can be answered from CASE NOTES.
- **Maggie's appointment.** Otis's early log points to an optional Monday card on the lounge wall, available without power. It connects to Records and her cold-storage reel. Returning it lets him take the weekly appointment home; deferring, carrying, or leaving it in the shared locker gets a distinct report/epilogue. Erasing Subject 41 leaves that separate reel intact.
- **Case report.** A paged draft in CASE NOTES and final report before each serious ending distinguish tested findings, proof presented to Otis, memory claims, preserved audience, and the actual location of Maggie's reel. Neither certifies JB's origin or an unread donor record.
- **Recall Theater.** Dale's cue sheet explains a preservation route before the encounter. Hold Z without aiming for two uninterrupted seconds at the projector, stay alive while twelve active seconds of film run, then hold Z for two seconds at the far house-light switch. Release or damage resets the current work; menus stop the film timer. Fighting still clears the encounter. Surviving audience members return to visible seats, and the count persists into the reel decision and results without a rank penalty for combat.
- **Light.** Before the generator, the Thursday ward is dark (cold storage and service always are): each camera is prerendered twice (lit / unlit) and the flashlight composites the lit one in a cone ahead of JB.
- **Look.** Backdrops are filtered Sin City: gray, with reds and oranges kept. JB stays orange.

## The facility (map)

```
2F:   [RECORDS]   [RECALL THEATER]   [DIRECTOR]
          |              |               |
 [STAIRS]-[ WEDNESDAY WARD - RECALL ]------------[ROOF: antenna, CH 8 tower due west]
               |                 |
          [NURSES' STN]     [SECURITY: shotgun]

                 [SUITE A] [SUITE B] [SUITE C]
                      \       |       /
         [CONTROL]---[ FRIDAY GALLERY ]
                            |
[INTAKE]   [CONSULT]        |   [STAIRS] [ARCHIVE]
    \         /             |                |
  [TUESDAY HALL]-------[ LOBBY ]-------[THURSDAY HALL]--[GENERATOR]
                         |    |
                    [LOUNGE]  (LIFT: 3 cards)
                    [steps]       |
                              [COLD STORAGE: frozen until the boiler]
                                     |
     B:  [OTIS'S CAMP]--[MONDAY HALL]--[VAULT ANTECHAMBER]--[VAULT]
                                     |
                                 [BOILER]
```

## Puzzle chain (spoilers)

1. LOBBY plaque: EST. 1979. Otis's log 1 (intake): "door code's the year we opened." CONSULT keypad 1979.
2. CONSULT: THURSDAY KEY on the hook + the 1989 intake tape.
3. THURSDAY (dark): ARCHIVE has the MAIN FUSE, the breaker note, the empty SUBJECT 41 MASTER slot.
4. GENERATOR: fuse + breakers per Otis's note (FRIDAY ON, BOILER OFF, LIFT ON, STACKS OFF). Wrong = trip + a drifter. Power on: Thursday lit, Friday unlocked, microwave/coffee/VCR work. **Act II.**
5. CONTROL: security footage; director's desk is locked. Optional Friday relay opens the service route to the lounge at the cost of gallery lighting. Read the night round and ring once to clear the porter. Read the visitor log, watch the powered lounge tape, ask Yoko to check Channel 8, and test both conclusions in CASE NOTES.
6. SUITE A, THE OFFICE: three discrepancies against the polaroid (clock, hat, rain). Then the fourth wall: ring light, camera, ON AIR. Whose memory?
7. SUITE B, THE KITCHEN: compare the damaged table tape with the two-cup cupboard trace; test the missing action using those two sources. Rebuild TAP, CUPBOARD, KETTLE, DRAWER; a wrong physical order lets something out of the fridge. DESK KEY under the kettle → the director's desk in control: the STAIRWELL KEY and his memo (his card is in his office safe, 2F).
7a. 2F, THE WEDNESDAY WARD. The radio is static up here.
   - NURSES' STATION (safe room 3): the roster says security's code is the theater showtime, 7:30 → SECURITY keypad 1930.
   - SECURITY: the SHOTGUN, shells, film can B, and the guard log: Dale cut the orientation film into three cans (Records, this locker, the roof); "I keep my numbers in my films."
   - RECORDS: film can A; the lookup terminal (GARFIELD: donated master, source redacted; KEEL, MARGARET: kept 1986, cold storage, row 3; KEEL, OTIS: "not yet").
   - ROOF: film can C; the CH 8 tower's red light due west; aim the relay WEST → Yoko is back (Maggie, and "the first reel has the countdown").
   - RECALL THEATER: splice the cans by their leaders (ends match beginnings; only B has a countdown) B, A, C. Wrong order tears the film and one of the seated audience stands up. The film shows 19 / 79 / 41, then stalls before THE END. The lights die and the audience stands: six of them, two at a time. Follow Dale's cue sheet to restore the transport and house lights while avoiding them, or clear the room by force.
   - DIRECTOR'S OFFICE: the safe, 19-79-41 → DIRECTOR'S CARD, shells, the director's journal.
8. SUITE C, THE DINER: hear the recorded visitor's conversation with Otis. Check the date against control footage; question what "original" establishes using the diner account + director's memo. The tested conclusion gates completion. Otis: "You'll know the original when you see him. Monday ward."
9. All three: control prints the SUBJECT 41 CARD. Leaving: THE DOUBLE boss in the gallery, drops OTIS'S CARD. **Act III.**
10. LIFT: three cards. B: OTIS'S CAMP (safe room 2, log 4: the tape, and Otis hid the master clock's winding key "where it's coldest"). The vault opens "MONDAYS ONLY"; the clock has no key.
10a. COLD STORAGE is frozen shut. The BOILER has no power: back up the lift to the generator and re-route (BOILER + LIFT, FRIDAY off). Light the boiler: three valves, each feeds two gauges (A/B, B/C, C/A), all three in the green (from RED/LOW/LOW: valve 1 twice, valve 3 once).
10b. COLD STORAGE (dark, crawlers, a loop): the WINDING KEY at the back, and optionally MAGGIE's reel in row 3. Wind the clock, set it to MONDAY.
11. ANTECHAMBER: Otis, alive, in the quiet room. Present the tested alibi if you established it. Give him Maggie's reel if you found it (it changes the epilogue and the rank).
12. VAULT: THE COMPOSITE. Then the reel.

## Endings

- **ON THE RECORD**: Otis believes you (alibi presented), TAKE THE ORIGINAL. The voice comes back, earned.
- **THE COPY**: no alibi, TAKE THE ORIGINAL. Case solved, suspect not cleared. The voice stays plain.
- **ERASED**: ERASE THE ORIGINAL (either way). Every backup goes quiet. The office, rain, the hat on the rack. Someone keeps narrating.
- **CLOSED MONDAYS** (joke): at the car, before going in, call it a night three times.

Results screen: difficulty, time, backups made, restores, backups deleted, theater audience seated again, whose-memory answers, rank (S/A/B/C: the record ending, under two hours, six backups or fewer, no restores, Maggie home, harder noir).

## Files

- `mo/moart.js`: models (JB, drifter, loop, double, composite, Otis, Ruby), glitch drawing, Sin City filter, dark/lit composite, noir UI skin, SFX, music.
- `mo/morooms.js`: the original 18 rooms plus the Friday service passage.
- `mo/mowings.js`: 2F (stairs, Wednesday ward, records, nurses' station, security, Recall Theater, director's office, roof) and B1's boiler and cold storage: rooms, documents, puzzles, the audience, the full objective().
- `mo/mocore.js`: state, tank movement, aim/fire/sap, enemy AI, damage, inventory/locker/terminal, map, files, composure, door transitions, HUD.
- `mo/mostory.js`: examine lines (three registers), puzzles, suites, bosses, Yoko on the radio, objective(), endings.
- `mo/momain.js`: boot, title, continue/restore, results.
- Tools: `tools/movm.js` (headless loader), `tools/moguidance.js` (staged help, optional leads, storage/power return blockers and floor-map checks), `tools/moplay.js` (objective-routing bot, NEW GAME to each ending; COMBAT=1 fights for real, DIFF=0..2, MAGGIE=0 skips the side reel, PRESERVE=1 completes the screening with the usual campaign assistance), `tools/mofight.js` (gun, sap, shotgun, crawler, audience, stalker, double, composite), `tools/mootis.js` (memory revision, Otis/Maggie branches, report and ending checks), `tools/mosession.js` (pouch/capacity, legacy backups, live suspend/reload, cleanup and storage failures), `tools/modouble.js` (intake response, interruptions, live escape/boss routes and gallery framing), `tools/moframe.js` (which walkable spots each camera loses; TUNE=1 suggests aims), `tools/moshot.js` (screenshots).

## Friday expansion validation (9 October 2026)

The first expansion adds two tested conclusions, independent station corroboration, the service power choice, a physically redirected porter, and an authored pursuit introduction. The game now has 29 rooms. The service cameras frame all 645 sampled walkable positions, including full-body bounds. Suite A's prompt no longer supplies the hat answer, and the revealed-set camera/player position frames the detective and recording equipment.

Checks: both On the Record and The Copy complete; the interactable reachability check includes service; eight combat scenarios complete; Friday integration checks wrong sources, repeated-proof rewards, physical porter movement/return, walking the cleared route, safe-room escape, power changes, backup reloads, storage failure rollback, and restore counts. Real Chromium checks keyboard boot/movement, audio initialization, the new menus/route/routine, rendered notebook/reveal, and title Continue.

Campaign bots relocate JB and assist boss fights. Browser checks use controlled Friday state; no full human playthrough, resource-balance assessment, or listening/performance evaluation has been done. The 30–45 minute slice target remains unmeasured.

Run: `node tools/mofriday.js`, `node tools/morecall.js`, `node tools/mootis.js`, `node tools/mosession.js`, `node tools/modouble.js`, `node tools/moplay.js`, `ENDING=copy node tools/moplay.js`, `REACH=1 node tools/moplay.js`, `node tools/mofight.js all`. Browser check: `node tools/mofriday_browser.js` with an existing Playwright installation (set PLAYWRIGHT_PATH if it is outside the project). Screenshot outputs stay under ignored `tools/shots/`.

## Suites and screening validation (9 October 2026)

Suite B/C now require limited conclusions supported by two sources. The kitchen routine also redirects the service porter. Recall Theater can end by completing the screening; the surviving audience visibly sits down, remains preserved after loading, and is acknowledged before erasure and in the case report/results. The revised front camera frames the whole front aisle and house switch.

Focused checks in `tools/morecall.js` cover wrong answers/sources, one-time proof rewards, the physical kitchen/key and tea cue, diner completion, live work/release/damage interruption, paused film timing, restored encounters and partial preservation. A deterministic movement run uses actual tank-control updates with active enemies, no ammunition, and no position or health assistance after opening setup: all six audience members survive on easy/normal/hard; JB finishes with 9/6/3 HP. This demonstrates a feasible route for those spawns, not human balance or every random pattern.

`tools/mofriday_browser.js` additionally checks all four deductions, both new suites, held theater controls, pausing, screening renders, and saved progress through actual keyboard input in Chromium. Campaign and combat assistance remain as described above. `PRESERVE=1` selects the screening path in the campaign bot; it is not a full-game survival assessment.

## Otis, memory, and report validation (9 October 2026)

The optional lounge appointment develops Maggie before the reel is found. Revisited answers change later conversations and all three serious epilogues without changing rescue, proof, or rewards. The report distinguishes facts from claims and records proof withheld from Otis; he can receive it later. Maggie's reel can be returned, carried, stored in the locker, or left unrecovered, with each state reflected accurately through loading and the endings.

`tools/mootis.js` exercises the clue without power, optional leads, equal mechanical effects for all answers, revision counts, older saves, radio acknowledgments, rescue/proof/deferred presentation, all serious endings, one-time handover reward, real locker transfer/reload, and report wrapping. The expanded Chromium check uses actual keyboard menus for the appointment, memory revision, draft report, and reload. Assisted record/preserved-audience/Maggie and copy/combat/no-Maggie campaigns complete without reported errors; interactable reachability passes. These checks do not measure first-time human pacing, resource balance, or every conversation in a full browser campaign.

## Inventory and session validation (10 October 2026)

The supply list and key pouch share the existing saved inventory, so there is no destructive migration or new item bookkeeping. Capacity checks, world pickups, locker transfers, use/examine menus, and pagination all use the same division. The shotgun uses a supply slot. If safe-reward shells do not fit, the remainder stays beside the safe and survives revisits. Existing overfull backups retain their supplies and allow the player to put them away.

Suspend uses `mo_suspend` version 1, separate from `mo_save`. It captures the current room's mutable entities, body, timers and camera, then rebuilds behavior from the existing scene/enemy functions on resume; assets/functions are not copied into storage. The Double's factory is shared so its card-drop callback survives. Terminal restoration retains its existing room-reset behavior; suspension retains the current visit. Menus cannot suspend mid-dialogue or mid-cutscene. Resume does not award resources or alter rank counters.

`tools/mosession.js` checks full supplies plus every key, pouch pages, old/overfull backups, key retrieval and partial supply transfers, safe-reward overflow, tape/terminal separation, storage write/removal failure, malformed snapshots, single-use consumption, live foes and pursuit timers, theater audience/film state, both bosses and their completion callbacks, death fallback, and new-game/ending cleanup. The Chromium check exercises real supply use, pouch paging, pause/quit, reload and resume while preserving the independent terminal backup. Friday, suites, story, all eight combat scenarios, an assisted record/preservation campaign, and interaction reachability are rechecked. Human completion time, resource balance and broad camera behavior still need playtesting.

## Double recording validation (10 October 2026)

The gallery's INTAKE PLAYBACK panel uses the existing consultation recording (`tape1`). Control's `playback41` procedure teaches "Look at the light," sets `slateKnown`, and explains the limit of the observation. It needs the Friday supply and gallery-light relay setting. Activation runs live: a Double's `cueAt`, `cueTravel` (480-frame maximum approach), `cueHold` (180-frame wait), and `cueUsed` redirect that appearance without affecting other enemies or granting resources. Hits, retreat, or power loss interrupt attention. An active cue suppresses automatic following through a door and briefly delays random arrivals. The boss keeps its defeat/card/exit rules.

`doubleDistracted` records an actual response for the notebook and report; recognition does not certify an origin. The new entity fields pass through the existing version-1 suspend without a migration, with validation for the destination and remaining timers. A fresh resume retains the one-use limit. The middle gallery camera now frames full-body bounds across 576 sampled walkable spots, including the panel-to-lobby escape aisle.

`tools/modouble.js` covers gates, physical movement/wait/resumed pursuit, one-use and interruption limits, blocked-path timeout, ordinary enemies, resource/counter invariants, menus, malformed and fresh-runtime suspension, older checkpoints, and boss completion. Active tank-control checks use no ammunition, healing, or relocation after setup: first-encounter escape finishes at 12 HP on easy/normal/hard; the boss-panel approach from control finishes at 10/9/7 HP. Chromium reads the new procedure and original intake, activates the panel with Z, moves JB during playback, and verifies the visible wait. The existing story/session/combat checks, assisted record/preservation campaign and interaction reachability remain successful.

Remaining expansion: first-time human pacing/resource-balance passes. Deterministic routes and assisted campaigns do not establish full-game balance or runtime. See MO_EXPANSION_PLAN.md.

## Building camera and control validation (10 October 2026)

All 29 rooms now use authored views that keep JB's full-body bounds inside the frame across their selected regions. Narrow rooms use opposing corners; the archive and cold storage use aisle/row/gap views, and the generator and boiler cover the machinery's separate walkways. Existing camera IDs remain valid for suspended sessions. Suite A's `rev` override is limited to its actual close-up region. The boiler mesh is aligned with its existing solid rectangle, and the raised generator/boiler panels and Otis's clock have explicit collision rectangles.

Modern movement caches the current camera's horizontal forward/right axes in optional `CARL.moveAxes`/`moveInput` fields while the same direction remains held. A camera cut preserves that world direction; a release or input change adopts the current camera. Releasing during aim also clears it. Tank movement and room entry clear the cache. Version-1 suspend retains the fields and validates their numeric shape; older sessions without them remain valid. No shared-engine changes or dependencies are needed.

Run `node tools/mocoverage.js` for all-room framing and boundary checks, rendered depth checks through tall storage/machinery, and actual movement/fresh-suspend/legacy/invalid-state checks. Current coverage: 77,622 body samples, 155,042 camera selections, and 1,948 depth samples. `tools/mocams.js` now places JB at a walkable point belonging to each actual camera region; 88 reachable views were reviewed. Furniture can still partially occlude the body. Chromium also checks held movement across opposing cameras and release/repress through real keyboard events. Story, session, Double, combat, assisted preservation and reachability checks remain successful. Human pacing, resource balance, listening and hardware performance still need a full playthrough.

## Resource and steady-aim validation (11 October 2026)

`CARL.aimT` (0..60 active frames) and `aimAt` (the locked enemy ID) track settling on one revolver target. `hitChance` uses the better of composure accuracy and the rising settling floor, then applies its existing distance penalty and 30-98% bounds. The HUD shares this calculation: the ring contracts; at 60 frames it turns gold and labels STEADY. Fire, movement, damage, reload, sap, target loss/change and weapon changes reset it. Target acquisition now drops a lock beyond eleven meters. Shotgun/sap damage, composure narration, enemy damage/health and pickup quantities retain their existing rules.

Room entry clears settling. Version-1 suspend validates the optional timer and enemy ID, then restores the rebuilt entity as the target. Older snapshots without the fields remain valid; terminal restoration begins with fresh aiming. Frozen menus do not advance the timer. Initial controls teach holding C to settle the sight.

The microwave still consumes cold stacks and merges hot stacks through `invAdd`; its conversion preserves the slots already occupied by food. This prevents losing meals from older overfull inventories without expanding normal carrying capacity. Cold/hot food, unrelated ammunition and key items, repeated use and no-power behavior are checked.

Run `node tools/mobalance.js` for the collectible resource ledger, 1,152 seeded stationary firing-range runs, timer/interrupt/save checks, food conversion, and three active authored-drifter fixtures. Whole-campaign collectible maxima, including initial loaded ammunition/security's four loaded shells and the safe reward:

| Difficulty | Revolver rounds | Shotgun shells | Backup tapes | Meals |
| --- | ---: | ---: | ---: | ---: |
| With cream | 120 | 44 | 5 | 13 |
| Black | 84 | 32 | 5 | 13 |
| Monday | 60 | 25 | 5 | 13 |

There are also five initial/collectible coffees and up to one machine cup per act. These are possible supplies, not quantities guaranteed on a player's route. The ledger excludes repeated pursuit. Preservation avoids the six audience members' combat cost; cooking exchanges a powered return trip for stronger healing.

At zero composure and six meters, normal/hard mean revolver use falls from 5.38/7.08 to 3.09/4.05 rounds per stationary drifter when waiting for the sight, across 64 seeds per case. Confident accuracy is unchanged. Separate fixed-seed active Tuesday fixtures finish at 12 HP using 3/4/5 starting rounds on easy/normal/hard with no movement, healing or added health/ammunition after setup. Chromium checks actual aim/fire keys, paused time, sight renders and lossless microwave use. Existing story/session/Double/combat and assisted campaign/reachability checks remain successful. `mofight.js` now asserts completion/no death/no errors rather than only printing outcomes. Full human pacing, sustained pursuit attrition, route resource balance, listening and hardware performance remain unmeasured.


## Investigation and return-route guidance (11 October 2026)

The single `objective()` in `mowings.js` supplies the primary lead to the radio, case notes, map and assisted campaign driver. The obsolete first-act duplicate in `mostory.js` is removed. `leadHints()` supplies authored question/source/answer layers for the existing puzzles; ordinary travel or pickup leads retain a direct instruction. The boiler answer computes the fewest valve turns from the current gauges, including partially tried configurations. `leadHelp()` reveals each layer only after a choice. No hint progress or new field is saved.

`lockerLead()` uses the existing shared storage and directs required items to the lounge, nurses' station or camp locker according to the current floor. Film guidance checks what is carried rather than whether a pickup once occurred. The shotgun, Records client lookup and Maggie collection/handover no longer override the rescue objective; their actual side effects and ending/report branches are unchanged. The map browses three floors without exposing unknown upper/basement rooms, marks the known main destination, and displays actual feed/shutter/porter states.

`tools/moguidance.js` covers declining, cancelling and requesting help without solving a puzzle; radio static; optional objectives and source knowledge; eleven stored progression items; real locker retrieval and terminal reload; disabled Friday/lift lines; all 32 reachable gauge states; and paused map browsing with unknown rooms hidden. The real Chromium suite covers notebook help through the actual keyboard menus, floor arrows, lead/feed labels, unknown 2F and C return, with reviewed screenshots. Friday/recall/Otis/session checks and all-interactable reachability pass. Assisted record/preservation/Maggie and copy/combat-screening/no-Maggie campaigns finish without errors; their body relocation and combat assistance do not measure human playtime or attrition.

Next: an uninterrupted first-time playthrough to measure lead comprehension, repeated travel, final-act length and supplies before adjusting encounter or resource quantities. Listening and performance on target hardware remain unmeasured.
