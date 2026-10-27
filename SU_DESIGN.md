# CARL: THIS IS A STICK UP! — design

**Cart:** `CARL - This Is a Stick Up! (USA) [HYPER-32]` · (C)1999 PRETEND CO. · folder `su/`
**Pitch:** the spirit of Grand Theft Auto, fused with Carl. A top-down crime city in the GTA1/GTA2 style
(the right look for a 1999 cart): the HYPER-32 chip extrudes every building toward a camera hanging over
the street, the camera pulls back as you drive faster, and the whole city keeps moving without you.
The avant-garde part: Carl's weapon is a stick. He points it at people and says "this is a stick up,"
and it works, because nobody has ever met anyone who believed that hard in a stick.

## The city: VICE VERSA, NEVADA

60x60 tiles of 32 world px. Two-lane roads on a grid (traffic keeps right, turns at every junction),
sidewalks, extruded buildings, Lake Meed down the east side (docks, boats), districts named on entry:

| District | Blocks | What's there |
| --- | --- | --- |
| DOWNTOWN | center | towers (the tallest leans), JEWEL STORE, FASCISM INC. DEPOSITORY |
| GHOST HILLS | NW | low mansions, pools, lawns; SPOOKY GHOST's mansion |
| THE STRIP | NE | casinos, neon roofs; SEVEN-ELEVENTY; PROP 'N' SPRAY |
| SOUTH SIDE | SW | houses, Carl's safehouse lot (the A.S.S. is parked there) |
| THE YARDS | SE | warehouses; the PROP PILLZ knockoff lab |
| LAKE MEED | E edge | docks, speedboats, a yacht |

## Controls (3-button pad)
- D-pad: walk (8-way) / drive (up gas, down brake-reverse, left/right steer)
- A: get in / out of a car (the driver gets out and complains). In the A.S.S.: take off / land.
- B: use weapon — STICK (hold up a ped or store = cash; up close it's a bonk), PEASHOOTER (after FACE's first job)
- C: on foot switch weapon; in a car, change radio station
- START: pause / city map

## Systems
- **Wanted (0-5 stars).** Cops that see a crime add stars. Cop cars path along the roads toward you (road BFS);
  close up they get out on foot. On foot a cop that holds onto you for a second = BUSTED. From 2 stars they shoot
  pellets. Out of cop sight long enough, stars drop one at a time (they flash while searching).
  PROP 'N' SPRAY clears it for $100. Nobody dies: knocked-down people see stars, then get up and say something.
- **WASTED / BUSTED:** respawn at hospital / police station, lose $ (and the current mission).
- **Traffic + peds:** lane-following cars, wandering sidewalk peds; both stop for you, flee from trouble.
- **Stick-ups:** point the stick at a ped (hands up, drops cash) or walk into a store's counter marker. Cops
  who are held up laugh ("THAT'S A STICK") and add two stars.
- **Radio** in any car: NON-STOP-PROP 101.1, K-GHOST LOUNGE, CHAT FM (talk: chat messages), OFF.
- **Missions** start at contact blips (C = Carl, F = Face, G = Ghost); save after each mission.

## Cast mapping (GTA V -> Carl)
- **CARL** — Franklin + Trevor's missions. Always in a ski mask; insists it's fashion. Everyone recognizes him anyway.
- **SPOOKY GHOST** — Michael. Faked his death; then actually died; now in ghost-witness-protection in Ghost Hills,
  seeing a therapist, "retired" from heists. (Bible-consistent: Ghost wants his life to be a great story.)
- **CEO LINDA** — Amanda. Ghost's first ex-wife, still lives in the mansion on spooky alimony. She has gotten on the
  GALS GONE WILD tour bus "to acquire the brand from the inside." Attractive per ref/CEO Linda.png; never the butt.
- **FACE** — Lester. The planner, who only exists on monitors in a comic-shop basement.
- **SERGE** — Linda's tennis coach (new, labeled). Steals the yacht.

## Missions (first playable)
1. **THIS IS A STICK UP** (C) — rob SEVEN-ELEVENTY with the stick, first stars, lose the cops, back to the A.S.S.
2. **HOMEWORK** (F) — Face needs a specific car; steal the gold LUXOR from a valet, deliver it to his garage without a scratch over 50%.
3. **GHOSTED** (G) — meet Ghost. Linda is on the GALS GONE WILD bus. Chase it, ram it till it stops, get Linda off before the tape rolls.
4. **PROP BURN** (C) — burn down the PROP PILLZ knockoff lab: plant 4 gas cans, light it, get out of the blast.
5. **DOCK FRIGHT** (G) — Serge took Ghost's yacht. Speedboat chase across Lake Meed; ram the yacht to a stop.
6. **FLY THE A.S.S.** (C) — take off in the ship, lift 3 crates off rooftops past the army choppers, drop them at the lot.
7. **THE JEWEL STORE JOB** (F) — Face's board: approach LOUD (smash and run, 3 stars) or SMART (pest-control gas, 1 star).
   Smash the cases in time, then lose the cops through the storm drain.
8. **THE BIG SCORE** (F+G) — the FASCISM INC. DEPOSITORY. Linda calls first. Choice (GTA V's ending, no killing):
   - **SOMETHING SENSIBLE** — hand Ghost to the feds; Linda keeps the house. Carl drives away alone.
   - **THE TIME'S COME** — let Linda buy out Face's plan; Face goes dark on every monitor.
   - **DEATHWISH** — all three together: drive the gold out under five stars and get it to the A.S.S. Best ending.

## Tech
Loads the CARL 3 HYPER-32 stack unedited (`g2/engine2`, `g2/fm`, `carl3/c3*` for busts, dialog plates, music `cgen`).
`su/sucity.js` map + baked ground + extruded building renderer; `su/suworld.js` cars, peds, cops, physics, HUD;
`su/sumiss.js` missions; `su/sumain.js` boot, title, radio, saves. Bot: `node tools/suplay.js` (teleport bot: proves
every mission script and ending runs; it does not prove the driving feels good). Shots: `tools/sushot.js`.

New lore in this cart (labeled, non-canon unless adopted): Vice Versa, Nevada; Serge; GALS GONE WILD; Ghost's
witness protection; the Fascism Inc. Depository.

## Bugfix pass (2026-10-11): bloom flicker on road lines and car edges
User report (after the headlight-color fix): "lighting on the lines on the road and cars is still kind of weird."

Root cause: bloom's downsample step sampled exactly ONE fixed pixel per 4x4 screen block to decide if that
block was "bright." Thin or moving bright features — dashed road lines, the edges of a headlight cone, a car's
window highlight — only land on that one fixed sample point some frames and not others, as the camera's
continuous sub-pixel easing (`CAM.x += (target - CAM.x) * .12`, which never fully settles) shifts the alignment
between the content and the sampling grid every frame. Measured directly: a mere 1px shift in that grid changed
which blocks counted as bright by 42%, with no change to the actual scene. That reads as exactly what it sounds
like: flashing, blotchy lighting on anything thin — road lines and car highlights most of all, since large solid
sources (neon signs, the body of the headlight cone) are less likely to fall entirely outside one sample point.

Fixed by scanning every pixel in each block for its brightest, instead of one fixed point. Re-measured the same
way: a 0.8px camera shift now changes the bright-block count by well under 1% (764 -> 764 -> 762). Cost: still
comfortably inside budget — worst case (night+trip+rain+driving) measured at 5.1ms/frame in real Chromium, versus
16.7ms available for 60fps.

## Bugfix pass (2026-10-11): headlights looked broken at night
User report: "the lighting looks messed up, kind of alternates and flashes, looks like blotches on cars."

Root cause found by code inspection, not guesswork: when headlight `BEAM` was brightened (from `#b6b692` to
`#dcdcc0`) so it would cross the bloom threshold, the night-darkening exemption list in `su/sutrip.js` still had
the OLD hex string hardcoded. So every car's headlight beam was getting darkened and desaturated like an ordinary
surface instead of staying bright like a light source — rendering as a dull, muddy gray-teal smear instead of a
clean light cone. As that smear sweeps and rotates with every turn a car makes, it reads exactly like "alternating,
flashing blotches." Fixed the stale hex string to match the current BEAM color; headlights are now bright and warm
as intended. Verified: full story bot still passes, and Chromium frame cost actually dropped (the worst-case
stacked mode went from 8.5ms to 4.3ms/frame) now that the color-grading LUT isn't computing an extra off-palette
shade for every headlight every frame.

## Bugfix pass (2026-10-11): the A.S.S. was genuinely hard to fly
User report: "the ass is really hard to control... doesn't seem like it moves... a bunch of helicopters come out
of nowhere and start attacking for no discernible reason." Both real bugs, confirmed with a thrust-turn-thrust
test (not a control-scheme misunderstanding):

- **Flight physics** (`su/suworld.js`, `stepShip`): the old model recomputed "forward speed" every frame as the
  projection of the ship's EXISTING velocity onto its CURRENT heading, then blended 90% of that back in. Turning
  while moving silently dragged existing momentum toward the new heading even with no thrust held, so a turn ate
  your speed and thrust afterward felt unresponsive. Measured before the fix: turn 90°, thrust 2s -> moved 176px,
  vs. 409px for an identical straight thrust. Replaced with a plain thrust-plus-drag model (push along current
  heading, drag bleeds it off, turning only affects FUTURE thrust) — same test now gives 307px vs 314px.
- **Helicopters** (`su/sumiss.js`, `chopper()`): they homed in on the player's exact position from anywhere on
  the map with no range limit, so all 3 (or 2, in the heist-prep mission) converged within ~10 seconds of liftoff
  regardless of where the player actually flew — reads exactly like "came out of nowhere, for no reason." Now
  each chopper remembers its spawn post and only gives chase once the player is within 260px of THAT post;
  otherwise it just hovers there. Confirmed: a chopper spawned 1500px away stayed within 24px of its post after
  10 seconds of the player not approaching, and still closed in normally once the player got near it.

Verified with a real Chromium session (actual keydown/keyup, not synthetic state pokes): liftoff, forward thrust,
turn, thrust again — 307px then 306px, matching the headless numbers. All 16 story missions re-verified afterward.

## Expansion v5 (2026-10-12): building interiors
Asked for: "can we add building interiors to carl this is a stick up?"

**What you can walk into.** Every building that matters is now a room you enter on foot through a real door, no loading:
STICK-NATION, SEVEN-ELEVENTY, DONUT TIME, GAS-N-GULP, DR. PLUM, J.B.G. P.I., SPOOKY GHOST's mansion, FACE'S (comic shop in front,
the basement of monitors behind a doorway), Carl's crib, the HOSPITAL, the POLICE station, every casino on the Strip (LUXOR included),
the Ghost Hills mansions, the South Side houses and the Yards warehouses. Cars cannot enter (the footprint is solid to them).
The JEWEL STORE keeps its old glass-roof layout.

**How it reads.** From the street a building is the same extruded box with its roof sign. Walk through the door and the roof peels back,
the walls drop to a low cutaway and the camera zooms to frame the whole room (centered on the room, not on Carl). At night the room Carl
is standing in stays lit while the street goes dark. Furniture is extruded boxes with painted tops (shelves of products, cooler glow,
slot reels, monitor wall, piano keys...), floors are baked per room (planks, tile, carpet, marble, hospital check).

**What happens inside.**
- Clerks stand behind counters. Hold one up with the stick (B) from the customer side: SEVEN-ELEVENTY, DONUT TIME and GAS-N-GULP pay
  out and call the cops exactly as the old door hold-up did; the casino cashier pays $500-1200 and is a 4-star job.
  THIS IS A STICK UP now has Carl walk in and up to the counter (mission marker moves inside).
- Prompts (A) appear over spots in the room you are in: STICK-NATION counter = shop; Dr. Plum's couch = free talk or a $200 session
  (heals, calms the trip); JB's drawer = lasagna (full HP, 2 min cooldown); crib bed = save or sleep till morning, board = PROP RUN shift,
  garage keys = store the nearest parked car / take one out (this fixes the garage: the old crib menu could never offer STORE CAR because
  it only opened on foot); Face's monitor wall; casino slot machines ($50 a pull, 3% jackpot $2000); nurse check-up ($50).
- FACE's missions now start in the basement and JB's in his office (their markers lead you through the door).
- WASTED now wakes you in a hospital bed; BUSTED in a holding cell whose door was never locked.
- Hiding works: walls block police line of sight, so a star-searching cop loses you behind a wall; a cop on foot that has seen you
  routes through the door (door waypoint) and busts you if he reaches you.

**Tech.** `su/suint.js` (framework + the hand-built rooms) and `su/suint2.js` (hospital, police, casino, procedural houses / mansions /
warehouses). A room is `iShell()`: a footprint of `TL.room` tiles (solid to cars, walkable for peds), thin wall rects, a roof pseudo-object,
then `iProp()` furniture, `iPoi()` prompts, `iFolk()` residents. Collision for peds/shots/line of sight is a per-tile bucket of rects
(`obAt`), not tiles, so walls are 6px thick and furniture can be any size. Residents spawn when Carl is within 380px and despawn past 560
(tag `'int'`, which missionCleanup deliberately keeps). Walls draw their inside face plain and the street face with the usual window lines.
Props are skipped while the roof is down. Palette note: bloom triggers above luminance 205, so floors and furniture tops are kept below it.
Night: `postFX` runs a second colour table (no darkening) inside the lit rect of the room Carl is in.

**Tools.** `node tools/suinttest.js` (every door walkable from the street, every prompt / counter / resident reachable by flood fill, nobody spawned in a wall),
`PLAYWRIGHT_PATH=... [CHROME_PATH=...] node tools/subrowser.js` (real Chromium: real arrow keys through a door, robs the 7-11 clerk, bed prompt,
frame time at night inside a room: about 4.7ms). `tools/suplay.js` was updated for the counters; the tailing mission's mark car is kept alive by the
bot because ambient traffic sometimes wrecks it at a junction (unrelated to interiors: measured collision counts are the same with and without them).

**Found, not changed.** The police almost never spawn: `populate()` only adds cop cars while `SU.search === 0`, but `stepLaw()` bumps
`search` every frame nobody sees Carl and `crime()` resets it after `stepLaw` has already run for that frame, so a new crime gets one
chance in 30 frames to spawn cops (measured: 1 of 6 phases). A one-line fix would be `SU.search < 90` in that condition. Not changed
because it changes how hard the game is.

## Expansion v4 (2026-10-11): the graphics pass
Asked for: "push the limits of the graphics gen 3 could pull off. really cool looking with nice special effects."
All new code in `su/sufx.js`, loaded after sugta.js, hooked from drawWorld()/stepGTA()/gameScene.draw().

- **Bloom**: every frame, bright pixels (neon signs, headlights, fire, the eye collectibles) are downsampled to
  80x56, box-blurred twice, and added back at full res as a soft glow. ~1-2ms on top of the existing draw.
- **Weather**: mostly clear, sometimes rain (random, lasts several in-game minutes) — full-screen streaks, a
  darkened cast, and rare lightning (a flash + a thunder-crack sfx reused from the hurt cue).
- **Skid marks**: any car sliding sideways at speed drops a fading tire trail on the asphalt (capped at 420 dots,
  so it never grows unbounded over a long session).
- **Bigger blasts**: every explosion (car wrecks, sticky bombs) now throws a two-ring shockwave and a spray of
  tumbling debris chunks with real gravity (launch up, arc, bounce once, settle), on top of the existing fire/smoke.
- **Speed lines**: radial streaks converge behind Carl's car past ~3.4 units of speed, intensity scaling with speed.
- **Lens flare**: a warm glow and a couple of flare dots at dawn and dusk, tied to the existing day/night clock.
- **Vignette**: a permanent soft darkening at the screen edges, a little stronger at night.

Performance (Chromium, Playwright): day 2.5ms, night 4.9ms, trip 3.9ms, Below 4.2ms, rain 4.2ms, and everything
stacked at once (night + trip + rain + driving fast) 8.5ms — all comfortably under the 16.7ms/frame budget for 60fps.

Bug caught by screenshot review, not a bloom bug: what looked like an oversized "bloom blob" at one test spot was
just a normal eye collectible sprite rendered at the screenshot tool's 2x save scale — no fix needed, false alarm.
Real tuning done: the first bloom pass washed out small bright points (the eye icons) into disproportionate blobs
relative to their source size — the box-blur kernel was tightened from 5-tap to 3-tap and the additive strength
dropped from .55 to .42 so large bright sources (neon, headlight cones) still glow well without small points
blowing out.

## Expansion v3 (2026-10-11): the GTA staples, the dream-game pass
Asked for: "keep going in the direction of making this the ultimate grand theft auto + carl experience... a dream game."

**Odd jobs** (`su/sugta.js`): get in the right vehicle anywhere in the city and the job starts; get out (or wreck it) and it ends.
Endless, levels up, timer refills on every success, best level persists across new games (`SUMETA.jobs`).
- VIGILANTE (cop car): ram fleeing suspects until they bail.
- PARAMEDIC (new vehicle: ambulance): pick up the injured, race them to the hospital.
- FIREFIGHTER (new vehicle: firetruck): put out a burning car before it's gone.
- TAXI DRIVER (taxi): fares and drop-offs, tighter timers at higher levels.

**Rampages**: 5 fixed pink-ringed spots around the city (visible on the radar). Walk up on foot, press A, a forced
weapon and a goal appear: STICK RAMPAGE (12 bonks/45s), BOMB RAMPAGE (8 cars/60s), PEASHOOTER RAMPAGE (18 pops/50s),
JOYSTICK DEMOLITION (6 parked cars/60s), GLOW RAMPAGE (12 people dancing at once/40s). Replayable, +$400 each win,
the weapon you didn't own is loaned for the attempt and taken back after.

**Stunt jumps**: 6 yellow/black ramp pads (radar-visible). Drive through fast enough and it's a one-time +$500 flourish
(screen flash/shake + a fire-and-smoke burst) — ponytail: no literal 3D hop, the draw layer doesn't carry a per-car
world-Z yet, so it's a cosmetic payoff rather than real air; add the hop if it ever needs to look as good as it sounds.

**Cheat codes**: type while playing, GTA-style (own keydown listener, separate from the pad). HOMEBASIC (every
STICK-NATION weapon), ABOVEBELOW (invincible), STICKPARTY (everyone dances), SPOOKYMODE (toggle the Below),
FLYINGSAUCER (warp into the A.S.S. wherever you're standing), WANTEDLEVEL (cycle your stars).

**The garage**: the crib menu now stores up to 3 cars (color kept) and can call them back out later; persists in the save.

**K-DYS 106.7**: a sixth radio station, DJ Dyslexio, a sincere monologue in his established voice (no misspelling
gags, per [[dyslexio-and-linda-canon]]) — "DYSLEXIO. WITH AN O.", "WE MEANT EVERY VERSION."

Bug the test harness caught: every job/rampage-spawned ped and car needs the engine's `tag` field (not just an
in-house `jobTag`/`rampTag`) or the ambient despawn culls them within a second of spawning, since `tag` is what
every other system (missions, traffic) already uses to mean "don't despawn this." Fixed at every spawn site.

## Expansion v2 (2026-10-11): the full game, and weirder
Asked for: "a substantial expansion... more like a full game... more psychedelic and weird."

**Three acts, 16 missions** (new ones marked *):
- ACT I THE STICK: THIS IS A STICK UP, PROP RUN* (Carl's day job: delivery van, weird customers), HOMEWORK,
  STICK-NATION* (the weapon shop; knock over 10 PROP PILLZ dealers with the BIG STICK), GHOSTED, PROP BURN (now ends with Carl breathing the Z smoke).
- ACT II THE TRIP: GRASS ROOTS* (still tripping, Carl meets THE HUMANS in the park: three waves of identical suits asking
  "are you a normal human?"; they pop), DOCK FRIGHT, THE FED* (JB GARFIELD, P.I., "deputized because he asked": tail a beige sedan,
  it's a mannequin), FLY THE A.S.S., MARRIAGE COUNSELING* (drive Ghost + Linda to DR. PLUM, answer their questions, wreck three paparazzi vans), THE JEWEL STORE JOB.
- ACT III ABOVE AND BELOW: VICE VERSA* (Carl eats the whole bottle and finds THE BELOW, the city inside out; five glowing manholes
  hold visions: the desert light, Old Face holding the door, the lost-and-found mask, chat, a postcard reading STILL IN TRANSIT; parents stay unsettled),
  PREP: THE TRUCK* (ram a gold truck until the driver bails), PREP: BLUEPRINTS* (A.S.S. beams the briefcase off the Depository roof), THE BIG SCORE (DEATHWISH escape is now played tripping).

**The psychedelic layer** (`su/sutrip.js`): every frame of the world goes through one colour table. Prop Pills (pickups, PROP'N pills
from the shop, the glow stick, eyes) raise TRIP: hue rotation, oversaturation, raster wobble, motion trails, buildings breathing,
every head becomes an eye watching Carl, things float over the city, Carl's thoughts pop up ("THE BUILDINGS ARE BREATHING. GOOD FOR THEM.").
THE BELOW inverts the city. A day/night clock (12 real minutes a day) darkens the city, lights windows, and turns on headlights.

**Side content** (`su/suside.js`): STICK-NATION sells the BIG STICK, STICKY BOMB (sticks to cars), GLOW STICK (everyone dances, cops too),
JOYSTICK (remote-drive any car from the sidewalk), PROP PILLS. Three robbable stores (7-11TY, DONUT TIME, GAS-N-GULP). PROP RUN delivery
shifts from the crib. 24 hidden eyes (4 on rooftops, A.S.S. only): 12 = THE THIRD EYE (pause + C trips on demand), 24 = pause + B visits the Below.
Five STRANGERS & FREAKS: THE MIME (invisible stick: "that is MY bit"), 40 PIGEONS IN A COAT, THE SURVEYOR, I AM CHAT, THE OTHER CARL (from the Below).
Pause map shows completion %.

New lore in v2 (labeled): THE BELOW under Vice Versa; THE HUMANS; JB Garfield deputized; Dr. Plum; the postcard (a nod to CARL 3's STILL IN TRANSIT, not an answer).

## Status (2026-10-11, v2)
v2 verified by bot: all 16 missions, 5 strangers, a delivery shift, 3 endings (STRANGERS=1 DELIVERY=1 also bot flags).
v1: all 8 missions, 3 endings, free roam (store stick-ups, PROP'N'SPRAY, radio, save at the crib, pause map).
- `node tools/suplay.js` teleport bot: NEW GAME -> ending passes for ENDING=0/1/2; DIE=<mission> and FAILT=<mission>
  retry paths pass; SMART=1 runs the pest-control heist; LAW=1 loses the cops through real search decay (no cheat).
- `node tools/sushot.js <dir>` frame grabs (AT=x,y tiles, CAR=, DRIVE=1, FLY=1, WANT=, MAP=1).
- Real Chromium (Playwright, localhost:8731/su/): boots, title, first mission, 60 fps, ~2 ms per frame, no errors.
- Not yet: a human playthrough for driving feel and difficulty; mission balance (timers, bus/yacht ram damage) is untested by hand.
