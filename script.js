import Sprites from "./sprites.js?cache-busting=17196099133N";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height = 600;
let gameFrame = 0;
const throttle = 5;
const assetSpeed = 4;
let allAssets = [];

function getOtherAssets(callingAsset) {
  return allAssets.filter(asset => asset !== callingAsset);
}

const sprites = new Sprites(canvas.width, canvas.height, getOtherAssets);
const ship = sprites.buildDynamic('ship', 300, 300, 0.25);
allAssets.push(ship);
[
  [150, 150],
  [275, 500],
  [478, 371],
  [429, 175]
].forEach(coords => {
  const star = sprites.buildStatic('star', ...coords, 0.25);
  star.levelOfChill = 3;
  allAssets.push(star);
});

[
  [550, 100],
  [77, 466],
  [278, 373],
  [88, 97],
  [507, 545]
].forEach(coords => {
  const moon = sprites.buildStatic('moon', ...coords, 0.25)
  moon.levelOfChill = 2;
  allAssets.push(moon);
});

const alien1 = sprites.buildStatic('alien1', 550, 200, 0.25);
allAssets.push(alien1);

const alien2 = sprites.buildStatic('alien2', 50, 400, 0.25);
alien2.levelOfChill = 4;
allAssets.push(alien2);

const debris2 = sprites.buildStatic('debris2', 100, 550, 0.25);
debris2.levelOfChill = 4;
allAssets.push(debris2);

document.addEventListener('keyup', e => {
  if (ship.collided) return;

  if (e.key == 'ArrowLeft') { 
    if (ship.direction > 0) ship.direction -= 45;
    else ship.direction = 315;
  }
  if (e.key == 'ArrowRight') {
    if (ship.direction < 315) ship.direction += 45;
    else ship.direction = 0;
  }
});

document.addEventListener('touchstart', e => {
  if (ship.collided) return;

  const touchX = e.touches[0].clientX;
  if (touchX < window.innerWidth / 2) {
    if (ship.direction > 0) ship.direction -= 45;
    else ship.direction = 315;
  } else {
    if (ship.direction < 315) ship.direction += 45;
    else ship.direction = 0;
  }
});

loadSound('gobble', 'magic-sfx-preview-pack/healing-full.wav');
loadSound('crash', 'magic-sfx-preview-pack/fire-impact-1.wav');

function loadSound(name, path) {
  fetch(`sounds/${path}`)
  .then(response => response.blob())
  .then(blob => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result;
      localStorage.setItem(name, base64data);
    };
  })
  .catch(error => console.error('Error fetching audio:', error));
}

function animate() {
  if (gameFrame % throttle == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allAssets.forEach(asset => asset.next(ctx, assetSpeed));
  }
  
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();