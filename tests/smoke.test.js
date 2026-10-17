// Node.js smoke checks for the embedded Android game. Run: node tests/smoke.test.js
const fs=require('node:fs');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root='android-studio/app/src/main/assets/';
const js=fs.readFileSync(root+'main.js','utf8');
const html=fs.readFileSync(root+'index.html','utf8');
new vm.Script(js,{filename:'main.js'});
assert.match(html,/<script src="main.js"><\/script>/);
for(const id of ['game','menu','garage','touch','hud','results','pauseMenu']){
 assert.match(html,new RegExp('id="'+id+'"'),id+' must exist');
}
assert.match(js,/function updateLapSectors\(/);
assert.match(js,/nextLapSector===lapSectors.length/);
assert.match(js,/nextLapSector=0;countdown=/);
console.log('PASS: JavaScript parses, core UI elements exist, lap checkpoints and race reset are wired.');

assert.match(html,/<script src="babylon\.js"><\/script>/, 'engine must load from bundled asset');
assert.doesNotMatch(html,/<script src="https:\/\/cdn\.babylonjs\.com/, 'runtime must not require engine CDN');
const gradle=fs.readFileSync('android-studio/app/build.gradle','utf8');
assert.match(gradle,/prepareOfflineBabylon/);
assert.match(gradle,/dependsOn\(tasks.named\('prepareOfflineBabylon'\)\)/);
console.log('PASS: offline engine asset is configured for packaging.');
