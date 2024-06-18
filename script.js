import SpaceshipSprites from "./spaceship-sprites.js";

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');

canvas.width = canvas.height = 600;
let gameFrame = 0;
let throttle = 5;
let assetSpeed = 4;
const spaceshipSprites = new SpaceshipSprites(300, 300, 600, 600);
let ship1 = spaceshipSprites.animations.ship1;

document.addEventListener('keyup', e => {
  if (e.key == 'a') { 
    if (ship1.rotation > 0) ship1.rotation -= 45;
    else ship1.rotation = 315;
  }
  if (e.key == 'd') {
    if (ship1.rotation < 315) ship1.rotation += 45;
    else ship1.rotation = 0;
  }
});

function animate() {
  if (gameFrame % throttle == 0) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ship1.next(ctx, assetSpeed);
  }
  
  gameFrame++;
  requestAnimationFrame(animate);
}

animate();