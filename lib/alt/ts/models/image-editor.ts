import ActionHistory from "./action-history";
declare const createjs;

export default class ImageEditor {
  private _scale:number = 1;

  constructor(public stage, public bitmap, public bitmapData:any) {
    this.stage.onPress = (e)=> console.log(e)
  }

  once(callback:(writeHistory, bitmapData)=>void):ActionHistory[] {
    let store:{historyGroup:ActionHistory[]} = {historyGroup: []};
    callback(this.writeHistory(history), this);

    this.update();

    return store.historyGroup
  }

  scaleStep(n) {
    this.scale(this._scale + n);
  }

  writeHistory(store) {
    return (...args)=> {
      store.historyGroup = args;
    }
  }

  scale(n:number) {
    this._scale = n;
    if (this._scale < 1) {
      this._scale = 1;
    }
    this.bitmap.scaleX = this.bitmap.scaleY = this._scale;
    this.stage.update();
  }

  update() {
    console.log('update')
    this.bitmapData.updateContext();
    this.stage.update();
  }

  setPixel(rawX, rawY, color, update?:boolean) {
    let x = rawX / this._scale >> 0;
    let y = rawY / this._scale >> 0;

    let old = this.bitmapData.getPixel32(x, y);
    this.bitmapData.setPixel32(x, y, color);
    if (update) {
      this.update();
    }
    return new ActionHistory('setPixel', {x, y, color: old}, {x, y, color});
  }

  static create(stage, w, h) {
    let bitmapData = new createjs.BitmapData(null, w, h, 0xffffffff);
    let bitmap = new createjs.Bitmap(bitmapData.canvas);
    stage.addChild(bitmap);

    return new ImageEditor(stage, bitmap, bitmapData);
  }
}
