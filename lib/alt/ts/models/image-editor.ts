import ActionHistory from "./action-history";
declare const createjs;

export default class ImageEditor {
  private _scale:number = 1;
  private _grid:boolean = false;
  private _gridElement:any = null;
  private _gridStore:any[] = [];
  private _gridColor = 0xff000000;

  private container:any;
  private bg:any;
  private canvas:any;

  private bitmapData:any;

  public mode:string;

  constructor(public stage, public width, public height) {
    this.container = new createjs.Container();

    this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0xffeeeeee).canvas);

    this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
    this.canvas = new createjs.Bitmap(this.bitmapData.canvas);

    this.container.addChild(this.canvas);

    stage.addChild(this.bg);
    stage.addChild(this.container);
  }

  once(callback:(writeHistory, bitmapData)=>void):ActionHistory[] {
    let store:{historyGroup:ActionHistory[]} = {historyGroup: []};
    callback(this.writeHistory(history), this);

    this.update();

    return store.historyGroup
  }

  startSlide() {
    let startX = this.container.x;
    let startY = this.container.y;

    return (xRange, yRange)=> {
      this.container.x = startX + xRange;
      this.container.y = startY + yRange;
      this.update();
    }
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
    this.container.removeChild(this._gridElement);

    if (!this._grid) {
      return;
    }

    let scale = this._scale;

    if (scale <= 2) {
      return;
    }

    if (this._gridElement = this._gridStore[scale]) {
      this.container.addChild(this._gridElement);
      this.stage.update();
      return;
    }

    let {width, height} = this.bitmapData;
    let bitmapData = new createjs.BitmapData(null, width * scale, height * scale, 0x01000000);
    this._gridElement = new createjs.Bitmap(bitmapData.canvas);
    this._gridStore[scale] = this._gridElement;

    _.times(height, (h)=> {
      _.times(width, (w)=> {
        bitmapData.setPixel32(w * scale, h * scale, this._gridColor)
      });
    });
    bitmapData.updateContext();
    this.container.addChild(this._gridElement);
    this.stage.update();
  }

  scale(n:number) {
    this._scale = n;
    if (this._scale < 1) {
      this._scale = 1;
    }
    let {width, height} = this.canvas.image;

    this.canvas.scaleX = this.canvas.scaleY = this._scale;
    this.drawGrid();
    this.stage.update();
  }

  update() {
    this.bitmapData.updateContext();
    this.stage.update();
  }

  normalizePixel(rawX, rawY) {
    let x = (rawX - this.container.x) / this._scale >> 0;
    let y = (rawY - this.container.y) / this._scale >> 0;
    
    return {x, y};
  }

  setPixel(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    let old = this.bitmapData.getPixel32(x, y);
    this.bitmapData.setPixel32(x, y, color);
    if (update) {
      this.update();
    }
    return new ActionHistory('setPixel', {x, y, color: old}, {x, y, color});
  }

  static create(stage, w, h) {
    return new ImageEditor(stage, w, h);
  }
}
