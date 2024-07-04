import Animation from "./animation.js?cache-busting=17201165233N"

const fileLocation = 'images/kawaii-space-sprites.png';
const width = 300;
const height = 300;

export default class Sprites {
  constructor(canvasWidth, canvasHeight, getOtherAssets) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.getOtherAssets = getOtherAssets;
  }

  successAnimation = { row: 8, frames: 12, scale: 0.25, levelOfChill: 1, oneShot: true, sound: 'gobble' }

  sprites = {
    ship: [
      { row: 0, frames: 9, scale: 0.25, levelOfChill: 1, reactsToCollisions: true },
      { row: 1, frames: 9, scale: 0.25, levelOfChill: 1, sound: 'crash' },
    ],
    star: [
      { row: 2, frames: 12, scale: 0.25, levelOfChill: 3 },
    ],
    moon: [
      { row: 3, frames: 7, scale: 0.25, levelOfChill: 2 }
    ],
    alien1: [
      { row: 4, frames: 1, scale: 0.25, levelOfChill: 1, reactsToCollisions: true, goalObject: true },
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
    ]
  }

  buildStatic(name, centerX, centerY, direction = 0) {
    return this._build(name, centerX, centerY, direction, false)
  }

  buildDynamic(name, centerX, centerY, direction = 0) {
    const animation = this._build(name, centerX, centerY, direction, true)
    
    return animation;
  }

  _build(name, centerX, centerY, direction, moves) {

    const newSprite = this.sprites[name];

    if (newSprite) {
      const animation = new Animation(
        name,
        fileLocation, 
        width, 
        height, 
        direction,
        moves, 
        centerX, 
        centerY, 
        this.canvasWidth, 
        this.canvasHeight, 
        newSprite,
        this.getOtherAssets
      );

      if (name === 'ship') {
        document.addEventListener('keyup', e => {
          if (animation.collided) return;
  
          if (e.key == 'ArrowLeft') { 
            if (animation.direction > 0) animation.direction -= 45;
            else animation.direction = 315;
          }
          if (e.key == 'ArrowRight') {
            if (animation.direction < 315) animation.direction += 45;
            else animation.direction = 0;
          }
        });
  
        document.addEventListener('touchstart', e => {
          if (animation.collided) return;
  
          const touchX = e.touches[0].clientX;
          if (touchX < window.innerWidth / 2) {
            if (animation.direction > 0) animation.direction -= 45;
            else animation.direction = 315;
          } else {
            if (animation.direction < 315) animation.direction += 45;
            else animation.direction = 0;
          }
        });
      }

      return animation;

    } else throw new Error(`Missing sprite named '${name}'`)
  }
}