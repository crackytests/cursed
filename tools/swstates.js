// chapter checkpoints for SAVE THE WORLD testing: STATE=<name> node tools/swplay.js
// each one is code run in the game context; it builds G and drops the party somewhere, then the bot takes over
const pre = `
  var GEAR = { rod: ['mop', 'wand', 'rod3', 'rod4', 'rod5', 'rod6'], bong: ['bong1', 'bong2', 'bong3', 'bong4', 'bong5', 'bong6'], lance: ['lance1', 'lance2', 'lance3', 'lance4', 'lance5', 'lance6'], torch: ['torch1', 'torch2', 'torch3', 'torch4', 'torch5', 'torch6'],
    mic: ['mic1', 'mic2', 'mic3', 'mic4', 'mic5', 'mic6'], cane: ['cane1', 'cane2', 'cane3', 'cane4', 'cane5', 'cane6'], toy: ['toy1', 'toy2', 'toy3', 'toy4', 'toy5', 'toy6'], dart: ['dart1', 'dart2', 'dart3', 'dart4', 'dart5', 'dart6'], any: ['wand', 'wand', 'rod3', 'rod4', 'rod5', 'rod6'] };
  var ARM = ['hoodie', 'suit', 'vest', 'armor4', 'armor5', 'armor6'], HELM = ['cap', 'hardhat', 'helm3', 'helm4', 'helm5', 'helm6'];
  function mk(list) { G = newGame(); for (const [id, lv, t] of list) addHero(id, lv, { w: GEAR[HEROES[id].weap][t], a: ARM[t], h: HELM[t] }); }
  function flags(s) { for (const f of s.split(' ').filter(Boolean)) setFlag(f); }
  function bag(gp) { G.gp = gp; invAdd('snack', 8); invAdd('meal', 4); invAdd('extralife', 4); invAdd('coffee', 3); invAdd('antivirus', 2); }
  var F1 = 'cbMarch holdmusic mineFlash wakeUp carlJoined escaped faceMet castleFire faceJoined oldfaceJoined';
  var F2 = F1 + ' returnDone away_carl raftDone gfArrive gfCleared cacheCleared garfieldJoined';
  var F3 = F2 + ' pilotHired pilotPaid trainDone kidJoined';
  var F4 = F3 + ' lindaJoined southReached prestigeIn starPlan ariaDone bruce2Done lindaTaken ghostJoined airship';
  var F5 = F4 + ' fcityIn factoryOpen extractorDone factoryDone empress gateKnown';
  var F6 = F5 + ' gateOpen dinnerInvite dinnerDone cloudRisen pilotOnCloud';
`;
module.exports = {
  face: pre + `mk([['yoko', 6, 1], ['carl', 6, 1], ['face', 6, 0]]); G.gadgets = ['drill', 'pitch']; bag(600); flags(F1.replace('oldfaceJoined', '')); delete G.flags.oldfaceJoined;
    obj('CAVE', null, 41, 40); run(() => toWorld(46, 35));`,
  raft: pre + `mk([['yoko', 12, 2], ['face', 12, 2], ['oldface', 13, 2], ['carl', 12, 2]]); G.party = ['yoko', 'face', 'oldface']; G.gadgets = ['drill', 'pitch']; bag(1500); flags(F1 + ' returnDone away_carl');
    obj('RAFT', null, 48, 50); run(() => toWorld(46, 51));`,
  train: pre + `mk([['yoko', 14, 2], ['face', 14, 2], ['oldface', 15, 2], ['garfield', 14, 2], ['carl', 14, 2]]); G.party = ['yoko', 'face', 'oldface', 'garfield']; G.gadgets = ['drill', 'pitch']; bag(2500); flags(F2);
    obj('STATION', null, 82, 64); run(() => toWorld(96, 57));`,
  plains: pre + `mk([['yoko', 16, 2], ['face', 16, 2], ['oldface', 16, 2], ['garfield', 16, 2], ['pilotx', 16, 2], ['carl', 15, 2]]); G.party = ['yoko', 'garfield', 'pilotx', 'oldface']; G.gadgets = ['drill', 'pitch']; bag(3000); flags(F2 + ' pilotHired trainDone');
    obj('BUS STOP', null, 86, 79); run(() => toWorld(86, 80));`,
  south: pre + `mk([['yoko', 18, 3], ['face', 17, 3], ['oldface', 18, 3], ['garfield', 17, 3], ['pilotx', 17, 3], ['carl', 17, 3], ['kid', 17, 3], ['linda', 18, 3]]); G.party = ['linda', 'yoko', 'carl', 'kid']; G.gadgets = ['drill', 'pitch']; bag(5000); flags(F3 + ' lindaJoined southReached'); delete G.flags.away_carl;
    obj('PRESTIGE', null, 24, 100); run(() => toWorld(27, 99));`,
  airship: pre + `mk([['yoko', 21, 3], ['face', 20, 3], ['oldface', 21, 3], ['garfield', 20, 3], ['pilotx', 20, 3], ['carl', 21, 3], ['kid', 20, 3], ['linda', 21, 3], ['ghost', 21, 3]]); G.party = ['linda', 'ghost', 'yoko', 'carl']; G.gadgets = ['drill', 'pitch']; bag(8000); flags(F4); delete G.flags.away_carl;
    obj('FRANCHISE CITY', null, 84, 100); run(() => goMap('broadcast', 9, 7, 'u'));`,
  gate: pre + `mk([['yoko', 24, 4], ['face', 23, 4], ['oldface', 24, 4], ['garfield', 23, 4], ['pilotx', 23, 4], ['carl', 24, 4], ['kid', 23, 4], ['linda', 24, 4], ['ghost', 24, 4]]); G.party = ['yoko', 'linda', 'ghost', 'carl']; G.gadgets = ['drill', 'pitch', 'chain']; G.crystals = ['clerk', 'biscuit', 'pill', 'bus', 'star', 'prof', 'yokoid', 'taka']; bag(12000); flags(F5); delete G.flags.away_carl;
    obj('MEMORY', null, 106, 104); run(async () => { await toWorld(84, 100); G.vehicle = 'air'; AIR.x = 84 * TS; AIR.y = 100 * TS; AIR.h = 90; AIR.a = 0; });`,
  cloud: pre + `mk([['yoko', 27, 4], ['face', 26, 4], ['oldface', 27, 4], ['garfield', 26, 4], ['pilotx', 26, 4], ['carl', 27, 4], ['kid', 26, 4], ['linda', 27, 4], ['ghost', 27, 4]]); G.party = ['yoko', 'linda', 'ghost', 'carl']; G.gadgets = ['drill', 'pitch', 'chain']; G.crystals = ['clerk', 'biscuit', 'pill', 'bus', 'star', 'prof', 'yokoid', 'taka']; bag(15000); flags(F6 + ' away_pilotx'); delete G.flags.away_carl;
    obj('THE CLOUD', null, 64, 61); run(async () => { await toWorld(100, 100); G.vehicle = 'air'; AIR.x = 100 * TS; AIR.y = 100 * TS; AIR.h = 90; AIR.a = Math.PI; WORLD.airCheck = async (x, y) => { if (!flag('cloudEntered') && Math.abs(x - 64) < 4 && Math.abs(y - 61) < 4) { setFlag('cloudEntered'); await cloudAscent(); } }; });`,
  wor: pre + `mk([['yoko', 28, 4], ['face', 27, 4], ['oldface', 28, 4], ['garfield', 27, 4], ['pilotx', 27, 4], ['carl', 28, 4], ['kid', 27, 4], ['linda', 29, 4], ['ghost', 28, 4]]); G.gadgets = ['drill', 'pitch', 'chain']; G.crystals = ['clerk', 'biscuit', 'pill', 'bus', 'star', 'prof', 'yokoid', 'taka']; bag(20000); flags(F6 + ' newGame pilotSaved');
    run(() => worldOfRuinStart());`,
  tower: pre + `mk([['yoko', 34, 5], ['face', 33, 5], ['oldface', 34, 5], ['garfield', 33, 5], ['pilotx', 33, 5], ['carl', 34, 5], ['kid', 33, 5], ['linda', 35, 5], ['ghost', 34, 5]]); G.gadgets = ['drill', 'pitch', 'chain', 'air']; G.crystals = ['clerk', 'biscuit', 'pill', 'bus', 'star', 'prof', 'yokoid', 'taka', 'gen', 'first']; bag(30000); invAdd('feast', 6); invAdd('espresso', 6);
    flags(F6 + ' newGame islandWoke clerkWell raftReady oldfaceBack carlBack ghostBack rerunShip towerOpen yokoBack faceBack garfieldBack kidBack'); G.world = 2; G.party = ['linda', 'yoko', 'carl', 'ghost']; G.ship = { x: 60, y: 54 };
    obj('TOWER', null, 64, 61); run(() => toWorld(59, 54));`,
};
