export default class Animation {
  constructor(name, fileLocation, width, height, direction, moves, centerX, centerY, canvasWidth, canvasHeight, animations, getOtherAssets) {
    this.name = name;
    this.image = new Image();
    this.image.src = fileLocation + "?cache-busting=17201165233N";
    this.width = width;
    this.height = height;
    this.direction = direction;
    this.scale = animations[0].scale;
    this.actualWidth = this.width * this.scale;
    this.actualHeight = this.height * this.scale;
    this.moves = moves;
    this.centerX = centerX;
    this.centerY = centerY;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.animations = animations;
    this.currentAnimationIdx = 0;
    this.currentChill = animations[0].levelOfChill;
    this.getOtherAssets = getOtherAssets;
    this.frame = Math.floor(Math.random() * (this.animation.frames - 1));

    this.frames = this.loadAnimation();
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

    if (this.moves) {
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
      ctx.restore(); // restore the drawing state  
    } else {
      const canvasLocation = [this.centerX - this.actualWidth / 2, this.centerY - this.actualHeight / 2, this.actualWidth, this.actualHeight];
      ctx.drawImage(this.image, ...animationFrame, ...canvasLocation);
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
        if (! that.animations[0].goalObject) { // crash!!!
          this.collided = true;
          if (this.animations.length > 1) { // has collision animation
            this.currentAnimationIdx = 1;
          }
          this.frames = this.loadAnimation();
          this.moves = false;
          this.play(this.animation.sound);
        } else {
          this.play(that.animations[0].sound);
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

  cell(frame, row) {
    return [
      this.width * frame,
      this.height * row,
      this.width,
      this.height
    ]
  }

  static load(fileLocation, w, h, direction, moves, centerX, centerY, canvasWidth, canvasHeight, cfg, getOtherAssets) {
    const animations = {};

    cfg.forEach((animation, idx) => animations[animation.name] = new Animation(fileLocation, w, h, direction, moves, centerX, centerY, canvasWidth, canvasHeight, idx, animation.frames, getOtherAssets));
    
    return animations;
  }
}