# MALL OF THE FUTURE: KONBINI WARS

## Game design document

**Working title · Version 2.0 · 7 October 2026**

A character-driven convenience-store management game modeled on **ザ・コンビニ 〜あの町を独占せよ〜** (The Conveni) and the alternate worlds of **ザ・コンビニスペシャル 〜3つの世界を独占せよ〜** (The Conveni Special), set in the stream's Mall of the Future.

**The game:** Choose a stream character, open that character's version of a konbini, and fight the other characters' chains for the mall's customers until one chain owns the wing. Carl sells delivery supplies and allegedly normal human snacks. Ghost runs a little occult and adventurer shop. Linda turns convenience into a premium corporate experience. Every store runs on the same management simulation; their goods, look, priorities, and strongest strategies differ.

**Platform (v2):** built on the **68k-x** engine (`x68.js` + `fm.js`, copied from `dm/`). Presented as a **lost 1998 Japanese PC release** from "PRETEND CO. SOFT": a late-era 68k-x title that has seen Windows 95 and wants to look like it, without quite being it. The visual target is still the **PlayStation version of The Conveni Special**, adapted to the 68k-x screen (see section 16).

**Fidelity goal (v2):** the simulation should **play like The Conveni games**, not like a loose "inspired by". The town map, land prices, attracting facilities, store sizes, sales permits, opening hours, shelf layout, category margins, staff abilities, store ratings, buying out rivals, and the monopoly goal all come from the series (section 2). The hardware look is a skin; it must not cut depth from the simulation. Where this document adds systems the originals did not have (per-product ordering, a backroom, expiry, manager mechanics), they are marked *(new)* and sit on top of the original model.

Store names, campaign premises, products, numbers, and the rules marked *(new)* are **new design proposals**. Character foundations come from the existing transcript-based bibles. This is a playable adaptation of the cast; it does not claim these stores appeared on the stream. All numbers are starting points for tuning.

## 1. The player experience

The player starts with a budget, one store, and a recognizable character trying to make a business work. They pick a lot on the mall map, choose the store's size, apply for sales permits, lay out shelves, hire a manager and staff, set margins and hours, and open the doors. Little customers walk in, find shelves, queue, pay, complain, and sometimes leave for the rival across the corridor.

The pleasure comes from understanding why the shop behaves as it does, and then from the slow climb the originals are known for: profits buy lots, lots and attracted facilities grow the mall's footfall, footfall raises sales, and lot prices climb behind you. A run can last dozens of hours.

The character comedy comes out of ordinary problems. Ghost wants every opening to be a performance. Linda wants every purchase to affirm her brand. Carl insists that the shop is perfectly normal while restocking it out of the A.S.S. Yoko names the problem everyone else is explaining away.

**Target experience:** a funny, absorbing management game where watching the store is enjoyable, improving it feels earned, and taking the wing from a rival feels like a long campaign won.

| Item | Direction |
| --- | --- |
| Genre | Single-player convenience-store chain management. |
| Platform | 68k-x (512×256, 12-bit color, FM sound), presented as a 1998 Japanese PC release. Mouse-first with a full keyboard path. |
| Session length | Open-ended. A month of game time plays in a few minutes; a full map takes many hours. |
| Presentation | Top-down store interiors and a mall map in the PS Conveni Special style, under a "nearly Windows" desktop interface. |
| Main mode | Six manager scenarios on a shared mall and shared retail rules. |
| Other modes | Free maps with the original three goal types, plus an unlockable extra map; bonus character scenarios later. |
| Player role | Chain owner directing stores through menus and the store view. |
| Success measure | The map's goal (population, monopoly, or owner rating), plus the manager's scenario objective. |

The player does not need to have watched the stream. Fans get relationships, visual references, recurring bits, and deeper jokes.

## 2. What to take from The Conveni

The series supplies the whole game skeleton. These are the systems as the originals had them (sources at the end), and how each is used here.

**Platforms and lineage.** The first game was a 1996 PC title by Masterpiece, ported to PlayStation and Saturn in 1997. *Special* (PlayStation, 1998) is a port of the PC "Another World" edition: a cat world, a fantasy RPG world, and a near-future city, with new buildings, fixtures, and staff. A late Japanese PC release that wants to look like the PS *Special* is therefore a natural fake history: our game is the PC edition the PS port could have come from.

| Original system | How it worked | Use here |
| --- | --- | --- |
| Town map | Your chain and a rival chain (several in later entries) compete in one town. Stores win customers from their surroundings. | The mall is the town: districts, corridors, lots. |
| Goals | Per map: attract city hall by reaching a population (beginner: 20,000), open 10 stores when the town caps all stores at 10 so rivals must go (intermediate), or reach a 5-star owner rating (advanced). An extra map unlocks after clearing all three. | Same three goal types on free maps; scenarios combine them with a manager objective. |
| Town growth | Opening stores and attracting facilities raises population; population raises sales; land prices rise with development and time (a 20M lot can pass 100M by year two). | Footfall, facility attraction, and rising lot prices work the same way. |
| Facility attraction | Pay to bring facilities to the town. Growth loop: attract → sales up → attract again. | Attract mall tenants: food court, arcade, starport gate, hotel, and so on. |
| Store opening | Pick location and store size, apply for permits (tobacco, alcohol, medicine, each with a fee), hire a manager and two staff. | Same, with mall permits. |
| Permits | Each permit has an exclusion range on the map (in *3*: tobacco 10 squares, alcohol 12, medicine 14) and a fee. | Permits are scarce territory; placing one first blocks rivals nearby. |
| Store sizes | Larger sizes unlock as total sales pass thresholds. | Four sizes, unlocked by chain sales. |
| Interior layout | Place registers, a break room, and shelves by product category. Anything from a realistic konbini to a "bento-only" shop is allowed. | Same, with category shelves and per-product facings *(new depth)*. |
| Hours | Six choices from 24-hour to limited (7–23, 10–18, ...). Customers only come while you are open. | Same six choices. |
| Margins | Profit margin set per product category, with a bulk setting. | Same, plus per-product overrides. |
| Staff | About 35 named staff. Fixed stamina; education, agility, and sociability cap five growing abilities: register, restocking, security, cleaning, service. Abilities grow with work and training; bad customer encounters set them back. The manager's education speeds everyone's growth. Fired staff cannot be rehired for 6 months. | Same model, with the stream's cast and mall residents as the hiring pool. |
| Store ratings | Security, cleanliness, service, and popularity per store, averaged into an owner rating of up to 5 stars. Even small stores can reach 5 stars. | Same four ratings and stars. |
| Rivals | Rival stores pull customers; you can buy a rival's store outright, and run thin-margin stores next to a rival to starve it. | Same, with each rival run by a stream character. |
| Customer monopoly rate | The share of the area's customers your stores hold. | The headline share number. |
| Time | A calendar with a running clock and weather. In *3*, a month plays as 4 days and the month-end settlement scales the result by 8. | Same compression (section 5). |

The art target is specifically the **PS Special store view** (see the [archived Special gameplay image](https://mimora.mimoza.jp/yao_game/retro/images/ctg_main/memorandum/detail/PS/pict/PS-0042/img_gmrPS_0042-10.webp) and the [Special screenshot archive](https://www.gavas.jp/products/detail.php?product_id=9182)). What that screenshot shows, and we copy:

- A **top-down store** with thick wooden walls, a colored sales floor, shelves lining the walls as little readable goods icons, an island of cases in the middle, and a register counter by the door with staff behind it.
- A **backroom strip** across the top, joined to the floor by up/down arrow buttons.
- **Customers about a third of a tile wide and a tile tall**, readable at a glance (the cat world's cats in hoodies and jeans).
- The **store sits on a themed wallpaper** (paw prints for the cat world) instead of a black void.
- **Floating panels**: a store tag (head-office marker, hours "24時間営業", the day's sales) at top left; a date/cash panel (year, month and day, cash, a weather icon, an analog clock) at bottom right.

Exact original formulas and balance are not known and are not assumed. Section 2's table is the behavior to reproduce; the numbers are ours to tune.

## 3. Design priorities

1. **Play like The Conveni.** When in doubt, the original's answer wins over a modern convenience. Additions must deepen the original model, not replace it.
2. **A useful store is a successful store.** Sales depend on real stock, reachable shelves, service, hours, and the local audience.
3. **Characters change decisions.** A manager's mechanic changes how the player runs the business; it is not just a portrait and a bonus.
4. **The mall is alive.** Corridors, attracted facilities, deliveries, announcements, and rivals connect the shop to a larger place that grows.
5. **Problems can be understood.** Visible behavior and reports explain what failed and where to look.
6. **Comedy has room to breathe.** Customers need time to browse, queues need time to form, and dialogue must not interrupt every sale.
7. **Themed shops are still konbini.** Each sells everyday essentials beside its signature goods. Ghost's shop is an occult convenience store, not an RPG.
8. **The hardware is a costume, not a ceiling.** The 68k-x look limits colors and resolution; it never limits the number of stores, customers, products, or decisions.

## 4. Setting and continuity

### The retail season

Linda opens a new wing of the Mall of the Future and announces a competition to establish its leading convenience chain. The entrants get equal starting funds and a published rulebook. Each has a reason to enter:

- **Carl:** earn a real tenant deed and turn delivery work into a place of his own.
- **Linda:** prove her brand is the model every tenant should follow.
- **Ghost:** prove he can build something people come back to, not just a big entrance.
- **Face:** turn an exciting invention into a business that actually helps people.
- **Yoko:** show what happens when people get the help they need.
- **JB:** run a dependable neighborhood shop while investigating its changing customers.

This is a proposed ensemble spin-off. It does not reconcile every death, restoration, alternate reality, or later stream version of the cast.

Use **a restored Original Face** and **the familiar, more forgiving Yoko** as the playable versions. New Face, Evil Yoko, and Endless Yoko can appear in separately labeled later scenarios. JB is his own character, not a costume Face wears.

Carl's deed starts **probationary**. This adapts the existing conflict in which his conduct gets him barred from the mall; it does not erase it.

### The mall's rules

The mall can exist outside ordinary time and space and still keep a **retail calendar**: days, months, wages, and settlements. The calendar is a game convention, not a new claim about the stream's cosmology.

Linda remains the owner in the story. During the contest, lot prices, permits, and rules come from the mall's published system. Her own chain pays the same prices as everyone else; her rival chain cannot secretly change the player's costs or take a lot because it is losing. That limit gives her a real competition to win. Her influence shows up in premium contracts, branding, announcements, and dialogue.

### Existing foundations and adaptation space

| Transcript-grounded foundation | Proposed use in the game |
| --- | --- |
| Linda controls the mall and demands promotion. | Lot sales, permits, advertising, sponsorship offers, and her rival brand. |
| Carl delivers Prop Pills in the A.S.S. and causes trouble at the mall. | Delivery-centered starter scenario and a probationary deed. |
| Ghost combines occult skill with showmanship. | Fantasy goods, scheduled demonstrations, and night demand. |
| Face chases ideas and potential, sometimes ahead of their consequences. | Product experiments with explicit costs and capped outcomes. |
| Yoko assists, translates, restores, and uses her own judgment. | Customer-needs information, staff training, and reliable service. |
| JB is a detective cat with sincere curiosity and put-on noir cool. | Feline goods, regulars, and commercial investigations. The cat-world counterpart to *Special*. |

The much later **Dark Nights: Metal / War World** material stays available for an expansion. The base mall is not a battlefield full of Linda Hordes. The [far-future research document](J:/carladv/DARK_NIGHTS_METAL_AND_WAR_WORLD.md) separates those settings and their uncertainties.

## 5. Main game loop and time

**Pick a lot → build and permit the store → lay out and staff it → open → watch → read the month-end settlement → improve → attract facilities → open more stores or buy rivals out → take the map.**

### The calendar (as in The Conveni 3)

The game runs on a calendar: **Year 1, April 1** onward, with weather and an analog clock in the date panel.

- Each **month plays as 4 sample days**, spread across the month (for example the 3rd, 10th, 17th, and 24th). Each day runs a full 24-hour clock in real time, about **2 minutes per day at 1×**.
- The **month-end settlement** scales the four days' results to the whole month (×8, as the originals do) and books wages, utilities, advertising, and loan payments. Land values, population, and staff growth update here.
- Speeds: pause, 1×, 2×, 4×, and **skip to settlement**. A mature chain can be left to run month after month until something needs attention.
- Store hours matter on the clock: a store open 7–23 sees no customers between 23:00 and 7:00. Ghost's best trade is at night.

Important decisions pause automatically. Opening a full report pauses by default; inspecting a customer does not.

A typical month:

1. Read the settlement and the mall bulletin (coming events, facility openings, rival moves).
2. Adjust margins, orders, shelves, and hours to fit the coming month.
3. Spend: an ad, a facility attraction, a new lot, a store upgrade, or a buyout offer.
4. Watch the four days and react to visible problems.

## 6. The mall map

The map is the town. It is a grid of corridor squares, lots, and landmarks seen from above in the PS style, with stores drawn as small facades in their chain colors. The full game has six districts:

| District | Main traffic | Retail opportunity |
| --- | --- | --- |
| Arrival concourse | Travelers, delivery crews, first-time visitors. | Portable food, chargers, travel goods; good for Carl. |
| Corporate gallery | Android customers, employees, premium shoppers. | Gifts, presentation, companion accessories; good for Linda. |
| Arcade and entertainment wing | Groups, hobbyists, young visitors. | Snacks, toys, gadgets; good for Face. |
| Occult passage | Adventurers, spirits, late shoppers. | Ritual supplies, practical fantasy goods; good for Ghost. |
| Everyday services court | Regulars with routine errands. | Essentials, bundles, language help; good for Yoko. |
| Quiet back corridor | Local regulars, feline shoppers, night workers. | Food, coffee, magazines, dependable service; good for JB. |

District names and demand mixes are proposals, not a survey of the stream's mall.

### Footfall (population)

Every square of the map has a **footfall** value and a **customer mix**. The mall's total footfall is its population, and it drives everything. Customers come from the squares around a store, weighted by distance, so two stores close together fight over the same squares. The **customer monopoly rate** is the share of the map's shopping trips that your stores complete.

Footfall grows when:

- stores open (a lit, busy corridor draws people), and
- **facilities are attracted** (below).

### Attracting facilities *(original system, mall dressing)*

The player pays to bring a facility to a chosen spot. Each raises footfall around it and shifts the customer mix nearby. Facilities have a price, a minimum mall population, and a footprint:

| Facility | Effect |
| --- | --- |
| Bench court, vending row | Small footfall bump; cheap starter attraction. |
| Food court | Big daytime bump; competes with bento sales nearby. |
| Arcade | Evening hobbyists and snack demand. |
| Android service counter | Corporate and companion shoppers; care-kit demand. |
| Starport gate | Travelers at all hours; the biggest early footfall gain. |
| Hotel tier | Night trade and late food. |
| Spirit lounge | Spirits and adventurers after dark. |
| Cat café | Feline regulars. |
| **Mall Administration Tower** | The map goal on population maps (the original's city hall). Requires a population target. |

Mall stages, on population milestones, as the original's town → city → district → metropolis: **Wing** (5,000), **Concourse** (10,000), **Plaza** (15,000), **Megamall** (25,000). Each stage unlocks facilities, store sizes, and new lots.

### Lots and land value

Lots are **bought outright** with a deed, as in the original. A lot's price follows the footfall around it and the calendar: early lots are cheap, and a lot near a starport gate can be worth five times its price by year two. Deeds can be sold, so land is also an investment, and an unprofitable store's lot may still be worth keeping. Rivals buy lots by the same rules, so a good spot left empty may not stay empty.

### Permits and territory

Three permits, each with a fee and an **exclusion range** (no other chain can get the same permit within that range of a holder):

| Permit | Range | Fee | Mall flavor |
| --- | --- | --- | --- |
| Tobacco and vapes | 10 squares | 3M MC | High-margin impulse buys. |
| Alcohol | 12 squares | 7M MC | Night trade, gifts. |
| Medicine | 14 squares | 10M MC | Needed to sell Prop Pills and care kits. |

Permits turn the map into territory: getting the medicine permit in a district first locks rivals out of it. A permit belongs to the store and is lost if the store closes or is sold.

The player controls one chain. Rival chains run on their own. A beginner map has one rival; later maps have two or three. Other cast members can appear in the mall without each running a chain.

## 7. Building the store

### Store sizes

| Size | Usable floor | Unlocks at chain sales of | Build cost |
| --- | --- | --- | --- |
| 1 | 10 × 8 | start | 8M MC |
| 2 | 12 × 10 | 20M MC | 12M MC |
| 3 | 14 × 11 | 200M MC | 16M MC |
| 4 | 16 × 12 | 2,000M MC | 20M MC |

Every size has a **backroom strip** across the top (as in *Special*): stock racks and the break room, joined to the floor by a door. A store can be rebuilt to a larger size on the same lot if the lot fits.

### Fixtures

Shelves are **category fixtures**, as in the original. A shelf holds one category, and its facings hold that category's products:

| Fixture | Holds | Notes |
| --- | --- | --- |
| Bento case | Bento, onigiri, sandwiches | Chilled; expiry; the biggest daytime seller. |
| Bread rack | Bread, pastries | Short expiry. |
| Drink cooler | Drinks | Chilled; steady all day. |
| Hot case | Hot snacks, oden *(new)* | Needs staff attention. |
| Snack shelf | Snacks, candy | Impulse buys near the register. |
| Daily goods shelf | Household essentials | Slow and steady. |
| Magazine rack | Magazines, comics, newspapers | Draws browsers to the window; browsers block aisles. |
| Specialty display | The manager's signature lines | Themed art per manager. |
| Restricted case | Tobacco, alcohol, medicine | Needs the permit; must be in view of a register. |
| Register | Checkout | Needs a staffed position and a queue line. |
| Break room | Staff rest | Required; staff recover stamina here. |
| Stock rack | Backroom stock | Backroom only *(new depth, see section 8)*. |
| ATM / copier / ticket kiosk | Services | Small fees; brings in customers who may add a purchase. |

Fixtures snap to the grid and show their access sides before placement. Signs and decorations add popularity, with limited and clearly shown effects. Nothing replaces stock a customer needs.

### Layout rules

Every shelf needs a reachable shopping side. Registers need a staff position and a queue line. The door must connect to the sales floor, and the backroom door to the floor. The placement preview refuses layouts that cut off something essential and explains why; valid but inefficient layouts are allowed. An extra shelf can add capacity and create a bottleneck you can see.

As in the original, unusual stores are allowed: a bento-only store or a magazine-and-coffee night store is a legal strategy if the area wants it.

Moving fixtures costs a small remodel fee and pauses the day. Goods on a moved shelf go to the backroom; they are never deleted.

## 8. Merchandise, orders, and stock

### The catalogue

The original sells by category with margins per category. That stays the core: **set margins per category** (with a bulk setting) and most of the shop works. Under it, this game adds individual products for players who want to go deeper *(new)*.

The full release targets **72 products**: 48 shared everyday goods (eight categories of six) and four signature products for each of the six managers.

| Category | Examples |
| --- | --- |
| Bento and rice | Bento box, onigiri, sandwich, noodle cup, curry rice, meal box |
| Bread | Melon bread, sweet roll, sliced loaf, curry bun, ... |
| Drinks | Water, canned coffee, tea, fruit drink, energy drink, milk |
| Hot snacks | Fried chicken, steamed bun, oden set, ... |
| Snacks and candy | Chips, chocolate, candy, cookies, ... |
| Daily goods | Toilet paper, tissues, soap, wipes, batteries, charging cable |
| Print | Newspaper, weekly magazine, comic anthology, puzzle book, ... |
| Restricted | Cigarettes, beer, cold medicine (needs permits) |

A signature product must answer a customer need. A wand belongs near adventurer traffic; a premium gift needs shoppers who want gifts and can pay for them. Tooltips state the plain economics.

### Shelf space and surveys

There is never room for the whole catalogue: each shelf holds two products, and a category has a dozen. Every customer comes in for one particular product; if it isn't carried, only some settle for something else on the shelf. What people want is hidden and shifts with the area, the season, and new releases. POS data shows only what you already sell, so the way to learn the rest is a **customer survey**: pay for staff to ask everyone for a day what they came in for. Surveys go stale as tastes change. Rivals survey too.

### Ordering

Two levels, so new players are not buried and experienced players are not limited:

- **Auto (the original's level):** each category orders to fill its shelves, from a cash reserve the player sets. Margins and shelf space are the player's main tools.
- **Manual *(new)*:** per product, set a target quantity and reorder point, or place orders by hand from the **POS data screen** (sales by hour, by day, and by weather, for each product). Orders arrive the next morning; an emergency order costs more.

Juan can serve as the supplier contact for imported goods and mall business. His catalogue and contract scenes would be new writing based on the commercial role in the transcripts; he is not a playable manager.

Staff carry stock from the backroom to the shelves, so there are two kinds of empty shelf: nothing in the store, or stock in the back that nobody has carried out yet. Reports tell them apart.

### Expiry and waste *(new)*

Bento, bread, and hot snacks have an expiry time. Anything left past it is thrown out and booked as **waste** at its cost. A markdown option before expiry trades margin for less waste. Other goods do not spoil. Weather moves demand: rain sells umbrellas and hot food, heat sells drinks, and the POS screen shows it.

### Prices

Margins are set per category, with per-product overrides. A comparison shows cost, price, margin, and whether the price is low, typical, or high for the area. Customers pay more for the right product or good service; a big markup reduces interest. Selling below cost is allowed, and it is the original's weapon for starving a rival's store (section 13), but the loss is always shown.

## 9. Customers and demand

Customers are little people with simple, understandable trips. Each comes from a map square with a primary need, a budget, a patience level, and sometimes an impulse buy.

| Segment | Typical needs | Behavior |
| --- | --- | --- |
| Routine shoppers | Food, drinks, household goods. | Return to stores that reliably have what they need. |
| Travelers and delivery crews | Portable meals, cables, emergency supplies. | Value nearness and short queues. |
| Corporate and companion shoppers | Gifts, care products, presentation. | Lean toward Linda's range, within budget. |
| Adventurers and spirit visitors | Fantasy supplies, late food, ritual goods. | Want relevant stock and night hours. |
| Hobbyists and entertainment visitors | Gadgets, toys, novelties, snacks. | Respond to demonstrations and new stock. |
| Feline locals and night regulars | Meals, coffee, magazines. | JB's natural regulars. |
| Students *(original staple)* | Snacks, drinks, comics; after school. | Browse the magazine rack and block the aisle. |
| Shoplifters *(original staple)* | Small goods. | Deterred by the security rating and staff in view. |

Appearance and segment are related but not the same. An android can buy noodles; a cat can need a charging cable. Humans, aliens, robots, and spirits all obey the same checkout and stock rules.

### A shopping trip

1. A visitor on a nearby square picks a store by distance, need fit, price image, ratings, and attractions.
2. They enter, walk to a fitting shelf, and try their main purchase.
3. They may take a substitute, an impulse buy, or a magazine browse.
4. They queue and pay if their patience lasts.
5. Their satisfaction moves the store's ratings and whether they return.

A customer pays only at the register. If they give up, their goods go back to the shelf.

Short thought bubbles show the useful states: **can't find it, too expensive, empty shelf, long queue, dirty, pleased, extra item**. Clicking a customer explains their problem in plain words. The day and month reports add up the reasons.

### Store ratings and owner rating *(original system)*

Each store has four ratings from 0 to 100, as in the original:

- **Security:** staff security ability, staff in view, and lighting. Low security brings shoplifting and scares off night customers.
- **Cleanliness:** staff cleaning ability against foot traffic and spills. Rain makes floors dirtier.
- **Service:** staff service ability, queue times, and stockouts.
- **Popularity:** advertising, reputation, decorations, and events.

The chain's **owner rating** (up to 5 stars) comes from all stores' ratings, so one neglected store drags it down. Small stores can reach 5 stars. Advertising raises popularity; it does not create stock, and a big ad can make an understaffed store worse by growing its queue.

Regulars prefer a store but are not locked in. Repeated stockouts or bad service send them to a rival.

## 10. Staff *(original system)*

Each store has a **manager and up to two staff on shift** (larger stores allow more), hired from a named pool of about 40: stream cast in small roles, mall residents, and generic part-timers *(new names)*. Each person has:

- **Fixed:** stamina (how long they work before needing the break room) and three caps:
  - **education** caps register and security,
  - **agility** caps restocking,
  - **sociability** caps cleaning and service.
- **Growing:** register, restocking, security, cleaning, and service. They grow with practice and training and drop a little after bad customer encounters (a thief, a screamer).
- **Hourly wage**, with yearly raises and the occasional wage negotiation event.

The hiring screen shows the caps, not the real starting abilities, as in the original: a strong-looking hire can start slow, and a modest one can grow into a star. The **manager's education speeds every employee's growth** in that store, so the manager hire matters most. A fired employee cannot be rehired for 6 months.

Shifts are set per store against the opening hours. Staff pick their jobs from priorities (register first, restock, clean, watch the floor) instead of needing a click for each task. Staff without break-room time run out of stamina and slow down.

### Typical service problems

| Visible problem | Likely cause | Possible response |
| --- | --- | --- |
| Shelf empty, backroom full | Restocking too slow or too low a priority. | Change priorities, hire for agility. |
| Shelf and backroom empty | Order level too low or a late delivery. | Raise the target, pay for urgency. |
| Long queue | Too few registers staffed or slow checkout. | Add a register shift, train register. |
| Many browsers, few purchases | Wrong range or prices for this area. | Change stock or margins before advertising. |
| Goods vanishing | Low security. | Staff in view, security training, lighting. |
| Customers turning back at the door | Low cleanliness or popularity. | Cleaning priority, remodel, ads. |
| Sales up, profit down | Wages, waste, or below-cost prices eating margin. | Read the expense report. |

## 11. Money

Currency is **mall credits (MC)**, at the original's scale so the numbers feel like the yen in the original games. The date panel shows cash like the PS games do ("3369万2008" becomes **33,692,008 MC**).

- Starting funds by map: 200M MC (beginner) or 150M MC (intermediate and advanced), as the original's maps.
- Income: completed sales and service fees (ATM, copier, tickets).
- Costs: goods sold, wages, utilities, waste, advertising, training, remodeling, permits, facility attraction, lot purchases, manager actions, and loan interest.

There are two reports, a **cash report** and an **operating profit report**. Unsold stock is stock: its purchase is not charged again when it sells. Waste is written off once. Lots, buildings, and permits appear as investments, not as a bad month.

Example day at a size-2 store: 3,000 items at an average of 130 MC is **390,000 MC** in sales. Goods cost 273,000, wages 36,000, utilities 12,000, and waste 9,000, for an operating profit of **60,000 MC**. The month-end settlement scales the four sample days to the month.

### Debt and recovery

A bank loan is available against owned lots, with posted interest. Recovery options: shorter hours, cancelling ads, selling a lot, selling a store to a rival, or closing a store. A warning comes before any missed payment. Bankruptcy happens only after cash, credit, and sellable assets run out, and it arrives through a readable series of warnings, with an option to reload the monthly save.

## 12. Playable managers

The six scenarios use the same stock, staff, customer, and money systems. Each manager has **one main special mechanic**, four signature products, a look, a preferred audience, and a different scenario problem. Numbers are tuning values.

### Carl — Very Normal Convenience

**Pitch:** a scrappy travel stop selling human essentials out of suspiciously convenient delivery stock.

**Look:** teal and green, yellow details, hand-made signs, delivery crates, a slightly improvised specialty display. The [Carl reference](J:/carladv/ref/carl.png) and [second reference](J:/carladv/ref/carl2.webp) anchor his silhouette: big eyes, backwards cap, yellow bow tie.

**Signature stock:** Prop Pills (needs the medicine permit), ship emergency cables, vacuum-packed road meals, and a Very Normal Human souvenir cup. Prop Pills are fictional stream merchandise with no real-world medical claims.

**Mechanic — Backdoor Delivery:** once per day across the chain, Carl can route one capped order through the A.S.S. for immediate arrival, at 20% over the normal price. It still needs backroom space and restocking. It saves a rush or allows a leaner backroom; leaning on it every day drains margin.

**Strategy:** serve travelers fast, keep fast sellers stocked, use the rush order on a known spike. Carl is the tutorial manager because his advantage makes a common problem easy to understand.

**Scenario:** start on a probationary deed at the arrival concourse. Hold a clean tenant record, outsell a showier rival, and earn a permanent deed. Property damage is a defined story choice with a shown cost, not a random fine.

**As a rival:** cheap essentials, frequent small orders, rush orders when demand jumps.

**Writing:** anxiety turns a practical question into a growing defense. Let Carl care about succeeding even while he objects to the terms.

*New sample line:* "That is a normal amount of cables for a normal human store. Some humans need a lot of cables."

### CEO Linda — Linda Select

**Pitch:** the mall owner's immaculate premium konbini, built to make daily purchases feel like joining her success.

**Look:** pink, gold, and green; symmetrical signs; polished cases; Linda portraits; huge opening banners. Use the [Linda reference](J:/carladv/ref/Linda.png) for her pose and ornament.

**Signature stock:** Linda portrait compact, branded android-care kit (needs the medicine permit), premium gift box, companion accessory set.

**Mechanic — Brand Contract:** Linda can sign a supplier-backed contract for a set period. It cuts the cost of her signature lines by 20% but requires two specialty-display facings in every store and a fixed monthly promotion fee. It pays off where premium goods sell and hurts where shoppers want cheap basics. All terms and the cancellation cost are shown first.

**Strategy:** match presentation and gifts to affluent areas, build regulars, and sign only when projected sales cover the fee. Essentials still matter.

**Scenario:** prove a branded chain stands on its own money under the same prices as everyone else. A later map tests her model in a poorer district, against customers she cannot simply command to admire her.

**As a rival:** premium displays, gift promotions, contracts when they pay.

**Writing:** competence, vanity, and pressure at once. Her ex-wife history informs relationships, but a pricing scene does not need to become an alimony scene.

*New sample line:* "Convenience means the customer need not decide whether my brand is the correct one. We have arranged the answer."

### Spooky Ghost — Spooky Mart

**Pitch:** an occult konbini and little adventurer supply shop, run by someone who treats every opening as a comeback.

**Look:** violet and blue, warm lanterns, chalk motifs, curtains around a demonstration counter, a night mood. Effects must leave shelves and queues readable. His store's wallpaper backdrop is the nearest thing to *Special*'s fantasy world.

**Signature stock:** ritual chalk, apprentice wand, pocket ward, spooky herb bundle.

**Mechanic — Grand Demonstration:** once a day, Ghost schedules a show for a time slot. It draws extra interested visitors from the surrounding squares and attention to his specialty display. It costs a show budget and ties up one staff member. If service is thin, the queue eats the gain.

**Strategy:** stock up and staff the registers before creating a surge, then turn the crowd into regulars. 24-hour opening suits him, and it costs wages.

**Scenario:** pull off a successful opening, then prove the shop is profitable on a day with no show. The goal rewards return visits as well as spectacle. Spooky alimony can appear as an announced fixed obligation, never a surprise penalty.

**As a rival:** night hours, fantasy stock, scheduled shows, and now and then too much attention and not enough service.

**Writing:** he has real talent. The comedy comes from how badly he needs ordinary sales to confirm his greatness.

*New sample line:* "They came for the impossible. They stayed for the meal deal. I am choosing to regard that as a triumph."

### The Face — The Potential Store

**Pitch:** a convenience laboratory where the owner's newest idea has to survive contact with real shoppers.

**Look:** cool blues, glowing display windows, little demonstration machines, notebooks, framed portraits. Use the restored Original Face design throughout; label any switch to New Face.

**Signature stock:** pocket potential-meter, self-sorting snack box, miniature curiosity projector, experimental instant breakfast. These are proposed goods, not established inventions.

**Mechanic — Pilot Batch:** Face can commission a small test run of one signature product. The preview shows research cost, batch size, the possible demand and reliability outcomes, and the refund risk. After a test period, sales show whether it deserves a full order. A bad result causes a capped refund or discount; it never destroys unrelated stock. Successful tests improve that product within the run, up to a cap.

**Strategy:** let steady everyday goods pay the bills while testing one new line. Betting the store before testing is the risk.

**Scenario:** run a useful shop before unveiling a flagship product, then handle a product complaint and show the invention meets a real need. The ending depends on whether Face built lasting value or just a big opening day.

**As a rival:** test batches, rotating displays, promoting whatever tested well.

**Writing:** curiosity leads. His enthusiasm is sincere, and the next practical problem makes the scene funny.

*New sample line:* "The breakfast problem is solved. There is a separate question about whether anyone wishes to eat the solution."

**Dyslexio:** if used later, the name is **Dyslexio**: Face's Magneto-style villain form, convinced that dyslexics are the superior life form. He belongs in a labeled escalation event or bonus scenario, with the theatrical conviction in [Face's bible](J:/carladv/THE_FACE_CHARACTER_BIBLE.md). A misspelling gag misses the bit. He is not a seventh manager.

### Yoko — Yoko Everyday

**Pitch:** a clear, welcoming shop organized around what people actually came to do.

**Look:** calm light colors, useful multilingual signs, tidy categories, plain prices. Her competence shows in the layout; her portrait keeps her personality and agency.

**Signature stock:** translation phrase cards, travel-needs kit, adaptive planner, compact assistant terminal (retail goods; no live AI service needed).

**Mechanic — Need Kits:** Yoko can offer a kit for a known shopping purpose that combines two stocked products at one price. Checkout uses up both and takes a little longer. If either part runs out, the kit is off. A good kit lifts sales and service; a bad one ties up attention and stock. A few kit recipes at launch, such as a late meal or an emergency travel pack, all priced within the buyer's budget.

**Strategy:** forecast routine needs from the POS screen, keep both kit parts stocked, and weigh helped purchases against checkout speed. She wins through preparation, not events.

**Scenario:** serve a mixed crowd the other shops overlook, train a reliable team, and hold service through a visitor surge. The last map has her run a second store without doing everything herself.

**As a rival:** broad essentials, restrained margins, sensible kits, careful staffing.

**Writing:** she explains clearly and can refuse an unworkable demand. Familiar Yoko's forgiveness does not mean agreeing with everything Face says.

*New sample line:* "They did not need a more exciting offer. They needed the two things on the sign to both be in stock."

### JB Garfield — Midnight Convenience

**Pitch:** a cat-friendly neighborhood konbini where every empty shelf can open a detective story.

**Look:** amber windows, midnight-blue signs, coffee browns, restrained noir touches, cat-sized details. Comfortable as well as stylish. This is the direct counterpart to *Special*'s cat world, and his store's paw-print wallpaper and cat customers should look the most like that screenshot. Non-cats shop here too.

**Signature stock:** lasagna portion, noir pulp magazine, detective's coffee blend, rainproof detective cap.

**Mechanic — Customer Case:** once a day, JB investigates a recent run of lost sales or a regular's unmet request. After a fixed fee and a few hours, he gets a precise clue: which product was missing, which price drove off a segment, or which hours a regular needed. Acting on it earns a small, capped regular-customer bonus. Everyone gets loss reports; JB gets earlier, more specific evidence. He cannot see a rival's private books or make a sale happen without stock.

**Strategy:** build a solid core range, find an overlooked pocket of demand, earn regulars.

**Scenario:** set up a quiet shop, investigate an apparent disappearance of customers, and find a dull but commercially vital cause: a changed route, a missing staple, a new competitor. The finale turns a neighborhood's needs into a profitable night trade.

**As a rival:** stable prices, coffee and meals, selective investigations, loyalty over big ad campaigns.

**Writing:** let the investigation sometimes work. Wanting to sound cool should not stop him noticing things.

*New sample line:* "The shelf was empty. The customers were gone. Somewhere in this town, a delivery schedule knew more than it was saying."

### How the six shops differ

| Manager | Strongest decision | Main risk | Satisfaction |
| --- | --- | --- | --- |
| Carl | Pay for stock exactly when it is needed. | Rush orders eat margin. | Catching a rush that would have been a stockout. |
| Linda | Commit space and fees to a brand contract. | Demand does not cover it. | Making expensive presentation pay. |
| Ghost | Create demand, then prepare to handle it. | Attention outruns service. | Turning a show into regulars. |
| Face | Test an idea before scaling it. | Research and refunds drain cash. | Finding a winner through evidence. |
| Yoko | Match a kit to why people came. | Parts or checkout run short. | The right customer leaving with everything. |
| JB | Find a precise demand clue and act on it. | The case costs money and the fix can still fail. | Turning a discovered need into loyal trade. |

Shared fixtures get themed art without becoming separate systems: Ghost's cooler is a potion cabinet, JB's shelves carry cat signs, Linda's cases are ornate. Same footprint and function.

### Bonus scenarios

**Pee-wee Kid — novelty shop challenge:** a short scenario with snacks, toys, comics, and scheduled performances. Puppets and bits can appear in announcements and events. Pick the performer version explicitly; Pee Boy's detective role stays separate. The generator and potentiality material can inform a labeled special scenario, not a reward for exploiting the kid.

**TP — the off-story shift:** a menu-accessible challenge that declares the campaign suspended. A toilet-paper roll runs the most ordinary possible shop, talks to the player, and somehow creates more presentation while claiming to give it up. Other characters do not treat TP as a tenant. Reduced catalogue, short goals, meta commentary, per [TP's bible](J:/carladv/TP_CHARACTER_BIBLE.md).

Both come after the core release.

## 13. Rival chains

Rivals are businesses the player can understand. They have cash, stock, lots, staff, hours, and ratings, and use the same mechanics and prices as the player.

Each month a rival reviews unmet demand, margins, queues, ratings, and cash, then makes a few sensible moves: change orders or margins, shift staff, advertise, attract a facility, buy a lot, open or upgrade a store, take a permit, or make a buyout offer. Its character sets its priorities and appetite for risk. Big moves are announced in the bulletin.

The player can visit a rival store and see its layout, prices, and shoppers. Rival cash, order targets, and staff stats stay hidden; reports show market results afterward. Off-screen stores keep trading.

### Taking the map *(original system)*

Competition means winning customers, not combat. A character can make a theatrical threat while the actual move is a sale or a new lot. The original's tools all apply:

- **Squeeze:** open a store next to a rival and outcompete it on range, service, hours, or price, including deliberately low-margin "support stores" that bleed its customers.
- **Buy out:** offer to buy a rival store. The price follows its lot value and profit; a struggling store comes cheap (around 45M MC early on, as in the original). The buyer gets the store, lot, layout, and permits; the staff can be kept or let go.
- **Withdraw:** a rival store that loses money for a disclosed number of months closes. A rival chain with no stores leaves the mall.

Monopoly maps cap the total number of stores on the map (10, as in the original), so reaching the goal means rival stores must close or be bought.

The player can lose stores the same way: a rival can make an offer on a struggling store, which the player is free to refuse.

Manager actions follow the character, not each store: Carl gets one rush order per day across the chain, Ghost one show, JB one case. Linda holds one contract, Face one pilot batch, Yoko a few kits.

## 14. Modes and progression

### Free maps *(original structure)*

Pick a manager and a map. Each map has one of the original's goals and no time limit:

| Map | Start funds | Goal |
| --- | --- | --- |
| Beginner: The New Wing | 200M MC | Reach 20,000 footfall and attract the Mall Administration Tower. |
| Intermediate: The Busy Concourse | 150M MC | Own 10 stores on a map capped at 10 (monopoly). |
| Advanced: The Whole Mall | 150M MC | Reach a 5-star owner rating. |
| Extra: Linda's Penthouse Arcade | — | Unlocks after clearing all three. A rich, crowded map with three rivals. |

### Scenarios

Each manager has a scenario of **three maps**, each with a goal type plus that manager's objective and a time limit in years. Carl's is the recommended first, with the tutorial on its first map. Clearing a scenario unlocks decorations, staff, or a challenge option, never a permanent money advantage.

| Map | Focus | General goal |
| --- | --- | --- |
| 1: Open the doors | One store, one rival. | A profitable year and a minimum number of trips. |
| 2: Find your audience | A growing mall, two rivals, permits matter. | Show the manager's strategy; hold a monopoly rate. |
| 3: Take the wing | A big map, up to three rivals. | The map's original-style goal: population, monopoly, or 5 stars. |

Manager objectives: Ghost needs regulars after a show, Yoko dependable kit availability, Face a tested winning line, Carl a clean tenant record, Linda a profitable contract, JB a solved case that turns into trade.

### Difficulty and saves

- **Easy:** more money, slower rivals, cheaper land growth.
- **Standard:** the intended balance.
- **Hard:** less money, sharper rivals, the same visible rules.
- **Sandbox:** choose map, rivals, and goal; unlimited money optional.

A save holds every store, rival, lot, permit, facility, stock with expiry, staff with abilities, cash, loans, contracts, tests, regulars, events, and progress. Monthly autosave plus manual saves in several slots. Loading never rerolls a bad test result.

## 15. Events and character writing

Events change a visible retail condition and offer a response. The bulletin announces them ahead of time. At most one major event a month, with small flavor announcements in between.

| Event | Effect | Decisions |
| --- | --- | --- |
| Delayed arrival convoy | Travelers arrive in a later, larger wave. | Hold stock, change shifts, pay for a rush. |
| Android-service promotion | Care products sell. | Make space without dropping essentials. |
| Adventurer convention | Fantasy goods and late food sell. | Stock up and cover the night. |
| Arcade tournament | Snacks sell near the arcade. | Buy stock, protect checkout. |
| Rainy season | Umbrellas and hot food sell; floors get dirty. | Change the range and cleaning priority. |
| Supplier mistake | Part of an order is late; a refund or replacement is offered. | Substitute, wait, or pay extra. |
| Linda's sponsored showcase | A paid placement draws a set audience. | Weigh its fee and space against sales. |
| Wage negotiation | A star employee asks for a raise. | Pay, refuse, or lose them. |
| Magazine feature *(original)* | A staff member is featured; their education rises and the store gets popular. | Feature the right person. |
| JB's missing regular | A familiar face stops coming. | Investigate and respond. |
| Ghost's big comeback | A show pulls attention to his zone. | Compete on service, adjust your range, or advertise. |

Surprises are capped and explained. A fault can hit one fixture or shipment, with repair and refund options; it never wipes out the cash. Demand events help several businesses differently, so the advantage comes from preparation.

Dialogue appears at introductions, map transitions, notable results, and selected events. Routine announcements are short and easy to dismiss; long scenes wait for a pause. Repeat lines have cooldowns. Reports always use neutral, precise labels: a character can grumble about "customers lost to the queue", but the report still gives the count.

All sample dialogue is new writing. Use the bibles for voice and relationships. Keep the performers distinct; do not give everyone the same self-aware sarcasm.

## 16. Visual direction: the PS Special look on the 68k-x

### The fake history

A **1998 Japanese PC release** on the 68k-x. By then the PCs had Windows 95 and its windows, title bars, and taskbars, and this game wants that look on hardware that cannot run it: a desktop drawn by the game itself. It is the PC edition the PlayStation *Special* port came from, so the store view looks like *Special* and the menus look like a Japanese PC trying hard to be Windows.

On-screen text is English, presented as a **fan-translation patch** over the Japanese release (patch credit on the title screen; a few Japanese words left in place, such as 24時間営業 on the store tag, drawn as small bitmaps). This explains the English and fits the "lost game" framing. *(Proposal; change freely.)*

### The screen

The 68k-x is 512×256 shown at 4:3, so each pixel is **1.5 times taller than wide**. A tile that looks square is **24×16 logical pixels**. That gives:

- a size-2 store (12×10 tiles plus the backroom strip) at 288×176, centered on the screen with room around it for wallpaper and panels;
- customers and staff about **10×20 logical pixels** (a third of a tile wide, a tile and a bit tall, as in the screenshot);
- the largest store (16×12) at 384×208 with a smaller backroom, or scrolling. Bigger stores scroll; sprites never shrink.

```
+-------------------------------------------------------------+
| FILE  STORE  ORDER  STAFF  MAP  REPORT  HELP     [menu bar] |
|  wallpaper (paw prints / lanterns / logos per manager)      |
|  +--------------------+    +---------------------------+    |
|  | (本) 24時間営業    |    | backroom    [stairs]      |    |
|  |    13,404 MC today |    +---------------------------+    |
|  +--------------------+    | wooden wall               |    |
|                            |  reg  floor  island  shelves  |
|                            |  shelves along the walls  |    |
|                            +---------------------------+    |
|                        +-------+-----------------+-----+    |
|                        |  rain | Y1  Jul  3      |clock|    |
|                        |       | 33,692,008 MC   | 1:30|    |
|                        +-------+-----------------+-----+    |
| [Start]  Store 1  Store 2  Map     (taskbar)       x1 >> || |
+-------------------------------------------------------------+
```

### The "nearly Windows" interface

- A **menu bar** across the top and a **taskbar** across the bottom: open stores and the map as taskbar buttons, speed controls and pause at the right.
- Panels are **windows** with grey bevels, a title bar gradient, and close/minimize boxes, drawn with the engine's `panel` replaced by a bevel style. They can be dragged and stacked. The store tag and date/cash panel are the *Special* panels, restyled as small borderless windows that float over the wallpaper.
- A **mouse cursor** (an arrow, a hand over shelves, a crosshair when placing fixtures). Mouse input comes from `dm/dmgame.js`'s pointer layer. Every action also has a keyboard path: arrows move a cursor, `Z` clicks, `X` cancels, `Tab` cycles windows, number keys pick tools.
- Text is the engine's 5×7 font, kept large enough to read product costs. No information is only in color.
- Dialogue appears in a window with the manager's portrait, using the engine's `say`/`choose`.
- Wrong on purpose, like real 1998 software: a splash screen with a fake "setup" bar, a font that is almost but not quite the Windows one, an hourglass cursor during the month-end settlement.

### Store identity

Each manager gets: a wallpaper behind the store (Carl: delivery labels, Linda: her logo in gold, Ghost: lanterns and stars, Face: graph paper, Yoko: soft signage icons, JB: paw prints), a floor color, a wall style, a facade on the map, a sign, a specialty fixture, four product icons, a portrait set, and a music theme. Shared shelves and registers get themed art with the same footprint.

Shared goods get themed packaging with the same function: Ghost's drinks look like potion bottles, JB's meals carry a cat, Linda's tissues come in a branded box. Tooltips name the shared category.

Customers change with the store: JB draws more cats, Ghost more adventurers and spirits, Linda more stylish androids. Mixing them in the corridors makes the shared mall visible.

Carl and Linda's references are the visual anchors. For Ghost, Face, Yoko, and JB, use their bibles and fix one model sheet per playable version before animating.

### Colors and drawing

- 12-bit color with the engine's Bayer dither. Floors, wood walls, and wallpaper use `gradV` and dither patterns, as the PS original used textures.
- Shelves are drawn as **little goods icons in a frame**, like the screenshot: rows of bottles, cans, boxes, bento, each category recognizable by color and shape. A shelf visibly empties tile by tile.
- Sprites have a 1px dark outline so they read on any floor.
- Pre-draw store backgrounds into an offscreen buffer (`offscreen` + `copyBuf`) and redraw only when the layout changes; draw shelves' goods and people each frame.

### Animation and feedback

Walking (4 directions), browsing, reading at the magazine rack, carrying a basket or crate, paying, ringing up, restocking, cleaning, a reaction bubble. Each manager has a few portrait expressions and one signature action.

Useful feedback: a shelf emptying, a crate coming up the backroom stairs, a queue growing, a customer leaving angry, the register flashing on a sale, a thief running out. Effects show real activity only: no money sparkles without a sale.

## 17. Interface and sound

### Main windows

| Window | Essentials |
| --- | --- |
| Store | The live store view, the store tag, the date/cash panel. |
| Build | Fixtures, cost, access sides, store size upgrade. |
| Stock and POS | Category margins, auto-order reserve, per-product targets, POS graphs by hour, day, and weather, expiry warnings. |
| Staff | Hiring pool, caps, abilities, wages, shifts, priorities, stamina. |
| Manager | Special mechanic, terms, remaining uses, commitments. |
| Map | Lots and prices, footfall overlay, permits and ranges, facilities, rival stores. |
| Report | Day and month settlement, cash and profit, sales, losses by reason, waste, ratings, owner stars, monopoly rate, goals. |

One click on an empty shelf tells you whether the stock is missing, still in the back, or waiting for staff. Reports lead with the biggest lost-sales reason and the biggest avoidable cost.

### Accessibility

Text-speed and animation-speed options, separate music and effects volumes, tooltips, keyboard shortcuts, pause always one key away, notifications that stay until read, and icons and words alongside every color.

### Audio

FM music through `fm.js`, in the late-90s Japanese PC style: bright, compact loops in the voice of the PS originals' easy-listening shop themes. Each manager has a theme: Carl loose and bouncy, Linda polished and ceremonial, Ghost theatrical, Face curious, Yoko calm, JB warm and nocturnal. The map has its own theme, and the settlement has a short jingle.

Door chime, register beep, crates, footsteps, rain, and mall announcements make the shop feel inhabited. Keep the sale sound quiet. Voice is optional; short FM "vocal" stings and text are enough.

## 18. First fifteen minutes

The tutorial uses Carl on the first map of his scenario, with Ghost as the visible rival. One problem at a time:

1. **Choose a lot.** Compare two lots' price and footfall on the map. Buy one.
2. **Build.** Pick size 1, apply for no permits yet (and see why the medicine permit matters for Prop Pills later).
3. **Hire.** Pick a manager and two staff from the pool. Notice that the screen shows caps, not abilities.
4. **Lay out and stock.** Start from a working template layout; set category margins; let auto-order fill the shelves.
5. **Open a day.** Watch a customer choose, queue, and pay.
6. **Read a stockout.** A travel item sells out. Click the empty shelf: nothing left in the back either.
7. **Use Carl's delivery.** Compare the rush fee with the lost sales, then watch the crate come up the stairs.
8. **Read a queue.** An arrival wave makes checkout the bottleneck. Shift a staff member to the register.
9. **Month-end settlement.** See what sold, what was lost, and whether the extra shift paid for itself.

Then the player has the map. Help stays in the HELP menu. The tutorial accepts sensible alternatives instead of one exact layout.

## 19. Scope and build plan

### Where it lives

- Folder `kw/` with `index.html`. Copy `x68.js` and `fm.js` from `dm/`, and the pointer layer from `dm/dmgame.js`.
- Files (proposed): `kwui.js` (the "nearly Windows" desktop, windows, menu bar, taskbar, cursor), `kwsim.js` (calendar, customers, staff, stock, money; no drawing, so it can run headless), `kwmap.js` (mall map, footfall, lots, permits, facilities), `kwstore.js` (store view and layout editor), `kwart.js` (tiles, goods icons, sprites, portraits, wallpapers), `kwrival.js` (rival chains), `kwdata.js` (products, staff pool, maps, facilities), `kwstory.js` (scenarios, dialogue, events), `kwaudio.js`, `kwmain.js`.
- Tools (as for `dm/` and `la/`): `tools/kwvm.js` (headless loader), `kwshot.js` (screenshots), `kwsim.js` (runs N years of AI-vs-AI chains and checks money and stock never duplicate and that maps can be won), `kwplay.js` (bot plays the tutorial and a free map).

### First playable prototype

The smallest version that proves the promise:

- One map (the arrival concourse and the occult passage), Carl against Ghost.
- Lots with rising prices, footfall, two attractable facilities, and the medicine permit.
- Size 1 and 2 stores, the full fixture list, layout editor, category margins, auto-order, and the POS screen.
- Four categories of the shared range plus both managers' signature lines (about 30 products).
- Staff with caps and growing abilities, shifts, and the break room.
- The four store ratings and the owner rating.
- Carl's rush delivery and Ghost's demonstration, with their real costs.
- The calendar, month-end settlement, buying out a rival store, and rival withdrawal.
- The *Special*-style store view, the nearly-Windows desktop, and saves.

It must show the real store view, not a text-only economy.

### Full release

Six managers, 72 products, six districts, all facilities, four store sizes, three permits, three to four rival chains, free maps with the three original goals and the extra map, six three-map scenarios, events, a full staff pool, wallpapers, facades, portraits, product icons, and seven music themes.

Bonus Pee-wee and TP scenarios follow. Far-future factions, War World, multiplayer, combat, elaborate staff lives, and live generated dialogue are later possibilities, not part of this game.

### What must be proven before expanding

| Question | Evidence needed |
| --- | --- |
| Does it play like The Conveni? | Lots, footfall, attraction, permits, ratings, buyouts, and the monopoly goal all affect a run the way section 2 describes. |
| Does layout matter? | Two sensible layouts with the same range show different queues or restocking. |
| Do margins matter? | A higher margin raises profit per sale but loses customers; the report shows both. |
| Does location matter? | The same store does differently on two lots. |
| Do staff matter? | Ability and shifts change queues, ratings, and theft; overstaffing lowers profit. |
| Are Carl and Ghost different? | Their best responses to the same event differ, and each has a cost. |
| Is the rival credible? | It trades, pays bills, adapts, buys lots, and can lose without exemptions. |
| Can the player diagnose trouble? | A new player can explain their biggest loss after looking at the shop and report. |
| Is watching enjoyable? | Movement and reactions read clearly without constant input. |
| Does the money add up? | Purchases, sales, abandoned baskets, refunds, waste, buyouts, and save/load never duplicate money or stock. `tools/kwsim.js` checks it. |
| Does it hold up over years? | A long AI-vs-AI run ends with a winner and no runaway economy. |

These are acceptance criteria.

**Status (7 October 2026):** the first playable prototype is built in `kw/` (see HANDOFF.md). It covers the prototype list above except loans and store-size upgrades, and is verified headless only (economy sim, every window, a bot playing the UI as Carl and as Ghost). Not yet checked in a real browser or playtested by a person.

## 20. References

### The Conveni series (research for v2)

- [ザ・コンビニ, Japanese Wikipedia](https://ja.wikipedia.org/wiki/%E3%82%B6%E3%83%BB%E3%82%B3%E3%83%B3%E3%83%93%E3%83%8B): series history, platforms, goals, town growth and land prices.
- [Game mode guide, The Conveni wiki](https://wikiwiki.jp/theconveni1/%E3%82%B2%E3%83%BC%E3%83%A0%E3%83%A2%E3%83%BC%E3%83%89%E6%94%BB%E7%95%A5): map goals, starting funds, the 10-store cap, buyout prices, ratings.
- [Staff guide, The Conveni wiki](https://wikiwiki.jp/theconveni1/%E5%BA%97%E5%93%A1): staff abilities, caps, growth, wages.
- [PS review, -Vision-](https://codevis.nobody.jp/review-ps/the_convini.html): store opening, permits, hours, layout, margins, attraction loop.
- [The Conveni 3 system guide](https://www.lemono.jp/kouryaku/conveni3/system.html): permit ranges and fees, store sizes, the 4-day month, town stages.
- [The Conveni Special, PSX Datacenter](https://psxdatacenter.com/games/SLPS-01301.html): release, worlds, new buildings and staff.
- [Archived Special gameplay image](https://mimora.mimoza.jp/yao_game/retro/images/ctg_main/memorandum/detail/PS/pict/PS-0042/img_gmrPS_0042-10.webp) and [Special screenshot archive](https://www.gavas.jp/products/detail.php?product_id=9182): the art target.

### Character and setting references

The detailed character-writing references. Their source ledgers point back to the transcripts:

- [Carl](J:/carladv/CARL_CHARACTER_BIBLE.md)
- [CEO Linda](J:/carladv/CEO_LINDA_CHARACTER_BIBLE.md)
- [Spooky Ghost](J:/carladv/SPOOKY_GHOST_CHARACTER_BIBLE.md)
- [The Face, including the corrected Dyslexio form](J:/carladv/THE_FACE_CHARACTER_BIBLE.md)
- [Yoko and her alternate versions](J:/carladv/YOKO_CHARACTER_BIBLE.md)
- [JB Garfield](J:/carladv/JB_GARFIELD_CHARACTER_BIBLE.md)
- [Pee-wee Kid and associated characters](J:/carladv/PEE_WEE_KID_AND_COMPANY.md)
- [TP / Throwing in the Towel](J:/carladv/TP_CHARACTER_BIBLE.md)
- [Early stream setting research](J:/carladv/EARLY_STREAM_GAME_RESEARCH.md)
- [Dark Nights: Metal and War World research](J:/carladv/DARK_NIGHTS_METAL_AND_WAR_WORLD.md)

Selected setting references:

- [Mall ownership, system expansion, and its place outside ordinary time and space](J:/carladv/transcripts/bundle_076_9dNalSb1-W8_to_BzYHYefrK98.md:2182).
- [CEO Linda built the mall and the cast remains stranded](J:/carladv/transcripts/bundle_102_RIDS_RJHIgs_to_ZipPGQCazRE.md:1538).
- [Carl's property-damage conflict and expulsion](J:/carladv/transcripts/bundle_074_-jIw5xuA7MI_to_vA1EJP7o6zc.md:390).
- [Carl outside the mall and the limits on his conduct](J:/carladv/transcripts/bundle_074_-jIw5xuA7MI_to_vA1EJP7o6zc.md:1092).
- [Juan and imported Yokoid material](J:/carladv/transcripts/bundle_061_p4xBu0dRpUQ_to_ULoos5aRvso.md:3092).

The cited sources establish character and setting. Store identities, numbers, map districts, catalogue entries, scenario tasks, and dialogue are the proposed game design.
