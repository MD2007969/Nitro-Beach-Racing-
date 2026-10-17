'use strict';
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const js = fs.readFileSync(path.join(root,'android-studio/app/src/main/assets/main.js'),'utf8');
const html = fs.readFileSync(path.join(root,'android-studio/app/src/main/assets/index.html'),'utf8');
new vm.Script(js,{filename:'main.js'});
const ids = [...js.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)/g)].map(m=>m[1]);
const missing = [...new Set(ids)].filter(id=>!html.includes('id="'+id+'"'));
assert.deepEqual(missing,[],'Every referenced UI element must exist');
for (const id of ['game','menu','garage','results','pauseMenu','touch']) {
  assert.ok(html.includes('id="'+id+'"'),'Missing essential UI element: '+id);
}
assert.match(html,/<script src="main\.js"><\/script>/,'Main game must load');
assert.match(js,/engine\.runRenderLoop\(/,'Rendering loop must be registered');
assert.match(js,/function begin\(/,'Race startup must exist');
assert.match(js,/function finish\(/,'Race completion must exist');
const lapModule = {exports: {}};
vm.runInNewContext(fs.readFileSync(path.join(root, 'android-studio/app/src/main/assets/lap-progress.js'), 'utf8'),
  {module: lapModule}, {filename: 'lap-progress.js'});
const createLapTracker = lapModule.exports;
assert.ok(html.includes('<script src="lap-progress.js"></script><script src="main.js"></script>'),
  'Lap tracker must load before the game');
const lap = createLapTracker(160);
function drive(tracker, from, to) {
  let counted = 0;
  for (let i = from; i <= to; i++) if (tracker.update(i % 160)) counted++;
  return counted;
}
assert.equal(drive(lap, 1, 159), 0, 'Passing intermediate gates must not award a lap');
assert.equal(lap.update(0), true, 'A full circuit awards exactly one lap');
assert.equal(drive(lap, 1, 159), 0);
assert.equal(lap.update(0), true, 'The following full circuit awards one more lap');
lap.reset();
assert.equal(lap.update(159), false, 'Reversing over the start line is not a lap');
assert.equal(lap.update(0), false, 'Returning to the start line is not a lap');
lap.reset();
drive(lap, 1, 120);
assert.equal(lap.update(159), false, 'A position jump invalidates the gate sequence');
assert.equal(lap.update(0), false, 'A jump followed by a finish crossing is not a lap');
lap.reset();
drive(lap, 1, 119);
assert.equal(lap.update(120, false), false, 'An off-track gate is ignored');
drive(lap, 121, 159);
assert.equal(lap.update(0), false, 'The missed gate prevents a lap');
console.log('PASS: JS syntax, UI IDs, game loading and lap progression');
