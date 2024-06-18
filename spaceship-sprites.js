import Animation from "./animation.js"

export default class SpaceshipSprites {
  constructor(centerX, centerY, canvasWidth, canvasHeight) {
    this.animations = Animation.load(
      'images/spaceship-sprites.png',
      300, 
      300, 
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