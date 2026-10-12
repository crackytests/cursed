# EYE OF THE BEHOLDEN II: THE LEGEND OF DARK MONDAY — design

A clone of *Eye of the Beholder II: The Legend of Darkmoon* (first-person, grid-stepped, real-time party crawler) starring the stream cast, built on the **68k-x** engine from `J:\games\neomonday\x68.js`. Presented as a lost 1992 X68000 port of an unlicensed American dungeon crawler, "PRETEND CO. SOFT". Status: **design only, nothing built.** Everything marked *(new)* is adaptation, not canon; characters follow their bibles in the repo root.

Look: a **sword-and-sorcery world made of light** (TRON crossed with retro-futurist high fantasy), see 2b. Working title is a pun: a *beholder* is an eye monster, the *Beholden* is an eye that watches you owe it (spooky alimony). Darkmoon becomes Dark Monday. Change the name freely.

## 1. Where it lives
- New folder `dm/` in this repo, with `index.html`. Copy `x68.js` and `fm.js` from neomonday into it (neomonday stays untouched; Pages needs the files in this repo).
- Files: `dmgfx.js` (first-person renderer), `dmgame.js` (party, combat, spells, items, doors), `dmdata.js` (levels), `dmart.js` (portraits, monsters, items, wall textures), `dmstory.js` (quest, banter, endings), `dmmusic.js`.
- Tools (modeled on neomonday's `tools/`): `dmvm.js` headless loader, `dmplay.js` bot, `dmreach.js` level solvability, `dmshot.js` screenshots, `dmlint.js` text and glyph lint.

## 2. What the 68k-x gives us, and what is new
Reuse as is: 512x256 framebuffer at 4:3 (tall pixels), 12-bit color with Bayer dither (`gradV`, `blob`, `glow`), `polyF`, `offscreen`/`blit`, 5x7 font, `say`/`choose`/`panel`, `CAST` portraits and voices, fade/shake/tint, FM synth, `store`/`fetchStore`.

New:
- **`dmgfx.js`, the dungeon view.** Classic EotB slot rendering: camera at the middle of a cell edge, 4 depths, 5 columns. Draw back to front per visible cell: floor and ceiling bands (dithered gradient darkening with depth), side walls as `polyF` quads, front walls as rects, brick or panel texture generated procedurally per theme and shaded by depth, then decorations on wall faces (switch, niche, alcove, rune slab, sign, door frame, gate, pit hole, stairs). Movement snaps, so the **static layer is cached into an offscreen buffer and redrawn only when position or facing changes**. Monsters and effects are drawn over it every frame.
- **Scaled sprites.** Monsters are drawn once at full size via `offscreen`, then nearest-neighbor scaled per depth (1.0, .66, .45, .3). Add one `blitScaled(b, cx, baseY, k, flip)` helper to `dmgfx.js`.
- **Pointer input.** x68.js is keyboard and pad only. Add mouse as the primary scheme, EotB-style (click the arrow pad, hands, spell names, inventory slots), and keep the existing keyboard path as the full alternate: arrows move and turn, `C` toggles a free cursor you move with the arrows (like neomonday's sight), `Z` clicks, `X` cancels, `Tab` is the party menu. The bot uses the keyboard path.
- **Screen layout** (512x256 logical; the dialogue panel already sits under `VH = 176`):

```
+------------------------------+----------------------------+
| 3D view   248 x 160          |  CARL    LINDA             |
| (8,8)                        |  [por]   [por]   hp bars   |
|                              |  GHOST   JB       hands x2 |
|                              |  [por]   [por]    per char |
+--------------+---------------+----------------------------+
| arrow pad    | compass, food | party chat / message panel |
+--------------+---------------+----------------------------+
```
  Front row = top two portraits, back row = bottom two. Click a portrait for its inventory/stats overlay (full-screen `panel`).

## 2b. The look: TRON meets sword and sorcery *(new)*
**The conceit.** The temple is not stone. It is a program: a lit-vector fantasy world running on the Mall of the Future's system, so the dungeon is a **grid-world with a high-fantasy skin**. Think the movie *Tron*'s black glass and light-lines, crossed with 70s and 80s paperback and airbrush sword-and-sorcery (Frazetta muscle and sky, chrome armor, twin moons, a barbarian standing on a cliff over a neon sea). Retro-futurism that believes it is a myth. Fantasy words, circuit shapes: "spell" and "program" are the same menu item; a "rune" is a glowing glyph; the gods are administrators.

**Why it fits.** The party's own canon is half machine already (Face's backed-up mind, Linda as a posthuman system, JB as a backup of a dead detective, Yoko as the assistant, Ghost as the soul in the system). Entering a world made of light is the natural place for them to be. It is also a plain EotB clone, because both are grid dungeons: the grid is now visible.

**Dungeon rendering (`dmgfx.js`).**
- Walls and floors are **near-black glass** (12-bit navy/violet/charcoal, dithered toward black with depth) with **bright edge lines**: each wall quad gets a 1px neon outline and a faint inner panel line, drawn with `lineF` after the `polyF` fill. Floor tiles are a perspective grid: lines converge to the horizon, brightest at the near edge.
- **Depth is fog in light:** distance dims the neon and shifts it toward the horizon color (a Bayer-dithered blend with `mix`), so far cells read as a glow at the end of a corridor.
- **Light sources** use `glow` (additive): torches become **plasma braziers**, doors have lit seams, a pit is a downward light-well, a teleporter is a ring of rotating segments, a pressure plate is a lit tile that changes color when stepped on.
- **Per-theme palettes** (all 12-bit): cellar = amber and rust on black; tunnels = cyan and teal; dance floors = magenta and yellow checker; server crypt = icy blue; glyph library = violet and gold; armor yard = orange and chrome grey; furnace = red-orange over a heat dither; road below = a painted sunset ceiling; sanctum = a black sun ringed by a calendar, white and gold.
- **Texture is shape, not noise:** brick becomes circuit traces and hexagon panels, carvings become glowing runes (the same glyph font family, drawn as lines). Walls with writing glow the writing.
- **Sky exceptions.** Outdoor-ish levels (the diner at the top, the road below) draw a **retro-futurist sky** in the view: dithered sunset gradient, two moons (one is a ringed planet), a distant chrome city or ziggurat silhouette, a grid horizon.

**Monsters and items, re-skinned.**
- Monsters are **sculptures of light and chrome**: dark body fill, a rim light (magenta left, cyan right, using `blob`'s `rimL`/`rimR`), glowing eyes. The same parodies, but bigger and more mythic: INTERNS in cheap chrome masks, COLLECTORS as armored sentinels with sword-shaped pens, PHONE SPIDERS as wire-legged arachnids, MIDDLE MANAGERS as hooded floating priests with a halo of windows, VENDING GOLEMS as ziggurat idols, SHEETS as holograms that flicker, THE BEHOLDEN as a giant eye in a ring of ten light-stalks.
- Weapons: **energy-edged swords, axes and bows** with fantasy names (the BONG becomes a **plasma bong-horn**), armor as glossy plate, spellbooks as **data discs / glowing tomes**, lasagna a food cube. The BONG-FX and ECTO-FX chips are glowing cartridges.

**UI chrome.** A new `UI` palette over `x68.js`'s panel: black glass panels with a thin cyan outer line, a magenta inner line, and an orange highlight (replaces the default blue). Portraits are **bust shots in a rim-lit circle/hex frame**, HP/mana bars are light tubes, the compass is a dial, hands are lit slots. Banners look like a title card: wide letter-spacing, gradient chrome text (a `gradV` clipped to the glyphs).

**Spells and effects.** Spells are **beams, rings and grid distortions**: a MEMO is a thin beam, SYNERGY a hex shield ring that spins, REBOOT a vertical scan line that rebuilds a character from the feet up, PHASE a dither-dissolve through a wall, HOSTILE TAKEOVER a cyan wire reaching from Linda to the monster. Damage numbers are small pixel digits. Screen flash uses `post.flash` and tint; deaths **derezz** (pixels peel off in rows).

**Sound** (FM, via `fm.js`). Synth strings and brass fanfares in a minor key, arpeggiated bass, big gated drums on fights, sparse choir pads for temples. A theme per level at its own tempo: the cellar is slow and lonely, the dance floors disco, the server crypt cold and ticking, the furnace industrial, the sanctum slow and enormous.

**Rules that keep it readable.** Walls, doors and levers must stay distinguishable at a glance (doors have a lit seam and handle, levers a bright knob, walls only an edge). Keep the neon to two accent colors per level so a corridor does not become noise. Never rely on color alone: switch states also change shape.

## 3. Systems (the clone checklist)
- **Party.** Four chosen at the start from six, up to two recruits later (six total). Two ranks: front two melee, back two get hit less and can cast or throw but not melee.
- **Real time.** Each hand has its own cooldown bar. Monsters step toward you and attack on their own timers. Pausing happens only in menus.
- **Hands, body, pack.** Two hand slots, plus head, neck, body, belt, boots, two rings, and a 14-slot pack. Weapons have speed and damage; armor lowers incoming damage.
- **Spells.** A spell list per caster by level (see section 4), memorized when you rest, spent when cast. Cast from the spell page of a character's overlay.
- **Food.** A meter per character. Eat or starve. Rations are **LASAGNA** (JB: "it's a food group"); about one in forty is a mimic *(new)*.
- **Rest.** Camp to heal and re-memorize; interrupted by wandering monsters.
- **Dungeon furniture.** Keys and locks, levers, pressure plates, pits, teleporters, spinners, secret doors, wall niches and gem sockets, locked chests, darkness squares (need a light), wall writing, one-way doors, monsters that guard a square, wandering patrols.
- **XP and levels.** Per character, class-based, up to level 8 in a 9-level game.
- **Death.** A fallen member is carried (still in the pack of the party); revive at a shrine or with **Face's REBOOT**. Total party wipe loads the last save.
- **Saves.** Anywhere, to `dm_save` (three slots) in localStorage via `store`.
- **Map.** Off by default: **RETAIL MODE**, as in the original, draw your own. The **JB's NOTEBOOK** option turns on an automap and tick marks.
- **Cross-cart import** *(new, mirrors EotB II importing party members)*: on the party screen, "IMPORT FROM CARTRIDGE" reads `carl_meta`, `linda_meta`, `ghost_meta`, `sg2_meta`, `carl2_meta`, `yoko_meta`, `face_meta` and `px` saves. A finished game gives that character a small starting bonus and an in-joke line (details in section 4).

## 4. The cast as a party
All six are playable at the start screen. Quirks live on top of a normal class so the player can read the build.

| Character | Class | Gimmick | Spells / skills |
|---|---|---|---|
| **CARL** | Fighter | Throws a BONG for a ranged hit that can be picked up again. Insists he is human; every NPC calls him "the human" with a pause. Carries PROP PILLS (cheap healing). | skill: SHOVE (knocks a monster back a square) |
| **CEO LINDA** | Mage | Spells are corporate. Her hands are not slots: she holds one memo and one phone. | MEMO (missile), SYNERGY (buff), RE-ORG (swap two monsters), ACQUISITION (charm), HOSTILE TAKEOVER (dominate). She never says please. |
| **SPOOKY GHOST** | Rogue / Mage | Fragile. **PHASE:** walks through a *thin* wall one cell deep (costs a charge; thick walls and doors stop him). Does a "good evening" before each cast. Can't hold items well: his equipment "is on the bar". | SCARE (turn effect on sheets and the dead), SHAKEN (speed), A GOOD ENTRANCE (stun) |
| **JB GARFIELD** | Ranger / Thief | THINK key: noir narration that reveals secret doors, and a hint about the level (his real recap, like neomonday). Eats lasagna at no food cost. Disarms by deduction, is wrong once per level with consequences. | skill: TAIL (see wandering monsters on the map), DEDUCE (find hidden things) |
| **FACE** (New Face) | Cleric / Engineer | Operates consoles and machines; **REBOOT** revives anyone without a temple, one use per rest. Doesn't remember the old partnership (bible). Over-curious: has a "WHAT DOES THIS DO?" button on levers that can help or hurt. | REBOOT, BACKUP (heal), PATCH (cure poison and held) |
| **YOKO** | Cleric / Mage | **TRANSLATE** reads wall glyphs, scrolls and enemy names; some walls are unreadable without her. Her assistance buffs the party, and she can refuse an order once per level *(new)*, which the game plays straight. | TRANSLATE, ASSIST (buff), SECOND CHANCE (heal + cure) |

**Recruits** *(new)*: **PEE KID** (small, fast, fits through crawlspaces that block the party), **PILOT X** (never confirms who he is; his hints are free but each costs "spoiler" meter, and a full meter makes him go silent; Ghost doesn't know him). **TP** is outside the lore, so he is not a recruit. At most he is one optional gray shop alcove on level 4 selling "a cheaper version of this game".

**Cartridge bonuses** (flavor, tiny): finished CARL → Carl starts with an extra BONG; GHOST 2 stayed → Ghost's first line is "I stayed. Mostly."; FACE → REBOOT starts with 2 uses; YOKO true ending → TRANSLATE costs nothing at level 1.

## 5. Story: THE LEGEND OF DARK MONDAY *(new)*
**Hook (surface, a town hub).** At GARF'S DINER out in the desert, Garf (JB's friend and the diner's owner) says a door appeared under the freezer on Sunday that wasn't there Saturday. It hums. Customers who go down don't come back until a Monday, and then they come back owing money to nobody. The party is sent down by whoever the player's first character is; the quest-giver voice is Garf plus a **notice from the Sequel Committee** (the shared joke): "THE TEMPLE HAS BEEN ASSIGNED A SEQUEL. PLEASE SURVIVE."

**The threat.** The **TEMPLE OF DARK MONDAY**: a cult that sells obligations. Everyone who owes something, a promise, a call, a debt, can be bought by the temple, and the temple's god is **THE BEHOLDEN**, an enormous eye with a stalk per unpaid thing. It doesn't hate anyone. It just keeps count. The cult wants it to be Monday forever, because on Monday everything is still owed.

**Structure.** Nine levels, in three chapters, each an EotB-style descent with a keystone ("IOU") needed for the next gate.

| Lvl | Name | Look | Set-pieces and monsters |
|---|---|---|---|
| 1 | **GARF'S CELLAR** | Pantry shelves and freezers dissolving into glowing grid lines, amber on black | Tutorial: lasagna, first door, first lever, INTERNS (swarm, weak). Garf's note in a niche. |
| 2 | **THE SERVICE TUNNELS** | Mall pipes as cyan light-conduits | Pressure-plate loop, a spinner room, PHONE SPIDERS (poison: "on hold"). Carl's bit: the A.S.S. is parked in a side room. |
| 3 | **THE DANCE FLOORS** | Magenta and yellow checker floor over an infinite black | Patrols of COLLECTORS (shoulder pads; they "serve" you and hold a character), a rhythm door (step on tiles in beat order). Ghost: SCARE works on SHEETS (fake ghosts). |
| 4 | **THE SERVER CRYPT** | Icy racks like a tomb of towers | Consoles for Face, MIDDLE MANAGERS (a Meeting paralyzes a character). Optional TP shop. First boss: **THE COLLECTOR PRIME**. |
| 5 | **THE GLYPH LIBRARY** | Violet and gold walls of glowing script | Yoko's level: untranslated runes decide which doors open. CUBICLE ZOMBIES that regenerate on Mondays (stop when you break a calendar). |
| 6 | **THE LICENSED ARMOR YARD** | Chrome idols on assembly lines, orange | VENDING GOLEMS and LICENSED ARMOR (from CARL 2), a crushing-press puzzle. Pee Kid's crawlspace shortcut. |
| 7 | **THE FURNACE** | Heat-dithered reds, a forge of light | Linda's level: her old Fascism Inc. floor, a darkness section, mimic lasagna, second boss: **THE HR VEIL**. |
| 8 | **THE ROAD BELOW** | A retro-futurist sunset sky with two moons | Open halls, the reel room, a memory-door where each party member must answer something true (flavor, no stats). Pilot X appears. |
| 9 | **THE SANCTUM OF DARK MONDAY** | A black sun ringed by a calendar, white and gold | Final fight: **THE BEHOLDEN**, ten stalks, each a status effect named for an unpaid thing; kill stalks to weaken it. |

**Banter** *(new)*: first time the party enters a level, a short exchange (2 to 4 lines, portraits, `say`) between two or three present members, picked from who is in the party. No more than one unskippable beat per level; a `Tab` menu entry "THE PARTY TALKS" replays them. Character rules: Carl deflects and argues; Linda is right and abrasive; Ghost does the voice; JB narrates and is interrupted by a practical fact; Face asks "what does this do"; Yoko helps and says when she won't.

**Endings** (three, chosen at the Beholden):
1. **COLLECT**: kill it. Dark Monday ends; every IOU in the temple is called in at once. It goes badly for the NPCs. Garf's diner is full of people owing a lot.
2. **FORGIVE THE DEBT**: needs all keystones plus the level 8 memory-door answers. Nothing is owed. It's very quiet, and it's Tuesday.
3. **TAKE THE JOB**: sign for it. The party sits on the eye's chair; the credits are a payroll run. A bad ending that plays like a good one.

## 6. Monsters and items (parody pairs)
- Kobold → **INTERN**; skeleton → **COLLECTOR**; zombie → **CUBICLE ZOMBIE**; giant spider → **PHONE SPIDER**; leech → **LASAGNA LEECH**; mind flayer → **MIDDLE MANAGER**; golem → **VENDING GOLEM**; wraith → **SHEET**; beholder → **THE BEHOLDEN**.
- Items: PROP PILLS (heal), the **BONG-FX chip** (does nothing, on purpose), the **ECTO-FX chip** (does something, nobody says what; it's a real stat), memo, sigil chalk, lasagna, towel (a real item: it lets you wipe the wall decoration that hides a switch).

## 7. Build plan
1. **Vertical slice (renderer + level 1).** `dmgfx.js` with cached static layer; move, turn, doors, levers; party panel; one monster; save. Bot walks level 1 start to stairs. *Exit test:* screenshots look like a dungeon in 4096 colors and the bot clears level 1.
2. **Systems.** Combat with cooldowns, inventory, items, spells, food, rest, XP, recruits, import screen. Unit-ish tests in `dmplay.js`: fights resolve, spells apply, death and revive work.
3. **Content.** Levels 2 to 9, banter, bosses, endings, music per level. `dmreach.js` flood-fills each level with keys and levers to prove every keystone is reachable.
4. **Polish.** Text and glyph lint, real-Chrome pass (rAF freezes in background tabs, step frames by hand, as with neomonday), HANDOFF and memory entries.

**Size note.** This is bigger than any single prior cart: a renderer plus nine hand-laid 32x32 levels. The vertical slice is the right first milestone; I'd re-scope to 6 levels if content slips.

## 8. Decisions I made (say the word to change any)
1. **Name:** EYE OF THE BEHOLDEN II: THE LEGEND OF DARK MONDAY.
2. **Roster:** six playable, two recruits, TP only as a gray shop alcove.
3. **Villain:** an original parody (the Beholden), not the Curse or Evil Yoko.
4. **Input:** mouse-first like the original, with a complete keyboard path.
5. **Location:** new `dm/` folder, engine copied from neomonday.
6. **Map:** off by default (RETAIL MODE), notebook map as an option.
7. **Look:** the temple is a program, a grid-world in a sword-and-sorcery skin (see 2b). Light-edged glass walls, plasma braziers, rim-lit chrome monsters, beam spells, derez deaths.
