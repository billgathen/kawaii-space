import Sprites from "./sprites.js?cache-busting=17210098083N";
import { levels } from "./config.js?cache-busting=17210098083N";

const baseAssetSpeed = 4;

const frameInterval = 80; /* 12.5fps */
let timeToNextFrame = 0;
let lastTime = 0;

export default class Canvas {
  constructor(width, height = 0) {
    this.canvas = document.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.font = '20px Arial';

    this.canvas.width = width;
    this.canvas.height = height == 0 ? width : height; /* default to square */
    this.sprites = new Sprites(this);

    this.loadSounds(Object.values(this.sprites.sounds));

    this.level = 0;
    this.levelCompleted = false;
    this.opacityChange = -0.01;
    this.setupLevel();

    this.assetSpeed = baseAssetSpeed;
    this.assetSpeed = this.assetSpeed;
    this.savedAssetSpeed = null;
  }

  setupLevel() {
    this._assets = [];
    this.addAssets(levels[this.level]);
    this.totalGoalObjects = this.assets.filter(asset => asset.animation.goalObject).length;
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

  removeAsset(asset) {
    this._assets = this._assets.filter(a => a !== asset);
    const goalObjectsRemaining = this.assets.filter(asset => asset.animation.goalObject).length;
    if (goalObjectsRemaining === 0) {
      this.addAsset('blackhole', this.width / 2, this.height / 2);
    }
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

  transitionLevels() {
    this.savedAssetSpeed ||= this.assetSpeed;
    this.assetSpeed = 0;
    this.ctx.globalAlpha = Number(this.ctx.globalAlpha + this.opacityChange).toFixed(2);

    if (this.ctx.globalAlpha <= 0) {
      this.opacityChange *= -1;
      this.nextLevel();
    }

    if (this.ctx.globalAlpha >= 1) {
      this.levelCompleted = false;
      this.ctx.globalAlpha = 1;
      this.assetSpeed = this.savedAssetSpeed;
      this.savedAssetSpeed = null;
      this.opacityChange *= -1;
    }
  }

  /* Maintain consistent animation speed on all devices */
  animate = (timestamp) => {
    if (this.levelCompleted) this.transitionLevels();

    let deltatime = timestamp - lastTime;
    lastTime = timestamp;
    timeToNextFrame += deltatime;

    if (timeToNextFrame > frameInterval) {
      timeToNextFrame = 0;
      this.ctx.clearRect(0, 0, this.width, this.height);
      this.assets.forEach(asset => asset.next(this.ctx, this.assetSpeed));
    }
    
    requestAnimationFrame(() => this.animate(new Date().getTime()));
  }

  nextLevel() {
    this.level++;
    if (this.level >= levels.length) {
      this.level = 0;
      this.savedAssetSpeed += 2;
    }
    this.setupLevel();
  }
}