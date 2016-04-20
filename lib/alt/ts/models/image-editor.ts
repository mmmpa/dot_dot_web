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

  constructor(public stage, public width, public height, imageElement?) {
    this.container = new createjs.Container();

    this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01ffffff).canvas);

    if (imageElement) {
      this.bitmapData = new createjs.BitmapData(imageElement);
    } else {
      this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
    }

    this.canvas = new createjs.Bitmap(this.bitmapData.canvas);
    this.container.addChild(this.canvas);

    stage.addChild(this.bg);
    stage.addChild(this.container);
  }

  close() {
    this.stage.clear();
    this.stage.removeAllChildren();
  }

  once(callback:(writeHistory, bitmapData)=>void):ActionHistory[] {
    let store:{historyGroup:ActionHistory[]} = {historyGroup: []};
    callback(this.writeHistory(history), this);

    this.update();

    return store.historyGroup
  }

  exportPng() {
    return this.bitmapData.canvas.toDataURL("image/png");
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
    this.stage.update();
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

    this._gridElement = new createjs.Shape();
    let g = this._gridElement.graphics;
    g.setStrokeStyle(0);
    g.beginStroke('rgba(0,0,0,0.1)');
    this._gridStore[scale] = this._gridElement;

    _.times(height + 1, (h)=> {
      let y = h * scale - 0.5
      g.moveTo(-0.5, y);
      g.lineTo(width * scale - 0.5, y);
    });

    _.times(width + 1, (w)=> {
      let x = w * scale - 0.5
      g.moveTo(x, -0.5);
      g.lineTo(x, height * scale - 0.5);
    });
    this.container.addChild(this._gridElement);
    this.stage.update();
  }

  center(displayWidth, displayHeight) {
    let {width, height} = this;
    width *= this._scale;
    height *= this._scale;
    this.container.x = (displayWidth - width) / 2 >> 0;
    this.container.y = (displayHeight - height) / 2 >> 0;
    this.update();
  }

  scale(n:number, baseX, baseY) {
    if (baseX && baseY) {
      let prePosition = this.normalizePixel(baseX, baseY);
      this._scale = n;
      let nextPosition = this.normalizePixel(baseX, baseY);

      let x = prePosition.x - nextPosition.x;
      let y = prePosition.y - nextPosition.y;

      this.container.x -= x * this._scale;
      this.container.y -= y * this._scale;
    } else {
      this._scale = n;
    }

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

  static create(stage, w, h, imageElement?) {
    return new ImageEditor(stage, w, h, imageElement);
  }
}
