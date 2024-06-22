export default class Animation {
  constructor(fileLocation, width, height, scale, moves, centerX, centerY, canvasWidth, canvasHeight, row, numOfFrames) {
    this.image = new Image();
    this.image.src = fileLocation;
    this.width = width;
    this.height = height;
    this.scale = scale;
    this.actualWidth = this.width * this.scale;
    this.actualHeight = this.height * this.scale;
    this.moves = moves;
    this.centerX = centerX;
    this.centerY = centerY;
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
    this.row = row;
    this.numOfFrames = numOfFrames;
    this.frame = -1; // so first call to next will get first frame

    this.frames = [];
    for(let frame = 0; frame < numOfFrames; frame++) {
      this.frames.push(this.cell(frame,row));
    }

    this.rotation = 0;
  }

  // manually-reset the cycle for an existing object
  start() {
    this.frame = -1;
  }

  next(ctx, assetSpeed) {
    if (this.frame + 1 < this.numOfFrames) this.frame++;
    else this.frame = 0;

    this.move(assetSpeed);

    const animationFrame = this.frames[this.frame];
    const canvasLocation = [-this.actualWidth / 2, -this.actualHeight / 2, this.actualWidth, this.actualHeight];

    ctx.save(); // save the current drawing state
    ctx.translate(this.centerX, this.centerY);
    ctx.rotate(this.rotation * Math.PI / 180);
    ctx.drawImage(this.image, ...animationFrame, ...canvasLocation);
    ctx.restore(); // restore the drawing state  
  }

  move(assetSpeed) {
    const direction = `${this.rotation}deg`;

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

  cell(frame, row) {
    return [
      this.width * frame,
      this.height * row,
      this.width,
      this.height
    ]
  }

  static load(fileLocation, w, h, scale, moves, centerX, centerY, canvasWidth, canvasHeight, cfg) {
    const animations = {};

    cfg.forEach((animation, idx) => animations[animation.name] = new Animation(fileLocation, w, h, scale, moves, centerX, centerY, canvasWidth, canvasHeight, idx, animation.frames));
    
    return animations;
  }
}