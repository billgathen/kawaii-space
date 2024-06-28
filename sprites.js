import Animation from "./animation.js?cache-busting=17196077233N"

const fileLocation = 'images/kawaii-space-sprites.png';
const width = 300;
const height = 300;

export default class Sprites {
  constructor(canvasWidth, canvasHeight, getOtherAssets) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.getOtherAssets = getOtherAssets;
  }

  successAnimation = { row: 8, frames: 12, oneShot: true, sound: 'magic-sfx-preview-pack/healing-full.wav' }

  sprites = {
    ship: [
      { row: 0, frames: 9, reactsToCollisions: true },
      { row: 1, frames: 9, sound: 'magic-sfx-preview-pack/fire-impact-1.wav' },
    ],
    star: [
      { row: 2, frames: 12 },
    ],
    moon: [
      { row: 3, frames: 7 }
    ],
    alien1: [
      { row: 4, frames: 1, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    alien2: [
      { row: 5, frames: 12, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    debris1: [
      { row: 6, frames: 1, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    debris2: [
      { row: 7, frames: 7, reactsToCollisions: true, goalObject: true },
      this.successAnimation
    ],
    heart: [
      this.successAnimation
    ]
  }

  buildStatic(name, centerX, centerY, scale = 1, direction = 0) {
    return this._build(name, centerX, centerY, scale, direction, false)
  }

  buildDynamic(name, centerX, centerY, scale = 1, direction = 0) {
    return this._build(name, centerX, centerY, scale, direction, true)
  }

  _build(name, centerX, centerY, scale, direction, moves) {
    const newSprite = this.sprites[name];

    if (newSprite) {
      return new Animation(
        fileLocation, 
        width, 
        height, 
        direction,
        scale, 
        moves, 
        centerX, 
        centerY, 
        this.canvasWidth, 
        this.canvasHeight, 
        newSprite,
        this.getOtherAssets
      );
    } else throw new Error(`Missing sprite named '${name}'`)
  }
}