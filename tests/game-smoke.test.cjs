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
console.log('PASS: JS syntax, UI IDs, game loading and racing entry points');
