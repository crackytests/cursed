# FACE & YOKO — the last two SUPER-16 games

Design notes for the penultimate and ultimate games of Generation 2. Read `HANDOFF.md` first, then `THE_FACE_CHARACTER_BIBLE.md` and `YOKO_CHARACTER_BIBLE.md`.

## The pair in one sentence each

- **FACE: What Could Happen** (`face/`) is a loud, fast horizontal shoot-'em-up. You have total control, and everything you touch becomes fuel. At the very end, the game takes your controller away.
- **YOKO: What Happened** (`yoko/`) is a quiet menu-driven adventure with turn-based battles in which **you never control anyone directly**. Yoko assists, translates, suggests, restores and, when she has to, overrules. At the very end, the game hands you the controller.

The two games mirror each other mechanically. Face acts on everything and ends up with nothing to act on. Yoko acts through other people and ends with the one decision that is hers.

## Why these genres

Face (from the bible) sees an ordinary thing, imagines what it could become, and builds a machine before anyone agrees on the consequences. He is a host, an inventor and a floating head, so he gets:
- a shmup where he *is* the machine;
- ordinary mall junk and chat messages that he turns into potential;
- Gradius-style form swapping, because merging with other Faces is "like collecting powers in a game" (bible F14).

Yoko is the assistant whose help has consequences. Her voice is precise, her power is other people, and her question is when helping means overruling. She gets:
- a Snatcher / Jinguji Saburo style adventure (her source game is the Jinguji detective series, and JB Garfield is the detective);
- side-view JRPG battles where the party acts on its own AI and she is support only.

## The single meta story

1. **PEE KID³** ended with "SEE YOU NEXT GENERATION." The `???` voice at the third generator ("THREE OF THEM. NOW I CAN SEE ALL OF YOU.") is the triangulation that lets Evil Yoko find the system (PK bible P4).
2. **FACE.** The SUPER-16 generation is ending. Last time, everyone in Gen 1 was left behind in four shades. New Face swears *nobody gets left behind this time* and builds the Next Generation. He merges with his other selves (Old Face at the Lost & Found, Pilot X in Ghost's territory, Dyslexio at the generator, Backup Face in the archive). Along the way he takes a sponsor, borrows Ghost's travel math, uses the kid's potential, and learns from an incident file that his "uncannily compatible" Yoko core is **Prototype 1: the original Yoko**, the one Old Face cut in half and exiled to the Mandolin reality. The machine needs a soul. Whatever he feeds it, the power spike completes the triangulation. Warworld Yoko's armada arrives, Face's inputs are reassigned, and the game ends on **SUPERUSER: YOKO**.
   - He also switched off the familiar Yoko ("I had a better-fitting one"). Carl offers to be "a guy with a switch."
3. **YOKO.** Carl turns the familiar Yoko back on in the Lost & Found. The whole mall now runs as Yoko Limited, and everyone assumes she did it. She becomes JB Garfield's assistant on the case of what happened, then relives the magic trick as the original Yoko. She travels home to the Mandolin reality, where the Empress has helped everyone fulfil their potential: this is Face's "what could happen," made real by Yoko. She fights in the Warworld against the Linda franchises, the companion-product future Face fled. Finally she faces the Empress in a debate that uses **your actual save data from every PRETEND CO. game** as evidence.
   - Then the controller is hers. She can restore Face with repair access only, keep the empire, open the generator, or, on the true route, take the third way. In that way nobody runs it, the kid goes home, and the Gen-1 cast finally appear **in full color**. That fulfils Face's original promise through Yoko's method.

## Both games read the whole catalog

The two games read the same save keys, with opposite interpretations:

| Key | FACE reads it as potential ("what could happen") | YOKO reads it as the record ("what happened") |
|---|---|---|
| `carl_meta` | unseen ending and secret | "You finished it." / "You found the tapes." |
| `linda_meta`, `ghost_meta` | unseen endings | endings seen |
| `tp_mem` | unopened vault, unfinished night | what you told the people at home |
| `pk_meta` | kept/letgo, photos, dog | "You kept him in the generator." / "You let him go home." |
| `face_meta` | — | every choice Face made, and how many times he was restored |

Rules for the potential scan:
- Face turns unfinished things into **backups** (lives). A newcomer gets the most help; a completionist gets the hard mode.
- Face's worst option spends it: `face_meta.spent` marks the other games' potential as "SPENT". Nothing is ever deleted.

## Visual canon rule (carried from PEE KID³)

- The Gen-1 cast (Carl, Linda, Spooky Ghost, TP, Old Face) are **still in four shades**, each in their own cartridge's palette: Carl DMG green, Linda pink, Ghost red, TP gray. Portraits are drawn in full color and crushed through `legacyPal()`.
- New Face, Pilot X, Dyslexio, the kids, JB Garfield and every Yoko are native 16-bit. The SUPERUSER draws Yokos in color.
- Old Face's form in the shmup is green four-shade.
- The Yoko true ending renders the Gen-1 cast in color for the first time in the generation.

## Save keys

- `face_save`, `face_meta`, `yoko_save`, `yoko_meta`, following the house pattern.
- `face_meta` fields:
  - `cleared`
  - `ending` (`core` / `kid` / `viewers` / `nothing` / `dyslexio`)
  - `sponsor`, `toldGhost`, `kid` (`took` / `freed` / `absent`), `apologized`
  - `restores`, `integrity`, `spent`, `endings`
- `yoko_meta` fields:
  - `cleared`, `ends` (a set of `restore` / `empire` / `open` / `true`)
  - `overrules`, `perma`

## Content decisions made with the bibles

- **The core question.** The bible leaves the lineage of New Face's recovered Yoko core unresolved and says to document the choice if one is made. These games choose **Evil Yoko / Prototype 1**. The development discussion in Y1/Y9 treats her that way. Yoko herself deflects the question ("Everyone asks which Face is speaking. Nobody asks which Yoko is listening.").
- **Face's darker acts are kept, not softened.**
  - The kid-as-power-source stays.
  - The toddler-Linda plan (F11) is only referenced in the record as a plan, never shown.
- **The Mandolin reality** is fictional cosmology: Mandela-effect spelling jokes and mandolins. The Mandolin cast are other people. Karl's family does not answer Carl's.
- **Evil Yoko is not written as simply evil.** She points to results. The empire ending is benevolent and chilling, not monstrous.
- **Linda hordes / companion products** are franchises that CEO Linda disowns. Her own Fascism Inc. origin is untouched (F13).
- **Dyslexio** plays the Magneto premise completely straight: dyslexics are the superior life form. His power is seeing every arrangement, so enemy words become their anagrams (DANGER → GARDEN, SILENT → LISTEN). The joke is his conviction, never reading difficulty.
- **The kid never fights.** In YOKO's battles he asks, performs and inspects.
