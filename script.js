import SpaceshipSprites from "./spaceship-sprites.js";

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

function clearCollidedAssets() {
  allAssets = allAssets.filter(asset => !asset.collided);
}

const spaceshipSprites = new SpaceshipSprites(150, 300, 90, 0.25, 600, 600, getOtherAssets);
const ship1 = spaceshipSprites.animations.ship1;
allAssets.push(ship1);
const spaceshipSprites2 = new SpaceshipSprites(450, 300, 270, 0.25, 600, 600, getOtherAssets);
const ship2 = spaceshipSprites2.animations.ship1;
allAssets.push(ship2);

document.addEventListener('keyup', e => {
  if (e.key == 'a') { 
    if (ship1.direction > 0) ship1.direction -= 45;
    else ship1.direction = 315;
  }
  if (e.key == 'd') {
    if (ship1.direction < 315) ship1.direction += 45;
    else ship1.direction = 0;
  }
  if (e.key == 'j') { 
    if (ship2.direction > 0) ship2.direction -= 45;
    else ship2.direction = 315;
  }
  if (e.key == 'l') {
    if (ship2.direction < 315) ship2.direction += 45;
    else ship2.direction = 0;
  }
});

function animate() {
  if (gameFrame % throttle == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    allAssets.forEach(asset => asset.next(ctx, assetSpeed));
    clearCollidedAssets();
  }
  
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();