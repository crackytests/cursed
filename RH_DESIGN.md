# CARL: RESIDENT HUMAN (`rh/`)

A spin-off, not a numbered sequel. Hyper-32 (same engine as CARL 3, see CARL3_DESIGN.md): fixed prerendered cameras, chunky live polygon people, free movement. Carl signs a lease for a normal apartment in THE RESIDENCES AT TOMORROW (a disused wing of the Mall of the Future that Linda converted). The lease says HUMAN OCCUPANCY ONLY. He signs before she finishes explaining. The building is the whole adventure.

## The one idea
**Carl has to live with what he says.** Anything he claims creates an authored obligation. Nothing is random and nothing is a quest log: the pause menu has THINGS I SAID ("Some of those were hypothetical.") and each entry lists who heard it and what they now expect.

When a claim comes due, `callback(id, who, setup, {doIt, admit, dbl})` offers three honest-feeling moves:
- **DO IT**: pay the claim off (a repair, a speech, a form, a party). Costs time, earns trust.
- **ADMIT IT WAS HYPOTHETICAL**: the hard, useful choice. Usually the best long-term trust.
- **DOUBLE DOWN**: sometimes it is wrong (Bea: "The building is on my side. You are the variable"), sometimes justified (`unfair` flag, when someone is being unfair).
Giving up a repair returns without closing the claim or advancing its task. THINGS I SAID scrolls through every entry; the selected statement and expectation appear in full below the list.

States shown in the list: OPEN, KEPT, TAKEN BACK, DOUBLED DOWN, BACKED UP, LEFT ALONE.

| claim | said to | comes due |
|---|---|---|
| human | Linda (the lease, automatic) | ch5 verification question |
| radio | Orrin | ch2: demonstrate a normal station (wires) |
| telescope | Roz | ch3 roof: focus the stars (it is a bong) |
| quiet | Bea | ch2: fix her thermostat quietly; ch3: quiet household filter suppresses wall requests |
| plant | the mailroom drone | ch4: Gerald has a vine in the wall |
| birthday | Linda | ch2 Orrin expects it; ch3 mixer: the cake |
| maint | the STAFF ONLY drone | ch2 Roz's oven; ch3 staff designation, service override, and two work requests |
| sealed | Marisol | ch3 end: back it up; ch4 Nell opens 3F |
| saucepan | the voice in the wall | ch5: it is the proof Nell lives there |
| ghost | the lobby drone | ch3 Orrin's form 11-B |
| voice | Marisol, explicit invitation in ch2 or before ch3 mixer | ch3 mixer: the speech |
| curtains | Bea | ch4+: real blackout curtains from Okafor |
| supper | Roz | Inspection Day: hot mixer supper |
| sleep | Bea | Inspection Day: quiet shared pipe |
| water | the voice in the wall | Inspection Day: running tap for an unlisted unit |

## Cast
ORRIN (3B, visibly inhuman, paperwork immaculate), BEA (3C, night-shift diner, sleeps days), ROZ (3D, longest resident; kitchen wall with decades of height marks for DEE; refuses to move), MARISOL (tenant association, calls Carl "a strong voice"), the VOICE IN THE WALL = NELL (3F, painted shut, knows plumbing, saucepan), OKAFOR (B2, the seventies), QUILL (B2 again, the fifties, the mailman), DEE (Roz's kid, edited out), GERALD (the plant). Visitors: FACE (sofa carry), GARFIELD (disputed incident), SPOOKY GHOST (unauthorized occupant). Antagonist: LINDA's NORMAL LIVING system, which adjusts noise/temperature/lighting/access for "the standard resident". Idle too long and the lights go out until you do something standard.

## Chapters
1. **WELCOME HOME**: lease, Face carries the sofa (leave the conversation and he drops it), radio from 3B, "telescope" from 3D, the package in the mailroom (Gerald), Bea at the door, the 3:07 knock from inside the closet wall.
2. **QUIET ENJOYMENT**: noise complaint, STAFF ONLY door (claim maintenance, or be lost and use Roz's dumbwaiter), panel A answers (the voice), panel C valve and the saucepan, Orrin's two items, Roz's oven, Bea's thermostat (the noise meter), tenancy review.
   After the tenancy review: **INSPECTION DAY**, described below.
3. **AUTHORIZED OCCUPANTS**: Ghost arrives, form 11-B, maintenance work requests and quiet household policy (see below), Garfield's interview (SOME OF THOSE WERE HYPOTHETICAL retracts open claims), the residents' mixer (cake, speech, verdict), the roof with Roz, Marisol on 3F.
4. **BELOW MARKET RATE**: B / B2 / B2 (AGAIN) in the elevator. The closed mall (records and mailbag), Okafor (key, optional curtains), Quill's service letter and observed address clues, the red back door of 3F, Nell. The photo, Dee, and the shared-wall drawing are optional.
5. **PLEASE VACATE**: reset at midnight. Ask four neighbors and Nell; each helps if you did something for them (`C3.good`), otherwise a weaker, honest "I'm sorry". A staged LIGHTS / DOORS / VERIFICATION journey (see below), then the control room and the building-wide intercom argument (allies cut Linda's patience), the verification question (three honest answers, none requires saying alien in public), "Their residency could not be verified." / "You can't just decide somebody doesn't live here." / "I borrowed their saucepan. It's upstairs. What more do you need?"

Endings: HOME (3+ allies, then the last playable scene), A QUIET UNIT (fewer), PLEASE VACATE (quit the argument), THE DOOR (seen with HOME: in his apartment he arranges Okafor's records and someone knocks at the actual door; this time he lets them in).

## Inspection Day (between chapters 2 and 3)
A short interlude using floor three, the apartments, maintenance, the laundry, the diner, and Linda's office. NORMAL LIVING budgets the shared service line for one standard resident. Roz needs hot supper for the mixer; Bea needs sleep before work; the unlisted neighbor needs running water. Carl can promise each separately or make no promise.

The schedule advances only through confirmed check-ins at the office desk, with the current phase and service conditions on the HUD:
1. **Preparation:** ask Marisol and all three neighbors; choose REST, OVEN, or WATER at Panel D. REST keeps 3C quiet but supplies neither heat nor water. OVEN and WATER rattle the pipe. Borrow the laundry service towel and wrap the pipe to keep either mode quiet. Borrow the diner's insulated box, cook and pack supper at Roz's oven, then switch to WATER to meet all three needs. Food left in the oven gets cold when it loses its turn.
2. **Room checks:** controls are sealed after the desk shows the conditions and asks for confirmation. Visit each neighbor. The three callbacks use the recorded conditions; saying DO IT after a failed check leaves the claim OPEN. Admission and doubling down change the statement, while the actual result stays recorded. Unmet needs never block progress.
3. **Report:** file all three residents' results, including the unlisted tap, or tick STANDARD RESIDENT SATISFIED. Physical outcomes change each neighbor's trust; the truthful report earns Marisol's trust. The mixer shows hot or cold supper, rested or exhausted Bea, the voice's water result, and whether the neighbors were acknowledged in the file.

Preparations, phase, checked rooms, and outcomes are saved. Existing saves already in chapter three or later continue without being sent backward. The original repairs resume after the temporary service restrictions lift. Orrin's birthday remains its separate payoff.

## Maintenance requests (chapter three)
After Ghost settles, NORMAL LIVING prints two cards beside the lobby kiosk. An active maintenance claim grants a laundry service-door override. No claim or a retracted claim produces public requests and no staff status.

The corridor bulb between 3C and 3D has failed. Check its fitting, borrow a matching spare from the laundry bench, then replace it. The actual corridor lighting changes. The water request is denied because the directory calls its address vacant: the main valve repair still works, but Panel F closed a local relay after directory validation. Knock on the chalk house, hear the anonymous resident answer, then open the local bypass or retain the denial.

Correcting the staff record revokes the override while leaving both services unresolved. Marisol can visibly replace the bulb and issue a resident service permit; Carl still checks the tap. Insisting on staff authority opens a useful shortcut without supplying water. Jobs may be filed as still open so every path progresses. The cards, door and tap show their actual state; the mixer remembers the results. Trust changes once on filing, and repeated repairs cannot farm it. Open work can still be completed later.

C3.workOrders stores the designation, approach, access and physical results. Inspection results remain separate. Existing chapter-three saves can discover the board optionally; late saves are never sent backward.

## Quiet household policy (chapter three)
Filing the maintenance cards activates a quiet policy only if Carl's quiet claim is still recorded. The speaker in 3A holds routine announcement dings and ticker messages; the building also masks the closet relay's knocking and drops its service request. The speaker receipt and vent strip show which claim caused it. No claim, or a previously retracted claim, means an ordinary speaker and an open channel.

Carl can ask Orrin in 3B to register essential knocking, remove the designation through the kiosk's QUIET POLICY option, keep suppression, or decide later. Orrin's exception keeps announcements muted while accepting resident requests. Removing the designation opens the channel and restores routine announcements. Neither action repairs a tap or tells its resident what changed: return to the vent and test three knocks together. Keeping suppression changes trust and receives a specific response at the mixer; it never blocks main-story progress.

The speaker indicator, PA label, closet relay text and vent receipt show the filter state. Direct conversation and important story notices remain readable. A routine announcement occurs once per apartment entry, with no new real-time schedule; the finale has no automatic routine interruption. C3.quietPolicy stores the mode, exception, request and follow-up. Repeated checks cannot farm trust. Older saves can discover the speaker optionally; absent late-save fields do not create a new policy.

## Optional home visits (chapters three and four)
After Ghost settles, the owned saucepan and radio in 3A become activities. They never replace the main objective.

- **Meal:** choose Bea or Orrin, ask what would help, then cook at home. Bea requests a covered bowl left quietly outside 3C. Orrin requests company at supper in 3A. The delivery choice affects trust once. Bowls remain in the kitchenette, empty after the meal. Nell leaves her recipe during the reveal; the intercom remembers the actual meal and any mistake.
- **Radio:** invite Orrin in 3B, then listen in 3A. A physically repaired antenna plays traffic; an admitted or initially unnamed station plays strange weather; an unresolved normality claim leaves static. Each supports a worthwhile visit. An optional B2 (AGAIN) address clue leaves a card and mug, and never reveals Orrin's origin early.
- **Ghost:** share the sofa, give him a small label-sorting job, or set visiting hours. His spot or note changes visibly. Company or a household job lets him offer a lit pipe route during the reset. He waits clear of the control door, and is never a sixth vote. The dim corridor remains traversable without him.

C3.homeVisits stores the meal, radio, Ghost choice and recipe. Each activity can wait; repeats cannot earn more trust. HOME lists completed visits. Old saves do not acquire a new requirement, and the recipe is saved after Nell's complete reveal and chapter transition.

## Letters and older-floor clues (chapter four)

Quill's returned bag supplies a service letter: TO THE OCCUPANT, F SERVICE; RETURN AT THE BLUE HANDLE. Paired teal arches and two blue pipe bands match the older brass cross-index, wallpaper, and a hanging saucepan. The old maintenance tag and model clause provide alternate pipe observations. Quill offers three progressively clearer hints on request. Wrong attempts at Q or the modern front door return the letter with a correction. A service label plus the matching handle identifies the anonymous resident's back door; delivery opens it and records a receipt before Nell's existing reveal.

Carl can also carry Dee's kitchen drawing. Four long height marks and a chipped blue plaster diamond appear in both B2 unit 10 and Roz's kitchen. The delivery requires comparing both walls. Dee supplies the green pen without giving away the other address. After delivery, the existing new mark and wall conversation produce two answered addresses. An optional signed copy on the tenants' board earns Marisol's acknowledgement. The drawing remains on Roz's counter; the service letter remains in 3F. Ally conversations and the intercom use only delivered mail and witnessed answers.

MAIL in the pause menu unfolds each paper and its observations or receipt. It is separate from THINGS I SAID. A small HUD count shows carried mail. Avocado panels and rounded fixtures distinguish the seventies; brass slots and patterned arches distinguish the fifties; present signage covers older wallpaper. Both kitchens visibly share the same marks and repair, with a new green mark after the pen payoff. The saucepan stays unnamed until Carl meets Nell.

C3.letters stores clues, carried/delivered stages, requested hints, and the answered/filed witness. Repeating delivery or filing cannot farm trust. Old saves already past Quill use their existing back-door route, and chapter-five saves acquire no new required delivery. Observations and stable handoffs survive reload. The drawing adds testimony and understanding without adding an ally vote.

## Staged reset (chapter five)

New runs begin the saved reset after Nell's reveal. The same five neighbors choose full or limited help. Confirmed actions advance the schedule; waiting, moving, or saving never does.

- **LIGHTS:** signal Nell at Panel F to turn the return valve and restore the maintenance lamps. Without her help, borrow the laundry's battery lamp and clip it to the pipe. The smaller beam exposes the old markings while the building supply stays off. Ghost's guide remains useful and recognizes restored light.
- **DOORS:** Orrin files a stay at the service checkpoint; without him, copy the manual service plan. Orrin and Bea together preserve the main doorway, with Bea holding its open leaf. Otherwise use the laundry hand release: Bea wedges that door if she helps, or Carl sets its mechanical stop. Earlier staff status cannot bypass a reset closure. Both routes allow return trips.
- **VERIFICATION:** Marisol gathers answers at the tenants' board, or Carl collects Nell's response in 3F and pins both sheets. Roz marks the shared kitchen seam, or Carl knocks and chalks the old repair. Step through to B2 unit 10, hear Dee answer, and return along the marked wall. The board opens the intercom only when both resident records and the older-floor answer are kept.

C3.resetRun records phase, light source, service access, held/released door, chosen route, response sheet/answer, filed record, and marked/answered wall. No reset task farms trust, invents a claim, changes earlier work results, or adds a sixth vote. The intercom cites completed actions and real inspection results. The saucepan remains the final ordinary proof.

Stages and partial tasks survive reload. A chapter-five save without resetRun retains its old direct finale. HOME's guests follow accepted help and actual wall/home connections; a welcomed Ghost can visit, and the response copy stays by the radio. The original ending threshold remains three of five allies.

## Files
`rhart.js` (people, busts, furniture) / `rhcore.js` (state, THINGS I SAID, callbacks, HOME, NORMAL LIVING, HUD, pause, elevator) / `rhscenes.js` (all geometry) / `rhstory.js` (objective chain, lobby, ch1) / `rhstory2.js` (corridor, maintenance, ch2) / `rhstory3.js` (ch3-5, endings) / `rhinspection.js` (inspection phases, service puzzle, consequences) / `rhpolicies.js` (maintenance requests and quiet policy, access, indicators, physical outcomes) / `rhhome.js` (optional meals, radio visits, Ghost hosting/guide, household memories) / `rhletters.js` (mail objects, address observations, two deliveries, era art, witness receipts) / `rhreset.js` (reset checkpoints, neighbor actions, manual routes, response sheets, shared-wall crossing, testimony) / `rhmain.js` (boot, title, tracks). Loads CARL 3's engine files from `../carl3/` (see `rh/index.html`).

## Testing
`node tools/rhcheck.js` checks canceled repairs and retries, explicit speech invitations, inspection outcomes, the manual clock, maintenance and quiet-policy routes/access/results, save compatibility, all home preferences/broadcasts/Ghost choices, repeat rewards, mid-activity reload, Nell's reveal checkpoint, letter clues/hints/wrong addresses, both wall comparisons, witness rewards, legacy delivery routes, reset assistance/manual routes, stage reloads, outcome-based testimony, and connected finale guests.

`tools/rhplay.js` (full bot run: `INSPECT=all|rest|oven|water` for inspection preparation, default all; `WORK=do|help|override|ignore` for maintenance requests; `QUIET=exception|retract|suppress` for the household policy; `HOME=bea|orrin` opts into home visits, `HOST=company|helper|boundary`, `SERVE=quiet|knock|company|alone`, `RADIOCLUE=1`; `LETTERS=both|skip` for the optional drawing (bot default both), `MAILWRONG=1` for a wrong Q attempt, `MAILHINT=1` for all three requested hints; `RESETHELP=none|mixed` forces limited help at chapter five for fallback coverage; `STANDARD=1` for the standard form; policies `POLICY=do|admit|dbl`, `HONEST=1`, `NOCLAIM=1`, `QUESTION=0|1|2`, `EVICT=1`, `START=<json>`, `DUMP=<dir>`, `STOPCH=n`, `DRAW=1` to render every frame), `tools/rhreach.js` (reachability), `tools/rhshot.js` (screenshots), `tools/musiclint.js rh`.
The objective is a pure function of the flags (`objective()`), so saves and the bot always agree.

## Content pass (`rhextra.js`)
NORMAL LIVING's petty failures: from chapter 3, neighbors' doors refuse visitors the first time ("KNOCKING IS NOISE"); the mailroom denies a parcel from Dee to Roz (take it to her, or the system eats it); the lobby kiosk has a DIRECTORY where units go NOT FOUND while their residents remain; peeling wallpaper on floor 3 shows earlier versions of the building. Neighbors leave odd gifts at goodwill 3 (they show up in HOME). Carl is particular about his curtains. Dee's green pen draws a new height mark on Roz's wall. The chat ticker reacts when a claim closes.

## Extra rooms (`rhscenes2.js`, `rhstory4.js`)
All optional, all connected to the evidence/trust the finale uses.
- **Leasing office** (lobby, west door): Linda's cabinets and desk. From chapter 4 her RESET SCHEDULE is on the desk; copy it (wire puzzle) and Linda's patience in the intercom argument drops by 2.
- **The Lobby Diner** (lobby, west door): Bea's job. Cover her floor: remember three orders and pick the right plates. Trust with Bea; lore about the four 3:07 customers.
- **Model Unit 0** (the closed mall, chapter 4): the showroom. The Standard Resident #1 tag is Orrin's (a scene with Orrin follows), and the framed clause says occupancy means "being present and responding" (not HUMAN): another -2 patience in the argument.
- **B2 Unit 10** (Dee's room): after you mark Roz's wall with Dee's pen, the shared wall lets Roz and Dee talk through it. -1 patience, and Roz's trust.
