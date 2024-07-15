import Animation from "./animation.js?cache-busting=17210098083N"

const fileLocation = 'images/kawaii-space-sprites.png';
const spriteWidth = 300;
const spriteHeight = 300;

export default class Sprites {
  constructor(canvas) {
    this.canvas = canvas;
  }

  sounds = {
    gobble: { name: 'gobble', path: 'magic-sfx-preview-pack/healing-full.wav' },
    crash: { name: 'crash', path: 'magic-sfx-preview-pack/fire-impact-1.wav' },
    whoosh: { name: 'whoosh', path: 'magic-sfx-preview-pack/wind-effects-5.wav' }
  };
  
  successAnimation = { row: 8, frames: 12, scale: 0.25, levelOfChill: 1, oneShot: true, sound: 'gobble' }

  animations = {
    ship: [
      { row: 0, frames: 9, scale: 0.25, levelOfChill: 1, moves: true, reactsToCollisions: true },
      { row: 1, frames: 9, scale: 0.25, levelOfChill: 1, sound: 'crash' },
      { row: 8, frames: 1, scale: 0.25 }
    ],
    star: [
      { row: 2, frames: 12, scale: 0.25, levelOfChill: 3 },
    ],
    moon: [
      { row: 3, frames: 7, scale: 0.25, levelOfChill: 2 }
    ],
    alien1: [
      { row: 4, frames: 12, scale: 0.25, levelOfChill: 2, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    alien2: [
      { row: 5, frames: 12, scale: 0.25, levelOfChill: 4, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    debris1: [
      { row: 6, frames: 1, scale: 0.25, levelOfChill: 1, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    debris2: [
      { row: 7, frames: 7, scale: 0.25, levelOfChill: 4, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    heart: [
      this.successAnimation
    ],
    blackhole: [
      { row: 9, frames: 8, scale: 0.25, levelOfChill: 2, reactsToCollisions: true, completesLevel: true },
    ]
  }

  build(name, centerX, centerY) {
    const newAnimation = this.animations[name];

    if (newAnimation) {
      const animation = new Animation({
        name: name,
        fileLocation: fileLocation,
        centerX: centerX,
        centerY: centerY,
        width: spriteWidth,
        height: spriteHeight,
        canvas: this.canvas,
        animations: newAnimation
      });

      if (name === 'ship') this.setupShip(animation);

      return animation;

    } else throw new Error(`Missing sprite named '${name}'`)
  }

  setupShip(ship) {
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
      const minTouchY = 80;

      if (ship.collided || e.touches[0].clientY < minTouchY) return;

      const touchX = e.touches[0].clientX;
      if (touchX < window.innerWidth / 2) {
        if (ship.direction > 0) ship.direction -= 45;
        else ship.direction = 315;
      } else {
        if (ship.direction < 315) ship.direction += 45;
        else ship.direction = 0;
      }
    });
  }
}