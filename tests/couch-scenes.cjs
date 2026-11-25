const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const scenes = vm.createContext({});
vm.runInContext(fs.readFileSync('app/CouchScenes.js', 'utf8'), scenes);
const place = {latitude: 34.56476, longitude: -86.52185};
const time = hour => new Date('2026-06-21T' + hour + ':00Z');
assert.equal(scenes.sceneAt(place, time('06:00'), 63), 'night');
assert.equal(scenes.sceneAt(place, time('10:35'), null), 'dawn');
assert.equal(scenes.sceneAt(place, time('18:00'), null), 'water');
assert.equal(scenes.sceneAt(place, time('18:00'), 63), 'fog');
assert.equal(scenes.sceneAt(place, time('01:00'), 0), 'golden');
assert.equal(scenes.sceneFor('fog', place, time('06:00'), null, 20), 'fog');
assert.notEqual(scenes.sceneFor('rotation', place, time('18:00'), null, 20),
    scenes.sceneFor('rotation', place, time('18:01'), null, 20));
const report = scenes.readWeather({current: {temperature_2m: 0, weather_code: 0}}, 1000);
assert.equal(scenes.weatherLabel(report, 1000, 'F'), '32°F  ·  Clear');
assert.equal(scenes.weatherLabel(report, 1000, 'C'), '0°C  ·  Clear');
assert.equal(scenes.weatherLabel(report, 7201001, 'F'), '');
assert.equal(scenes.readWeather({current: {temperature_2m: null, weather_code: 0}}, 1000), null);
