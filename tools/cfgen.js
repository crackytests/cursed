// CHROME FORCE portrait generation: Codex image generation for every manifest entry missing from cf/src/.
// usage: CFREF=a.jpg,b.jpg node tools/cfgen.js [only=name,name] [jobs=3] [list=1]
// CFREF = style reference sheets (16-bit tactics RPG portraits); they are only shown to the model, never copied into the repo.
// same mechanics as tools/shgen.js (codex can't write the repo, so the PNG is copied out of ~/.codex/generated_images/<session>/).
// then: python -I tools/cfconv.py  ->  cf/cfports.js
const { spawn } = require('child_process'), fs = require('fs'), path = require('path'), os = require('os');
const ROOT = path.join(__dirname, '..'), SRC = path.join(ROOT, 'cf', 'src'), GEN = path.join(os.homedir(), '.codex', 'generated_images');
const args = Object.fromEntries(process.argv.slice(2).map(s => s.split('=')));
const only = args.only ? args.only.split(',') : null, JOBS = +(args.jobs || 3);
const CODEX = path.join(process.env.APPDATA || '', 'npm', 'node_modules', '@openai', 'codex', 'bin', 'codex.js');
const REFS = (process.env.CFREF || '').split(',').filter(Boolean);

const LOOK = 'Character portrait for a 1993 Sega Genesis tactical RPG, drawn in the exact style of the attached reference sheets: 16-bit pixel art, a bust shot with the head and shoulders filling a square frame, bold dark outlines, an anime face with large expressive eyes, cel shading with short 3 or 4 tone colour ramps and hand-placed checkerboard dithering, limited palette of about 15 colours. ONE single portrait only (not a grid, not a sheet), a single flat solid-colour background, no text, no border, no frame. Square 1:1.';
const WORLD = 'The setting is a chrome space-opera world long after an apocalyptic war: knights are chrome centaurs with laser sabers; polished chrome armour reflects an 80s synthwave sunset (pale blue sky on the top half, a hard dark horizon line, burning orange below).';
const P = (s, bg) => [`${LOOK} ${WORLD} Background colour: ${bg}. Character: ${s}`];

// key = the speaker name used in dialogue (PORT), value = [prompt]
const M = {
  // ---------- the Chrome Force ----------
  DAX: P('DAX, a young centaur squire knight about 17, brave and earnest, messy chestnut hair under an open-faced chrome helmet with a small blue crest, blue cape over chrome pauldrons that reflect the sunset, the cyan glow of a laser saber hilt at his shoulder.', 'teal green'),
  BRONC: P('BRONC, a burly loud centaur knight in his thirties, mouth wide open mid-shout, big red moustache, gold chrome armour, a gold visor helmet pushed up with a red plume, a cocky grin.', 'red'),
  'SISTER STATIC': P('SISTER STATIC, a gentle nun whose whole head is a small old CRT television set: the screen shows a kind simple face (two dot eyes and a little smile) glowing pink with scanlines, a white nun habit and wimple around the TV, a small rabbit-ear antenna on top.', 'lavender'),
  'MR. BOOTH': P('MR. BOOTH, a ghost: a classic white bedsheet ghost with two eye holes, wearing black sunglasses over the eye holes and a sly showman smirk, an orange scarf, sitting in the hatch of a junky old mechanical walker.', 'deep blue'),
  LYN: P('LYN, an android woman of the swarm horde who walked away: pale porcelain skin with faint seam lines on her cheek and jaw, a long bright pink ponytail, calm determined grey eyes, a chrome collar, plain dark clothes.', 'dark purple'),
  SKIP: P('SKIP, an excitable 12-year-old kid wearing a chrome helmet three sizes too big that slides over one eye; the helmet is chrome armour first, with only a subtle hint of a hamburger in its shape (a rounded dome like a bun with a few small rivets like sesame seeds, a thin dark band and a thin wavy green-tinted trim at the rim); someone should only notice the burger on a second look, freckles, a huge grin, a teal scarf, rust-coloured padded vest.', 'yellow'),
  'BRO. TONE': P('BROTHER TONE, a calm monk in orange robes whose head is a boxy monitor showing a colour-bar test pattern instead of a face, a gold prayer-bead necklace, hands pressed together.', 'sky blue'),
  HARROW: P('HARROW, a weathered middle-aged centaur lancer, stubble, tired kind eyes, a rust-and-black helmet with curled ram horns, a teal scarf, armour scratched where an enemy crest was filed off.', 'olive green'),
  GORP: P('GORP, a small cheerful green alien courier: big round head, huge glossy black eyes, a backwards red cap, a little black necktie, a gold messenger badge, a satchel strap.', 'orange'),
  MOTH: P('MOTH, a shy ghost: a small white bedsheet ghost with big dusty grey-violet moth wings and fluffy antennae, peeking out from under the sheet, violet glow.', 'midnight blue'),
  RIVET: P('RIVET, a stocky grumpy glass miner, short beard full of glass dust, a jade-green welding visor flipped up on his forehead, brown work leathers, a big rivet gun on his shoulder.', 'tan'),
  VEXA: P('VEXA, a fierce young centaur rail-gun knight woman, tanned skin, a long green ponytail, a sharp smirk with one fang showing, jade chrome armour, a long rail rifle over her shoulder.', 'pale green'),
  KRANK: P('KRANK, a giant welder whose head is one huge round loudspeaker cone (no face, the cone vibrating with sound waves), rust-orange armour, a gold welding torch, shouting.', 'gold'),
  'DJ NULL': P('DJ NULL, a ghost DJ: a white bedsheet ghost wearing chunky headphones and dark sunglasses, teal neon light, a microphone, cool and relaxed.', 'black with teal glow'),
  PATCH: P('PATCH, a small floating nurse drone whose face is a round screen showing a red cross and two worried caring eyes, ivory white shell, a pink nurse cap, little mechanical arms holding bandages.', 'pink'),
  SKYE: P('SKYE, a confident jet-knight woman, short silver hair, a cyan visor, jade chrome armour, wings made from a crashed satellite dish and solar panels behind her shoulders.', 'bright blue'),
  'FR. FEEDBACK': P('FATHER FEEDBACK, an old priest whose head is a gold vintage speaker cabinet, purple priest robes and stole, a rosary of radio valves, raising a hand in blessing.', 'dark red'),
  SALT: P('SALT, a sea-weathered harpooner woman, dark tan skin, a blue bandana, a long brown ponytail, a thin scar across her nose, a harpoon gun over her shoulder, squinting confidently.', 'grey blue'),
  'BOLT-ON': P('BOLT-ON, a huge cheerful wasteland raider, a bone-white skull mask pushed up on top of his head, an orange mohawk, a wide happy grin with a missing tooth, rusty spiked shoulder armour.', 'burnt orange'),
  'OMNI-7': P('OMNI-7, a heavy industrial robot with a gold armoured head and one wide red visor slit for eyes, hazard stripes, rivets, a small corporate logo X on the chest.', 'steel blue'),
  DELTA: P('DELTA, a serene centaur warden woman in ivory and gold armour, short blonde hair, a gold visor raised off her eyes, a small relieved smile, a long rail rifle.', 'white and gold'),
  '404': P('404, a tiny round white robot with one huge camera eye and a tiny smile, a question-mark antenna, wobbly, happy and confused.', 'grey'),
  AIKO: P('AIKO, a hologram assistant girl, translucent teal-and-cyan light with scanlines, short bob hair, a headset microphone, smiling very hard on purpose.', 'dark teal'),
  HOWLER: P('HOWLER, a big armoured warhound: a scarred robotic wolf-dog with purple armour plates and a scratched collar tag, loyal steady eyes.', 'violet'),
  STITCH: P('STITCH, a gentle android medic woman with pale bone-white skin crossed by neat stitched seams, pink hair with teal tips, a thimble on every finger, a sewing needle like a scalpel, kind eyes.', 'mint green'),
  CINDER: P('CINDER, a small dragon whelp made of red chrome, big curious orange glowing eyes, little horns, puffing a tiny ember, cute.', 'dark orange'),
  'RONIN-9': P('RONIN-9, a stern samurai robot, an ivory helmet with tall red horns, a calm red glowing visor, a katana hilt over his shoulder, white ribbon.', 'crimson'),
  GREYMANE: P('GREYMANE, an old centaur knight, a long grey mane of hair and beard, black chrome armour with white trim, one milky eye, dignified and sad.', 'slate grey'),
  KAEL: P('KAEL, the BLACK VISOR, a young dark centaur knight in black chrome armour and a black helmet with a red visor covering his eyes, only his tense jaw visible, a red cape, the hilt of a laser saber.', 'blood red'),
  'THE PROJECTIONIST': P('THE PROJECTIONIST, a gaunt old mechanical walker robot whose head is a gold CRT showing two spinning film reels as eyes, a flat cap, film strip draped around his neck.', 'navy'),
  // ---------- allies in town ----------
  'MARSHAL OREN': P('MARSHAL OREN, an old centaur marshal, white beard and stern bushy eyebrows, gold chrome armour, a white cape, a fatherly frown.', 'dark green'),
  'LADY CASTELLAN': P('LADY CASTELLAN, a regal tired woman in ivory armour with green trim, braided dark hair, a glass crown, sleepless dark circles under her eyes.', 'jade'),
  // ---------- bosses ----------
  'CAPT. VRESS': P('CAPTAIN VRESS, a cruel black-chrome centaur officer, curled horns on his helmet, orange glowing eyes in the visor slits, a sneering scarred mouth.', 'dark orange'),
  GLASSJAW: P('GLASSJAW, a hulking brute whose lower jaw is a cracked block of green glass, red horned helmet, small mean eyes.', 'green'),
  'WARDEN KROLL': P('WARDEN KROLL, a huge jailer in black armour, a gold visor, a ring of keys on his chest, a heavy stubbled chin.', 'dark grey'),
  'THE REPEATER': P('THE REPEATER, a haunted walker machine with an old CRT head showing a green ghostly face mouthing the same word, tangled antennas, static.', 'black with green glow'),
  'THE ANCHOR': P('THE ANCHOR, a giant news-anchor machine: a big CRT head showing a grinning newsreader face, a purple suit with shoulder pads, a desk microphone, cold green glow.', 'purple'),
  'CAPTAIN ASH': P('CAPTAIN ASH, a sky-pirate captain woman, wild ash-grey hair, a black tricorn, tan skin, a gold tooth grin, an axe on her shoulder.', 'ash grey'),
  'FOREMAN-9': P('FOREMAN-9, an industrial foreman robot, a yellow hard hat, a red visor, a clipboard, hazard stripes, smoke stacks behind its shoulders.', 'rust red'),
  'THE AUDITOR': P('THE AUDITOR, a smooth ivory android with a single gold camera eye instead of a face, gold collar, a ledger, a thin cold blade.', 'cream'),
  'ASSESSOR ZERO': P('ASSESSOR ZERO, a floating ivory sphere with one huge gold eye and rings of gold light segments around it, cold and serene.', 'white'),
  GUTTERMOUTH: P('GUTTERMOUTH, a grotesque lumpy mass of fused scrap and bone with an enormous toothy mouth and a skull face, red glow, hungry.', 'dark red'),
  'MOTHER MATERIA': P('MOTHER MATERIA, a horrifying matriarch android made of many fused porcelain body parts, a huge tangle of pink fibre-optic hair, bone-white cracked skin, an eerie loving smile.', 'magenta'),
  'BLACK VISOR': P('the BLACK VISOR, a menacing dark centaur knight in black chrome armour, a black helmet with a glowing red visor slit hiding his eyes, a red cape, a laser saber raised.', 'black'),
  'KING HALLAN': P('KING HALLAN, an old centaur king in gold and purple armour, a horned crown, a grey beard, eyes blank and glowing violet as if possessed.', 'violet'),
  'THE CURATOR': P('THE CURATOR, a huge museum archive machine: one enormous violet eye in a dark frame, cables and glass display cases around it, holographic labels, a throne of cables.', 'deep purple'),
  'THE WARDRAGON': P('THE WARDRAGON, a colossal black chrome war dragon head built from welded weapons, tank barrels, a CRT screen glowing in its throat, pink and red glowing eyes, roaring.', 'black and red'),
};

// ---------- promoted portraits (key 'NAME+'): the member's own base painting goes in as the first reference image ----------
const PR = (name, cls, bg, s) => [`${LOOK} ${WORLD} Background colour: ${bg}. PROMOTED PORTRAIT: the FIRST attached image is ${name}'s current portrait. Paint the SAME person -- same face, same species and head design, same hair, same signature colours, same background colour -- instantly recognisable, now promoted to ${cls}: a seasoned veteran, more distinguished, composed and confident, a little older and wiser, better equipment. Changes: ${s}`, name];
const PROMO = {
  'DAX+': PR('DAX', 'NOVA LORD', 'teal green', 'a full closed-crown chrome helm with a tall blue plume and a star emblem, a richer royal-blue cape with gold trim, heavier ornate pauldrons, a steady leader\'s gaze, a few years older, faint scar on the cheek.'),
  'BRONC+': PR('BRONC', 'PALADIN', 'red', 'polished ornate gold armour with engraved filigree, a white tabard with a red sun crest, the big red moustache now groomed and waxed, a proud booming grin, a gold laurel on the helmet.'),
  'SISTER STATIC+': PR('SISTER STATIC', 'VICAR', 'lavender', 'the same CRT-television head and kind dot-eyed screen face, now in a tall white-and-gold vicar headdress, a gold-embroidered stole, a halo of soft pink scanline light, the antenna now gold.'),
  'MR. BOOTH+': PR('MR. BOOTH', 'WIZARD', 'deep blue', 'the same sheet ghost with sunglasses, now wearing a tall starry wizard hat and a deep-blue cloak with gold stars, a long orange scarf, holding a glowing plasma orb, a showman\'s grand smirk.'),
  'LYN+': PR('LYN', 'PRIMA', 'dark purple', 'the same porcelain android face and seam lines, the bright pink ponytail now longer and braided with fibre-optic light, sleek ivory-and-chrome armour plates, a regal composed stare, a thin silver circlet.'),
  'SKIP+': PR('SKIP', 'MASTER', 'yellow', 'a couple of years older, the same freckles and grin but calmer and focused, the chrome burger-ish helmet now fits properly and has a teal headband tied around it, a black-and-teal martial artist gi with the teal scarf.'),
  'GORP+': PR('GORP', 'SNIPER', 'orange', 'the same cheerful green alien with huge black eyes, now a backwards red cap with a gold sniper scope clipped to it, a long sniper rifle over the shoulder, a medal on the messenger satchel, a cool squint.'),
  'VEXA+': PR('VEXA', 'STORM RIDER', 'pale green', 'the same green ponytail and one-fang smirk, now jade chrome armour with lightning-bolt engravings and a storm-grey cape, a crackling rail rifle, small electric sparks in her hair.'),
  'KRANK+': PR('KRANK', 'GLADIATOR', 'gold', 'the same giant loudspeaker-cone head, now with a gold laurel crown around the cone and gladiator plate armour with a lion-face chest plate, a champion belt, a gold axe.'),
  'SKYE+': PR('SKYE', 'SKY LORD', 'bright blue', 'the same short silver hair and cyan visor, now grand wings of polished satellite dishes and gleaming solar feathers, a white-and-jade command cape, a gold insignia, commanding.'),
  'FR. FEEDBACK+': PR('FR. FEEDBACK', 'VICAR', 'dark red', 'the same gold speaker-cabinet head, now draped with a gold-embroidered cope and a tall purple mitre over the cabinet, the rosary of glowing radio valves, a dignified blessing pose.'),
  'AIKO+': PR('AIKO', 'ORACLE', 'dark teal', 'the same translucent teal hologram girl with the bob haircut and headset, now longer flowing hologram hair, a serene genuine smile, a crown of floating light rings, starry data patterns in her eyes.'),
  'HOWLER+': PR('HOWLER', 'DIREHOUND', 'violet', 'the same robotic wolf-dog and scratched collar tag, now bigger and grizzled, heavier purple armour plates with spikes, a glowing violet eye, a silver muzzle, calm and fearsome.'),
  'HARROW+': PR('HARROW', 'PALADIN', 'olive green', 'the same weathered face, stubble now a short grey beard, the ram-horned helmet repaired and polished, a new crest of his own painted where the old one was filed off, teal scarf, an honest proud look.'),
  'BRO. TONE+': PR('BRO. TONE', 'ABBOT', 'sky blue', 'the same boxy monitor head showing colour bars, now a deep saffron-and-gold abbot robe with a heavy gold prayer-bead necklace, a small gold halo ring floating above the monitor.'),
  'RIVET+': PR('RIVET', 'HEAVY GUNNER', 'tan', 'the same grumpy bearded glass miner and jade welding visor, now a heavy brass-plated armour vest, a huge multi-barrel rivet cannon on his shoulder, ammo belts, a grudgingly proud frown.'),
  'MOTH+': PR('MOTH', 'SKY LORD', 'midnight blue', 'the same small white sheet ghost, now with great luminous moth wings patterned with silver eyespots, fluffy glowing antennae, a tiny silver crown, no longer shy -- peeking out fully and smiling.'),
  'DJ NULL+': PR('DJ NULL', 'WIZARD', 'black with teal glow', 'the same sheet ghost with chunky headphones and sunglasses, now a tall wizard hat covered in teal equalizer lights, a cloak of vinyl records, the microphone glowing like a staff.'),
  'PATCH+': PR('PATCH', 'VICAR', 'pink', 'the same floating nurse drone with the round screen face and worried caring eyes, now a gold-trimmed shell, a gold-and-pink head nurse cap with a small cross, more arms holding glowing bandages, calmer eyes.'),
  'SALT+': PR('SALT', 'SNIPER', 'grey blue', 'the same dark tan woman with blue bandana, brown ponytail and nose scar, now a captain\'s long coat, a scoped long harpoon rifle, a gold anchor earring, a calm confident squint.'),
  'BOLT-ON+': PR('BOLT-ON', 'GLADIATOR', 'burnt orange', 'the same big happy raider with the skull mask pushed up and orange mohawk, now polished bronze gladiator armour over the rusty spikes, a champion\'s red sash, the same gap-toothed grin.'),
  'DELTA+': PR('DELTA', 'STORM RIDER', 'white and gold', 'the same short blonde hair and gold visor raised, now ornate ivory-and-gold armour with lightning engravings, a storm-blue cape, a crackling rail rifle, a free, warm smile.'),
};
for (const k in PROMO) M[k] = PROMO[k];

if (args.list) { console.log(Object.keys(M).length, 'entries'); process.exit(0); }
fs.mkdirSync(SRC, { recursive: true });
const file = k => path.join(SRC, k.replace(/[^A-Z0-9]+/gi, '_').toLowerCase() + '.png');
fs.writeFileSync(path.join(SRC, 'names.json'), JSON.stringify(Object.fromEntries(Object.keys(M).map(k => [path.basename(file(k), '.png'), k])), null, 1)); // for cfconv.py
const want = Object.keys(M).filter(k => (!only || only.includes(k)) && !fs.existsSync(file(k)));
console.log('to generate:', want.length, want.join(' | ') || '(none)');
function one(name) {
  return new Promise(res => {
    const [prompt] = M[name];
    const a = ['exec', ...(process.env.CXMODEL ? ['-m', process.env.CXMODEL] : []), '-c', 'model_reasoning_effort=low', '--skip-git-repo-check', '-s', 'read-only'];
    const own = M[name][1] ? [file(M[name][1])] : []; // promoted portraits: the member's base painting first
    for (const r of [...own, ...REFS]) a.push('-i', r);
    if (REFS.length || own.length) a.push('--');
    a.push(`Use your built-in image generation tool to create exactly ONE image from this prompt, then stop (do not try to save or copy files${own.length ? '; the first attached image is the character to repaint, the others are only art-style references' : REFS.length ? '; use the attached images only as the art-style reference, do not copy their characters' : ''}). Prompt: ${prompt}`);
    const t0 = Date.now();
    const p = spawn(process.execPath, [CODEX, ...a], { cwd: SRC, stdio: ['ignore', 'pipe', 'pipe'] }); let out = '';
    p.stdout.on('data', d => out += d); p.stderr.on('data', d => out += d);
    p.on('close', () => {
      const m = /session id:\s*([0-9a-f-]+)/.exec(out), dir = m && path.join(GEN, m[1]);
      const f = dir && fs.existsSync(dir) && fs.readdirSync(dir).filter(x => x.endsWith('.png')).map(x => path.join(dir, x)).sort((a, b) => fs.statSync(b).mtimeMs - fs.statSync(a).mtimeMs)[0];
      if (f) { fs.copyFileSync(f, file(name)); console.log('ok', name, ((Date.now() - t0) / 1000 | 0) + 's'); }
      else console.log('FAIL', name, out.slice(-400).replace(/\s+/g, ' '));
      res();
    });
  });
}
(async () => { const q = want.slice(); await Promise.all(Array.from({ length: JOBS }, async () => { while (q.length) await one(q.shift()); })); console.log('done'); })();
