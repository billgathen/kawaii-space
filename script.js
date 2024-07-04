import Sprites from "./sprites.js?cache-busting=17201177833N";
import Canvas from "./canvas.js?cache-busting=17201177833N";

const canvas = new Canvas(600);
canvas.loadSounds([
  { name: 'gobble', path: 'magic-sfx-preview-pack/healing-full.wav' },
  { name: 'crash', path: 'magic-sfx-preview-pack/fire-impact-1.wav' }
]);

const sprites = new Sprites(canvas.width, canvas.height, canvas.getOtherAssets);
canvas.addAsset(sprites.buildDynamic('ship', 300, 300));
[ [150, 150], [275, 500], [478, 371], [429, 175] ]
  .forEach(coords => canvas.addAsset(sprites.buildStatic('star', ...coords)));

[
  [550, 100],
  [77, 466],
  [278, 373],
  [88, 97],
  [507, 545]
].forEach(coords => canvas.addAsset(sprites.buildStatic('moon', ...coords)));

canvas.addAsset(sprites.buildStatic('alien1', 550, 200));

canvas.addAsset(sprites.buildStatic('alien2', 50, 400));

canvas.addAsset(sprites.buildStatic('debris2', 100, 550));

canvas.animate();
