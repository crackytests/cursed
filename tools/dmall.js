// run every DARK MONDAY check: node tools/dmall.js   (add FULL=1 to also autopilot all three endings)
const { spawnSync } = require('child_process'); const path = require('path'); let bad = 0;
const run = (name, args, env = {}) => { const r = spawnSync('node', [path.join(__dirname, name + '.js'), ...args], { env: Object.assign({}, process.env, env), encoding: 'utf8', timeout: 540000 }); const last = (r.stdout || '').trim().split('\n').pop() || (r.stderr || '').slice(0, 120); const good = r.status === 0; if (!good) bad++; console.log((good ? 'ok   ' : 'FAIL ') + (name + ' ' + args.join(' ')).trim().padEnd(26) + last.slice(0, 110)); };
for (const t of ['dmtest', 'dmcombat', 'dmsys', 'dmspell', 'dmreach', 'dmflowtest', 'dmpolish', 'dmlint']) run(t, []);
run('dmplay', ['1', '400000'], { WANT: 'end=collect' });
if (process.env.FULL) for (const e of ['forgive', 'job']) run('dmplay', ['1', '400000'], { WANT: 'end=' + e + ',truth=1' });
console.log(bad ? bad + ' CHECKS FAILED' : 'EVERYTHING PASSES'); process.exit(bad ? 1 : 0);
