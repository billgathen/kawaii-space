import Sprites from "./sprites.js?cache-busting=17201225733N";

const throttle = 5;
const assetSpeed = 4;
let gameFrame = 0;

export default class Canvas {
  constructor(width, height = 0) {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');

    this.canvas.width = width;
    this.canvas.height = height == 0 ? width : height; /* default to square */
    this.sprites = new Sprites(this); //this.canvas.width, this.canvas.height, this.getOtherAssets);

    this.loadSounds(Object.values(this.sprites.sounds));

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

  addAsset(assetName, x, y) {
    this._assets.push(this.sprites.build(assetName, x, y));
  }

  addAssets(assets) {
    assets.forEach(asset => this.addAsset(...asset) );
  }

  getOtherAssets = (callingAsset) => {
    return this.assets.filter(asset => asset !== callingAsset);
  }

  loadSound(sound) {
    fetch(`sounds/${sound.path}`)
    .then(response => response.blob())
    .then(blob => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        localStorage.setItem(sound.name, base64data);
      };
    })
    .catch(error => console.error('Error fetching audio:', error));
  }

  loadSounds(sounds) {
    sounds.forEach(sound => this.loadSound(sound));
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