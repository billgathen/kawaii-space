const throttle = 5;
const assetSpeed = 4;
let gameFrame = 0;

export default class Canvas {
  constructor(width, height = 0) {
    if (height === 0) height = width; /* default to square */
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = width;
    this.canvas.height = height;

    this._assets = [];
  }

  get width() {
    return this.canvas.width;
  }

  get height() {
    return this.canvas.height;
  }

  get assets() {
    return this._assets;
  }

  addAsset(asset) {
    this._assets.push(asset);
  }

  getOtherAssets = (callingAsset) => {
    return this.assets.filter(asset => asset !== callingAsset);
  }

  animate = () => {
    if (gameFrame % throttle == 0) {
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.assets.forEach(asset => asset.next(this.ctx, assetSpeed));
    }
    
    gameFrame++;
    requestAnimationFrame(this.animate);
  }
}