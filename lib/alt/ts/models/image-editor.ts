import ActionHistory from "./action-history";
declare const createjs;

export default class ImageEditor {
  static id:number = 0;
  static store:ImageEditor[] = [];

  public id:number;
  private _scale:number = 1;
  private _grid:boolean = false;
  private _gridElement:any = null;
  private _gridStore:any[] = [];
  private _gridColor = 0xff000000;

  private container:any;
  private bg:any;
  private canvas:any;

  private selectedCount:number = 0;
  private selection:any;
  private selectionBitmap:any;

  private floater:any;
  private floaterBitmap:any;

  private blankBitmap:any;
  private blank:any;

  private bitmapData:any;
  private img;

  public mode:string;

  private selectionColor = 0x4400ff00;

  static genId() {
    return this.id++;
  }

  static find(id) {
    return this.store[id];
  }

  constructor(public stage, public width, public height, imageElement?) {
    this.id = ImageEditor.genId();

    this.container = new createjs.Container();

    this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01000000).canvas);

    if (imageElement) {
      this.bitmapData = new createjs.BitmapData(imageElement);
    } else {
      this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
    }

    this.width = this.bitmapData.width;
    this.height = this.bitmapData.height;

    this.blankBitmap = new createjs.BitmapData(null, this.width, this.height, 0x11ff0000);
    this.blank = new createjs.Bitmap(this.blankBitmap.canvas);
    this.selectionBitmap = new createjs.BitmapData(null, this.width, this.height);
    this.selection = new createjs.Bitmap(this.selectionBitmap.canvas);

    this.img = new Image;
    this.img.src = this.blankBitmap.canvas.toDataURL();


    this.canvas = new createjs.Bitmap(this.bitmapData.canvas);

    this.container.addChild(this.canvas);
    this.container.addChild(this.selection);

    stage.addChild(this.bg);
    stage.addChild(this.container);
    this.update();

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

  slide(x, y, update?) {
    this.container.x += x;
    this.container.y += y;
    update && this.update();
  }

  posit({x, y}) {
    this.container.x = x;
    this.container.y = y;
  }

  get position() {
    return {
      x: this.container.x,
      y: this.container.y
    }
  }

  floatSelection() {
    this.floaterBitmap = new createjs.BitmapData(null, this.width, this.height);
    this.floater = new createjs.Bitmap(this.floaterBitmap.canvas);
  }

  doSelected(callback):any[] {
    if (!this.isSelected()) {
      return;
    }

    let result = []
    let raw = this.selectionBitmap.context.getImageData(0, 0, this.width, this.height).data
    for (let i = raw.length - 1; i >= 0; i -= 4) {
      if (raw[i] !== 0) {
        let position = (i - 3) / 4;
        let x = (position % this.width);
        let y = position / this.width >> 0;

        result.push(callback(x, y, color))
      }
    }
    return result;
  }

  del() {
    let result = this.doSelected((x, y, color)=> this.draw(x, y, 0));
    console.log(result)
    this.update();
  }

  copy() {
    if (!this.isSelected()) {
      return;
    }
    this.bitmapData.copyPixels(this.blankBitmap, this.bitmapData.rect, {x: 0, y: 0}, this.selectionBitmap, {x: 0, y: 0}, true);
    this.bitmapData.updateImageData();
    this.update();
  }

  fixFloater() {
    if (!this.isFloated()) {
      return;
    }
  }

  isFloated() {
    return !!this.floater;
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
    this.container.x = (displayWidth - width) / 2;
    this.container.y = (displayHeight - height) / 2;
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
    this.selection.scaleX = this.selection.scaleY = this._scale;
    this.drawGrid();
    this.stage.update();
  }

  update() {
    this.selectionBitmap.updateContext();
    this.bitmapData.updateContext();
    this.stage.update();
  }

  normalizePixel(rawX, rawY) {
    let x = (rawX - this.container.x) / this._scale >> 0;
    let y = (rawY - this.container.y) / this._scale >> 0;

    return {x, y};
  }

  isCellSelected(x, y) {
    return this.selectionBitmap.getPixel32(x, y) !== 0;
  }

  isSelected() {
    return this.selectedCount !== 0;
  }

  addSelection(x, y, add = true, update?:boolean) {
    if (add) {
      if (!this.isCellSelected(x, y)) {
        this.selectedCount++;
        this.selectionBitmap.setPixel32(x, y, this.selectionColor);
      }
    } else {
      if (this.isCellSelected(x, y)) {
        this.selectedCount--;
        this.selectionBitmap.setPixel32(x, y, 0);
      }
    }

    if (update) {
      this.update();
    }
  }

  draw(x, y, color, update?:boolean) {
    if (this.isSelected()) {
      if (!this.isCellSelected(x, y)) {
        return;
      }
    }
    let old = this.bitmapData.getPixel32(x, y);
    this.bitmapData.setPixel32(x, y, color);
    if (update) {
      this.update();
    }
    return new ActionHistory('setPixel', {x, y, color: old}, {x, y, color});
  }

  showSelection() {
    this.selection.visible = true;
    this.update();
  }

  hideSelection() {
    this.selection.visible = false;
    this.update();
  }

  setSelection(rawX, rawY, add = true, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.addSelection(x, y, add, update)
  }

  setSelectionPixelToPixel(rawX, rawY, endRawX, endRawY, add = true, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);
    let end = this.normalizePixel(endRawX, endRawY);

    ImageEditor.pToP(x, y, end.x, end.y).map(({x, y})=> this.addSelection(x, y, add));

    update && this.update();
  }

  setPixel(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.draw(x, y, color, update)
  }

  setPixelToPixel(rawX, rawY, endRawX, endRawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);
    let end = this.normalizePixel(endRawX, endRawY);

    let points = ImageEditor.pToP(x, y, end.x, end.y);
    let histories = points.map(({x, y})=> this.draw(x, y, color));

    update && this.update();

    return histories;
  }

  static create(stage, w, h, imageElement?) {
    return new ImageEditor(stage, w, h, imageElement);
  }

  static pToP(x, y, endX, endY) {
    let points = []

    let moveX = x - endX;
    let moveY = y - endY;

    let getSupport = (n)=> {
      let minus = (i) => i - 1;
      let plus = (i) => i + 1;

      return n < 0 ? plus : minus;
    };

    if (moveX !== 0 || moveY !== 0) {
      let power = moveY / moveX;

      let xSupport = getSupport(moveX);
      for (let i = moveX; i; i = xSupport(i)) {
        points.push({x: x - i, y: Math.round(y - i * power)})
      }

      let ySupport = getSupport(moveY);
      for (let i = moveY; i; i = ySupport(i)) {
        points.push({x: Math.round(x - i / power), y: y - i})
      }
    }

    return points
  }
}
