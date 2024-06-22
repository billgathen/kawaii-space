import Animation from "./animation.js"

export default class SpaceshipSprites {
  constructor(centerX, centerY, direction, scale, canvasWidth, canvasHeight, getOtherAssets) {
    this.animations = Animation.load(
      'images/spaceship-sprites.png',
      300, 
      300, 
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