# NEO MONDAY: The Cat Who Knew Too Little

A JB Garfield case, built as a lost X68000-era adventure (Snatcher-style). Open `index.html`. No build step.

- **Display:** 512x256, shown at 4:3 so pixels are tall; 12-bit color; ordered-dither gradients; FM sound (`fm.js`, reused from the PRETEND CO. synth).
- **Controls:** arrows move the cursor/sight, Z or Enter = A (confirm / fire), X = B (back / slow aim), F = fullscreen.
- **Play:** LOOK, INVESTIGATE, ASK, MOVE, THINK (a real recap of what is known, what does not fit, and where to go), PHONE, ITEM. Three light-gun sections.
- **Story:** JB wakes in a freezer with two percent of a memory. The COPYCATS (machines that wear people) are grown on a lasagna line. The mystery is also JB's own: he is the backup of a dead human detective, J.B. Harold. Three endings: MERGE, DELETE, KEEP GOING. AS ME.
- **Case 2, THE STATIC** (unlocks after any case-1 ending, from the title): a pirate station called JB GARFIELD FM is looping the city's Monday with JB's own voice. Four new scenes (powder warehouse, jail, radio studio, tower roof), four new characters, four more fights, a safe whose combination is the day that never happens, and a finale where you win by saying something true on air. Three endings: TUESDAY, LIVE, MONDAY FOREVER.
- **Enemies:** copycats (head shots double), hovering drones (one hit, keep harassing), brutes (armored, slow, take a lot), and bosses. Nine fights in all.
- **Files:** `x68.js` engine, `art.js` portraits (lit with magenta/cyan rim lights), `scenes.js` backdrops + animation, `gallery.js` shooting, `art2.js`/`scenes2.js`/`acts2.js` case 2 and the extra fights, `story.js` core/hub/THINK/title, `acts.js` the case.

## Tests (node)
- `node tools/test.js`: plays all three endings through the real scene code (dialogue stubbed, fights played frame by frame by a bot), checks wrong-evidence handling, runs every verb, lints every spoken line for glyphs the font cannot draw, and checks that music loops evenly.
- `node tools/scenes.js`, `node tools/play.js <name> "<js>" [frames]`: screenshots into `tools/shots/`.
- `node tools/serve.js`: static server on :8732 for a real-browser check (a background tab freezes rAF, so step frames by hand).

## Adaptation notes (from `JB_GARFIELD_CHARACTER_BIBLE.md`)
JB wants the case solved and wants to look cool solving it; the noir stays specific; he earns some deductions and is wrong once (the bartender) with evidence that exposes it; his name never opens a door ("credit denied"); lasagna and Mondays do something in the scene. The identity mystery is the spine, not the only subject. The setting, cast (Kuma, Vane, Soto, Lucky) and the copycat premise are original; nothing here is part of the PRETEND CO. continuity.
