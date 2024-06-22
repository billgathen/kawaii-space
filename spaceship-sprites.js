import Animation from "./animation.js"

export default class SpaceshipSprites {
  constructor(centerX, centerY, direction, scale, canvasWidth, canvasHeight) {
    this.animations = Animation.load(
      'images/spaceship-sprites.png',
      300, 
      300, 
      direction,
      scale,
      true,
      centerX,
      centerY,
      canvasWidth,
      canvasHeight,
      [
        { name: "ship1", frames: 9 },
      ]
    );
  }
}