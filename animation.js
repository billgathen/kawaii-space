export default class Animation {
  constructor(sprite) {
    this.sprite = sprite;
    this.image = new Image();
    this.image.src = sprite.fileLocation + "?cache-busting=17201279123N";
    this.centerX = sprite.centerX;
    this.centerY = sprite.centerY;
    this.width = sprite.width;
    this.height = sprite.height;
    this.scale = sprite.animations[0].scale;
    this.actualWidth = this.width * this.scale;
    this.actualHeight = this.height * this.scale;
    this.canvasWidth = sprite.canvas.width;
    this.canvasHeight = sprite.canvas.height;
    this.animations = sprite.animations;
    this.direction = 0;
    this.currentAnimationIdx = 0;
    this.currentChill = this.animations[0].levelOfChill;
    this.getOtherAssets = this.sprite.canvas.getOtherAssets;
    this.frame = Math.floor(Math.random() * (this.animation.frames - 1));

    this.frames = this.loadAnimation();

    this.score = 0;
  }

  get animation() {
    return this.animations[this.currentAnimationIdx];
  }

  loadAnimation() {
    const frames = [];
    const cfg = this.animation;
    for(let f = 0; f < cfg.frames; f++) {
      frames.push(this.cell(f,cfg.row));
    }
    return frames;
  }

  // manually-reset the cycle for an existing object
  start() {
    this.frame = -1;
  }

  next(ctx, assetSpeed) {
    if (this.animation.oneShot && this.frame + 1 === this.frames.length) return;

    if (--this.currentChill <= 0) {
      if (this.frame + 1 < this.frames.length) this.frame++;
      else this.frame = 0;
      this.currentChill = this.animation.levelOfChill;
    }

    if (this.animation.moves) {
      this.move(assetSpeed);
    }

    if (this.animation.reactsToCollisions) {
      this.checkForCollision();
    }

    const animationFrame = this.frames[this.frame];
    
    if (this.direction !== 0) {
      ctx.save(); // save the current drawing state
      ctx.translate(this.centerX, this.centerY);
      ctx.rotate(this.direction * Math.PI / 180);
      const canvasLocation = [-this.actualWidth / 2, -this.actualHeight / 2, this.actualWidth, this.actualHeight];
      ctx.drawImage(this.image, ...animationFrame, ...canvasLocation);
      this.displayScore(ctx, canvasLocation);
      ctx.restore(); // restore the drawing state  
    } else {
      const canvasLocation = [this.centerX - this.actualWidth / 2, this.centerY - this.actualHeight / 2, this.actualWidth, this.actualHeight];
      ctx.drawImage(this.image, ...animationFrame, ...canvasLocation);
      this.displayScore(ctx, canvasLocation);
    }
  }

  move(assetSpeed) {
    const direction = `${this.direction}deg`;

    const currentSpeed = ['45deg', '135deg', '225deg', '315deg'].indexOf(direction) > -1 ? assetSpeed * 0.75 : assetSpeed;

    const hasRoomAbove = this.centerY - currentSpeed > this.actualHeight / 2;
    const hasRoomRight = this.centerX + currentSpeed < this.canvasWidth - this.actualWidth / 2;
    const hasRoomBelow = this.centerY + currentSpeed < this.canvasHeight - this.actualHeight / 2;
    const hasRoomLeft  = this.centerX - currentSpeed > this.actualWidth / 2;

    const movementRules = {
      "0deg": () => { if (hasRoomAbove) this.centerY -= currentSpeed },
      "45deg": () => {
        if (hasRoomAbove) this.centerY -= currentSpeed;
        if (hasRoomRight) this.centerX += currentSpeed;
      },
      "90deg": () => { if (hasRoomRight) this.centerX += currentSpeed },
      "135deg": () => {
        if (hasRoomBelow) this.centerY += currentSpeed;
        if (hasRoomRight) this.centerX += currentSpeed;
      },
      "180deg": () => { if (hasRoomBelow) this.centerY += currentSpeed },
      "225deg": () => {
        if (hasRoomBelow) this.centerY += currentSpeed;
        if (hasRoomLeft) this.centerX -= currentSpeed;
      },
      "270deg": () => { if (hasRoomLeft) this.centerX -= assetSpeed },
      "315deg": () => {
        if (hasRoomAbove) this.centerY -= currentSpeed;
        if (hasRoomLeft) this.centerX -= currentSpeed;
      },
    }
    if (movementRules[direction]) movementRules[direction]();
  }

  // Pythagorean theorem FTW: width used as radius of the circle
  checkForCollision() {
    this.getOtherAssets(this).forEach((that) => {
      const xDistance = this.centerX - that.centerX;
      const yDistance = this.centerY - that.centerY;
      const distance = Math.sqrt(xDistance * xDistance + yDistance * yDistance);
      const touchingDistance = Math.abs(this.actualWidth * 0.4 + that.actualWidth * 0.4);
      if (distance <= touchingDistance) {
        if (that.animations[0].goalObject) {
          this.play(that.animations[0].sound);
          if (! that.collided) {
            this.score++;
          }
        } else {
          this.collided = true;
          if (this.animations.length > 1) { // has collision animation
            this.currentAnimationIdx = 1;
          }
          this.frames = this.loadAnimation();
          this.moves = false;
          this.play(this.animation.sound);
        }
      }
    })
  }

  play(sound) {
    if (sound) {
      const audio = new Audio(localStorage.getItem(sound));
      audio.volume = 0.33;
      audio.play();
    }
  }

  displayScore(ctx, canvasLocation) {
    if (this.score === 0) return;

    const shrinkage = (3 - this.score) * 30; /* heart gets bigger as score increases */

    canvasLocation[0] += (this.actualWidth + shrinkage) * 0.125;
    canvasLocation[1] += (this.actualHeight + shrinkage) * 0.1;
    canvasLocation[2] -= (this.actualWidth + shrinkage) * 0.25;
    canvasLocation[3] -= (this.actualHeight + shrinkage) * 0.3;

    const cell = this.cell(0, 8); /* heart */
    ctx.drawImage(this.image, ...cell, ...canvasLocation);
  }

  cell(frame, row) {
    return [
      this.width * frame,
      this.height * row,
      this.width,
      this.height
    ]
  }
}