import ActionHistory from "./action-history";
declare const createjs;

export default class ImageEditor {
  private _scale:number = 1;
  private _grid:boolean = false;
  private _gridElement:any = null;
  private _gridStore:any[] = [];
  private _gridColor = 0xff000000;

  constructor(public stage, private _canvasElement, public bitmapData:any) {
    this.stage.onPress = (e)=> console.log(e)
  }

  once(callback:(writeHistory, bitmapData)=>void):ActionHistory[] {
    let store:{historyGroup:ActionHistory[]} = {historyGroup: []};
    callback(this.writeHistory(history), this);

    this.update();

    return store.historyGroup
  }

  writeHistory(store) {
    return (...args)=> {
      store.historyGroup = args;
    }
  }

  switchGrid(bol:boolean) {
    if (this._grid === bol) {
      return;
    }

    this._grid = bol;
    this.drawGrid();
  }

  drawGrid() {
    this.stage.removeChild(this._gridElement);

    if (!this._grid) {
      return;
    }

    let scale = this._scale

    if(this._gridElement = this._gridStore[scale]){
      this.stage.addChild(this._gridElement);
      this.stage.update();
      return;
    }

    let {width, height} = this.bitmapData;
    let bitmapData = new createjs.BitmapData(null, width * scale, height * scale, 0x01000000);
    this._gridElement = new createjs.Bitmap(bitmapData.canvas);
    this._gridStore[scale] = this._gridElement;

    _.times(height, (h)=> {
      _.times(width, (w)=> {
        bitmapData.setPixel32(w * scale, h  * scale, this._gridColor)
      });
    });
    bitmapData.updateContext();
    this.stage.addChild(this._gridElement);
    this.stage.update();
  }

  scale(n:number) {
    this._scale = n;
    if (this._scale < 1) {
      this._scale = 1;
    }
    let {width, height} = this._canvasElement.image;

    this._canvasElement.scaleX = this._canvasElement.scaleY = this._scale;
    this.drawGrid();
    this.stage.update();
  }

  update() {
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
