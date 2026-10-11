# CARL 3: RETURN TO SENDER: design (v2, the full game)

This is the first Pretend Co. game for the **HYPER-32**, the generation after the SUPER-16. It is early 3D: chunky polygon people over prerendered backdrops, camera cuts, cheap motel light and enormous empty parking lots. Entry: `carl3/index.html`.

v1 was six stops in a line, about 40 minutes. v2 is a road trip in three acts across a Nevada map, aiming at 5 to 8 hours. It adds side jobs, decoy crates, ship upgrades, and a Postal Inspection Service that hunts the driver.

## Premise
After CARL 2, Carl takes a delivery addressed to himself: `CARL, [[[[[, ABOVE AND BELOW NEVADA`. Postage was paid before he was born. The only way to find the address is to follow the route the parcel has been on: **eleven stamps**, held by a chain of clerks who were each given a card nineteen years ago.

**v2 adds a second side:**
- The Postal Inspection Service (the White Suits' successors, already in v1) believes the parcel holds the tall ones' forwarding address. *(new lore)*
- If they open it, they find the parents. So Carl is protecting two people he has never met, using the one skill he really has: telling people he's something he isn't. The lies are what the Service tracks.

## Structure

### ACT I: FIRST CLASS (linear)
| id | Stop | Clerk | Beat |
|---|---|---|---|
| 1 | Box Canyon | Hank | the card, nineteen years |
| 2 | Starlite Motor Court | Dolores | Room 6, the decoy crate, the eleven-pin map |
| 3 | Big Leon's Travel Plaza | Radio Ray | Old Face on the lounge TV; the end-of-act call |

The end-of-act call (`SHIPCALL[3]`):
- A Service tracker is found on the parcel (flag `tracker`).
- Garfield: *"They stopped chasing the box. They're chasing the driver."*
- The string splits five ways.

### ACT II: PARCEL POST (open, any order)
| id | Stop | Clerk | Gatekeeper | Beat | Built by |
|---|---|---|---|---|---|
| 4 | Desert Palms Mall | Dennis (+ Linda, Ghost's box) | Dennis | the photo strip | v1 |
| 7 | The Little Green Inn, E.T. Highway | "Vern" (**the impostor**) | Earl (believer/researcher/local) | the recorder: "I'm an alien" on tape (Path A) or the test rock (Path B) | GLM (`c3stop7.js`) |
| 8 | The Silver Spur casino | Duke, Mavis, Tiny | Tiny | Machine 31 | **the template** (`c3spur.js`) |
| 9 | Lake Tahoma Lodge (snow) | June, Walt's widow | Chip (guest/instructor/boiler) | the practiced hand; the cuckoo clock confirms Carl; the bunny hill ski run | GLM (`c3stop9.js`) |
| 10 | Shadow Valley Drive-In | Arlo, the projectionist | Vee (date/critic/repair) | the reel: the road, from their car; the camera never turns around | GLM (`c3stop10.js`) |

**The impostor** *(new lore)*: Vern at stop 7 is Inspector 3 of the Service, in a cardigan. He only stamps for aliens because the Service wants a confession on tape. His stamp is counterfeit (`fakeStamp7`). The real clerk, Bev, is missing. **The reveal is the ACT II finale** (`act2Finale()` in `c3road.js`, finishing pass). Stop 7 only plants it. (Tells on site: federal-blue ink, the crisp photocopy card, "the item", "DO NOT ARGUE. RECORD.", Bev's glasses and "ON VACATION" sign, the blank-plated white sedan, the fella calling collect from the E.T. Highway.)

### ACT III: SPECIAL DELIVERY
| id | Stop | Beat | Built by |
|---|---|---|---|
| 11 | Rhyolite Springs, a ghost town | **the stealth stop**: three Service agents on patrol loops (walk behind them; being seen sends Carl back to the ship with a filed form); Opal, the last honest clerk, holds the post office with rock salt; `courier` is the only claim that opens her shutter; Inspector 9 seen on the depot platform, two lines, gone | GLM (town; `c3stop11.js`) |
| 5 | Sorting Center | expanded into a multi-floor set piece; the Inspector 9 arc and fight | finishing pass |
| 6 | Dead Letter Office | the stacks: every lie in the ledger taken back, floor by floor; the endings | finishing pass |

**Inspector 9 is redeemed** (the user's call, 2026-10-06). He wrote reg 9.4, and in the finale he uses it on his own Service.

## Endings (`carl3_meta.ends`)
- `signed`, `returned`, `forwarded`, `refused`: as in v1.
- `intercepted` *(new)*: the Service opens it. This is the bad ending.
- `replied` *(new)*: needs all 31 decoy crates. Carl writes back. Hank stamps the reply at Box Canyon, and it goes out. Nobody learns where it goes.

## Systems (`c3road.js`, carl3-only)
- **Drive map.** The helm opens a map of Nevada. `unlocked(id)` controls which stops can be reached:
  - ACT I is linear.
  - ACT II opens after stop 3, in any order.
  - Stop 11 opens after `act2fin`, then stop 5. Stop 6 is reached by the chute.
  - Visited stops stay open, so Carl can run side jobs.
  - Drive length comes from map distance. `wantDest()`, `routeObj()` and `setRouteObj()` produce the objective, which the bot follows.
- **Heat.** `heat3()` = open lies / 2 + suspicion + tracker. From ACT II on, each drive has a `heat × 12%` chance of a **Service checkpoint**: show the route card, pay a fee, or argue. The PLATES upgrade halves the chance. `C3.service` counts checkpoints.
- **Roadside.** One shared shoulder scene. `ROADSIDE` events are scripted on it with at most one per drive, about 45%, and none in ACT I.
- **Side jobs.** The JOB BOARD is on the ship. Jobs from `JOBS` are offered at the current stop, and the parcel drops through the ceiling. The recipient appears at `scene`/`at` while the parcel is on board. Pay is in bux. Carl can carry 3 jobs, or 6 with the RACK.
- **Decoy crates.** `CRATES` holds 31 crates, each with one note from the tall ones' walk. They are listed in the pause menu under CRATES, and the SCANNER shows them in the haze.
- **Catalog** on the ship: RACK, SCANNER, CB, PLATES, PAINT. The CB adds channel 19 to the radio, with lines from `CBTALK[stop]`.
- **HUD**: bux and heat under the parcel plate.
- **Revisits**: `REVISIT[id]` runs instead of `ARRIVE[id]` after the first visit.

## Script order
`engine2, fm, pkart, cast, c3gfx, c3art, c3scenes, c3scenes2, c3scenes3, c3world, c3alibi, c3argue, c3drive, c3story, c3story2, c3story3, c3story4, c3main, c3ui, c3road, c3spur, c3content, c3stop7, c3stop9, c3stop10, c3stop11, c3act1x, c3music`.

`tools/c3vm.js` reads this list from `index.html`.

**Shared files.** `c3gfx c3art c3scenes* c3world c3alibi c3argue c3drive c3main c3ui c3music` are also loaded by rh, fs, jb, nm, pr, lastlive and rsopus.
- Do not change those files' behavior.
- The expansion overrides them from `c3road.js`, which only CARL 3 loads.
- Adding a track to `c3music.js` is fine.

## Canon choices (unchanged)
- Carl's real name stays `[[[[[`. His parents are never seen, never named and never located; they stay **STILL IN TRANSIT**.
- Old Face is not his father.
- Gen-1 characters appear only as the portraits already used.

## New lore in this cart (labeled)
- the card chain
- Room 6
- the thirty-one decoy crates
- the Postal Inspection Service as the White Suits' successor
- Inspector 9 and regulation 9.4
- the Service's motive (the forwarding address)
- Inspector 3 / Vern
- Bev, June and Walt, Duke and Mavis, Opal
- the Silver Spur, Lake Tahoma, Shadow Valley, Rhyolite Springs

### New people and places from the GLM pass
- **Stop 7, the Little Green Inn** *(all new lore)*: **Earl** (believer on a bench, cap says AWAKE, keeps the sky-watch array), **Dodie** the waitress (cherry pie, forever), **"Vern"** (see the impostor above), **Bev** (the real clerk, "on vacation," first in nineteen years), the Newsletter, the test rock (green face, fifty pounds), the blank-plated white sedan in the lot. Claims added: `believer`, `researcher`, `local`, `alien` (on tape).
- **Stop 9, Lake Tahoma** *(all new lore)*: **Chip** (ski patrol, one wrist, taped, since '04), **Walt** (the clerk who practiced; died two winters ago on the hill), **June** (his widow; practiced his handwriting back), the cuckoo clock (set for "the short one," confirms without cuckooing), the bunny hill ski run (`drive()` with pine/snowman/ice), the lost-and-found closet that is also the boiler room, the one mitten (tagged '86, laundered every spring), the snowman with the replaced carrot. Claims added: `guest`, `instructor`, `boiler`.
- **Stop 10, Shadow Valley** *(all new lore)*: **Arlo** (projectionist, postal clerk, stamps in a popcorn tin), **Vee** (ticket booth; "a couple is whoever says they are"), **Raye** (snack bar; the third car's driver went for popcorn in '87, the line is still long), the reel (the road from their car; the camera never turns around; twenty feet of blank leader past the white), the threading minigame (three loops). Claims added: `date`, `critic`, `repair`.
- **Stop 11, Rhyolite Springs** *(all new lore)*: **Opal**, 86, the last honest clerk (rock salt at speed; reads the dead letters aloud at six), **Euclid** (waters the ten thousand bottles on a schedule; "the world's saddest dance"), the Service's motor pool and roadblock, the bank façade with no back (door painted on), the depot, Inspector 9's three-day vigil on the platform (two lines, unresolved, per the finishing pass). New drive obstacles: none here; see stop 9.
- **ACT I side scenes** (`c3act1x.js`, all optional, off the main path): **the Census Lady** (Box Canyon is eleven; the eleventh is the cat), **Mitch** and the vending machine (it kept Tuesday's soda; the machine remembers who shook it), **Preacher Bud** and the trucker chapel (OPEN 24 HRS (GOD); Carl leaves a prayer "for the people in transit"; the Sunday handle list).
- **Roadside folk** (one-scene, `c3content.js`): the jackrabbit standoff, the ice-cream truck man in a paper hat, Desert Bus at 45 forever, the lost mall tour group, Spooky Ghost hitchhiking (the frequency was full), Service agents Kevin and Greg arguing regulation 4.4 sincerely, the cow (within her rights), the authentic-alien-rocks man (disappointed by Carl), the phone booth ("The tables are ours. Love, Mom."), the mailman walking his route backwards, the LAST GAS/PSYCH station (free air), the self-running lemonade stand at 2 a.m. (the cup refills), the coat on a post (it rides in the back; it keeps going), the surveyor (the road got longer since Tuesday).
- **Small job people**: Boots (dice), A Believer (the Newsletter), A Mall Walker (the sound of nobody, in stereo), plus deliveries to Marge, Ned, Dot, Dolores, Leon, Slim, Dennis, Margo, Duke, Chip, June, Earl, Dodie, Vern, Vee, Arlo, Opal.
- **New minigames**: the ski run (reuses `drive()` with custom `OBS` + snow palette), the cuckoo clock (`cuckoo()`, tune-style regulation), the projector (`thread()`, three sprocket loops).

## Tests
- `node tools/c3reach.js`: every entity, crate and job recipient must be reachable.
- `node tools/c3seg.js <id> [frames]`: one stop from its prepared state (`PRE` table).
- `node tools/c3shot.js <scene> <x> <z> [yaw] [out]` (env `STOP`, `FLAGS`, `SETUP`, `FRAMES`).
- `node tools/c3spot.js`: content spot checks the route bot can't drive — job deliveries (plain, `task`, `cond`), every roadside event, the ACT I side scenes, crate integrity. Each check runs in a fresh headless context.

The FAST loop skips drawing, so draw code is only exercised by `c3shot`.

### Test log (GLM content pass, 2026-10-06)
- `c3reach`: **zero BAD** across all 26 scenes (includes every job recipient, all 31 crates, the ACT I side-scene ents).
- `c3seg 7`: default + `claim=believer` + `claim=researcher` + `claim=local` + `honest=0` (rock path) — all `done:1`.
- `c3seg 9`: default + `claim=guest` + `claim=instructor` + `claim=boiler` — all `done:1`.
- `c3seg 10`: default + `claim=date` + `claim=critic` + `claim=repair` — all `done:1`.
- `c3seg 11`: default + `claim=inspector` + `claim=maintenance` — all `done:1`. Guard-catch verified separately (caught → dialogue → teleport to scene start → objective reset; the catching agent leaves patrol to file paperwork).
- `c3seg 8`, `c3seg 5`: regression, both `done:1` (5 ends at the chute hand-off, as before).
- `c3act 200000`: end of ACT I → mall → Inn → Spur → Tahoma → Shadow Valley → Rhyolite → Sorting Center → Dead Letter Office → **`signed` ending**, f=39263, one natural checkpoint survived (`svc:1`), roadside event fired once.
- `c3act 200000` with `HEAT=1`: **`signed` ending**, f=39923, six checkpoints argued through (`svc:6`).
- `c3spot`: **all pass** — 31 unique crates with notes ≤27 words in known scenes; 30 jobs sane with 5 `task` minigames and 3 `cond` gates; deliveries verified in new scenes (plain, tune-task, wires-task, cond-gated); all 16 roadside events complete; census lady / Mitch / Preacher Bud complete; crate 17 opens in `lodge_hall`.
- `c3shot`: every camera of every new scene screenshotted and eyeballed via `tools/pngpeek.js` (this model cannot see images): `inn_lot` ×4, `inn_shop` ×2, `lodge_lot` ×4, `lodge_hall` ×3, `lodge_closet` ×1, `drivein_lot` ×5, `booth` ×1, `ghost_main` ×4, `ghost_post` ×1, plus minigame moments (wires overlay, the ski run, the cuckoo panel, the thread panel) and the reel screen effects (`reelOn` road, `reelEnd` white leader).
- **Nothing has been checked in real Chrome.** The bot's fast loop skips drawing; `c3shot` exercises draw code headlessly only.

## Saves
- `carl3_save` holds `C3`. The v2 fields `crates`, `up`, `service`, `jobsDone` and `road` are added by `ensure3()`, so v1 saves load.
- `carl3_meta` holds boots and endings.
- The cold open reads `carl2_meta`.

## Status
- **Done:** rails, stop 8 and Act I continuity (eleven stamps); the GLM content pass — stops 7, 9, 10 and 11, the full tables (30 jobs, 31 crates, 16 roadside events, CB chatter for 1-4 and 7-11), one music track per new stop, and the ACT I side scenes (`c3act1x.js`).
- **Done (finishing pass, `c3finale.js`):**
  - **ACT II finale.** The Inn stamp reads CUSTODY. Back at the Inn, Bev is freed from Room 3 (a federal sticker on a regular lock). Vern was Inspector 3, and regulation 14.1 makes mail to a non-person property. The real card was in a cherry pie, and Bev re-stamps in red. Flags: `act2reveal`, `bevFree`, `stamp7real`, `act2fin`.
  - **The Reading Room** (`sort_reading`) under the Sorting Center: Inspector 3, the pinned ledger and the tape. He offers a deal: put the parcel on the desk and the board comes down. Taking it is the **INTERCEPTED** ending. Refusing leads to an argument (his patience grows with open lies), then 9.4 against 14.1, then "THE ADDRESSEE". **Inspector 9 is redeemed:** he stamps himself "withdrawn from inspection" and wants to try a name. Flags: `i9turn`, `readDone`, `i9redeemed`.
  - **The stacks.** Each open lie is a NOTICE shelved in the Dead Letter Office, and Carl takes each back by hand. "I'M AN ALIEN" (tape) may be **kept** as the true address.
  - **REPLIED** (needs all 31 crates): Carl writes back to STILL IN TRANSIT, and the reply is stamped outbound at every stop, ending with Hank.
  - Saves now keep the objective marker. The motel wing has a camera, Rhyolite's and the drive-in's cameras were moved, and the Dead Letter Office floor was joined to the cross aisle.
  - **Continuity:** stamp numbering (Rhyolite is 9, the Sorting Center 10, the Dead Letter Office 11); crate notes fixed for canon (Room 6 never slept in; nothing that happened after the tall ones left).
- **Verified headless:**
  - `c3reach`: clean.
  - `c3seg` for stops 1, 2, 3, 7, 8, 9, 10, 11 and 5.
  - `c3act`: signed ending at f=47031, through the Bev rescue and the Reading Room.
  - `c3seg 6`: the stacks, including keeping the alien notice.
  - `WANT=ending=replied` and `WANT=ending=intercepted`.
  - All 7 spin-offs that share `carl3/` files still load.
  - Contact sheets of every new camera: `node tools/c3cams.js out.png <scenes...>`.
- **Not verified:** real Chrome, and a single bot run from NEW GAME to the end (runs were split into segments for memory).
