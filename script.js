import Canvas from "./canvas.js?cache-busting=17201225733N";

const canvas = new Canvas(600);

canvas.addAssets([
  ['ship', 300, 300],
  ['star', 150, 150],
  ['star', 275, 500],
  ['star', 478, 371],
  ['star', 429, 175],
  ['moon', 550, 100],
  ['moon', 77, 466],
  ['moon', 278, 373],
  ['moon', 88, 97],
  ['moon', 507, 545],
  ['alien1', 550, 200],
  ['alien2', 50, 400],
  ['debris2', 100, 550]
]);

canvas.animate();
