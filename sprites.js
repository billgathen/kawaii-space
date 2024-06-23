import Animation from "./animation.js"

const fileLocation = 'images/kawaii-space-sprites.png';
const width = 300;
const height = 300;

class SpaceshipSprites {
  constructor(centerX, centerY, direction, scale, canvasWidth, canvasHeight, getOtherAssets) {
    this.animations = Animation.load(
      fileLocation,
      width, 
      height, 
      direction,
      scale,
      true, // moving object
      centerX,
      centerY,
      canvasWidth,
      canvasHeight,
      [
        { name: "ship1", frames: 9 },
      ],
      getOtherAssets
    );
  }
}

export default class Sprites {
  constructor(canvasWidth, canvasHeight, getOtherAssets) {
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.getOtherAssets = getOtherAssets;
  }

  sprites = {
    ship: [
      { row: 0, frames: 9 },
      { row: 1, frames: 9 },
    ],
    star: [
      { row: 2, frames: 12 },
    ],
    moon: [
      { row: 3, frames: 7 }
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