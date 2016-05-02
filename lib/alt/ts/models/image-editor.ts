import ActionHistory from "./action-history";
import IDMan from "../libs/id-man";
declare const createjs;
import {mix} from "../libs/mix"
import {Drawing} from "./image-editor-mixins/drawer-mixin"
import {Selection} from "./image-editor-mixins/selection-mixin"
import {Display} from "./image-editor-mixins/display-mixin"
import {Editor} from "./image-editor-mixins/editor-mixin"
import {State} from "./image-editor-mixins/state-mixin"
import LayeredImage from "./layered-image";
import DataURL from "../../test/src/models/data-url";

export enum ImageEditorState{
  Drawing,
  Selected,
  Floating
}

export default class ImageEditor extends mix(IDMan).with(Drawing, Selection, Display, Editor, State) {
  static id:number = 0;
  static store:ImageEditor[] = [];

  static floater:any;
  static floaterBitmap:any;

  public state:ImageEditorState

  private _scale:number = 1;
  private _grid:boolean = false;
  private _gridElement:any = null;
  private _gridStore:any[] = [];
  private _gridColor = 0xff000000;

  private container:any;
  private bg:any;
  private canvas:any;
  private canvasContainer:any;

  private selectedCount:number = 0;
  private selection:any;
  private selectionBitmap:any;

  private bitmapData:any;

  private floater;

  public mode:string;

  private selectionColor = 0x4400ff00;

  public onChange:(id:ImageEditor)=>void;

  static find(id) {
    return this.store[id];
  }

  constructor(public stage, public width, public height, imageElement?, overlayElement?, underlayElement?) {

    this.container = new createjs.Container();
    this.canvasContainer = new createjs.Container();

    this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01000000).canvas);

    if (imageElement) {
      this.bitmapData = new createjs.BitmapData(imageElement);
    } else {
      this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
    }

    let overlay = overlayElement ? new createjs.Bitmap(new createjs.BitmapData(overlayElement).canvas) : null;
    let underlay = underlayElement ? new createjs.Bitmap(new createjs.BitmapData(underlayElement).canvas) : null;

    this.width = this.bitmapData.width;
    this.height = this.bitmapData.height;

    this.selectionBitmap = new createjs.BitmapData(null, this.width, this.height);
    this.selection = new createjs.Bitmap(this.selectionBitmap.canvas);

    this.canvas = new createjs.Bitmap(this.bitmapData.canvas);

    underlay && this.canvasContainer.addChild(underlay);
    this.canvasContainer.addChild(this.canvas);
    overlay && this.canvasContainer.addChild(overlay);
    this.container.addChild(this.canvasContainer);
    this.container.addChild(this.selection);
    stage.addChild(this.bg);
    stage.addChild(this.container);
    this.update();

    this.stateDrawing();
  }

  close() {
    this.fixFloater();
    this.onChange && this.onChange(this);
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
    return new DataURL(this.bitmapData.canvas.toDataURL("image/png"));
  }

  get position() {
    return {
      x: this.container.x,
      y: this.container.y
    }
  }

  writeHistory(store) {
    return (...args)=> {
      store.historyGroup = args;
    }
  }

  update() {
    this.selectionBitmap.updateContext();
    this.bitmapData.updateContext();
    this.stage.update();
    this.onChange && this.onChange(this);
  }

  normalizePixel(rawX, rawY) {
    let x = (rawX - this.container.x) / this._scale >> 0;
    let y = (rawY - this.container.y) / this._scale >> 0;

    return {x, y};
  }

  static clearClip() {
    this.floaterBitmap && this.floaterBitmap.dispose();
    this.floaterBitmap = null;
  }

  static prepareClip(w, h) {
    this.floaterBitmap && this.floaterBitmap.dispose();
    this.floaterBitmap = new createjs.BitmapData(null, w, h);
    return this.floaterBitmap;
  }

  static prepareFloater() {
    if (!this.floaterBitmap) {
      return null;
    }
    this.floaterBitmap.updateContext();
    this.floater = new createjs.Bitmap(this.floaterBitmap.canvas);
    this.floater.shadow = new createjs.Shadow("#ff0000", 2, 2, 0);
    return this.floater;
  }

  static create(stage, w, h, imageElement?) {
    return new ImageEditor(stage, w, h, imageElement);
  }

  static createLayered(stage, layeredImage:LayeredImage) {
    return new ImageEditor(stage, layeredImage.width, layeredImage.height, layeredImage.selectedElement, layeredImage.overlayElement, layeredImage.underlayElement);
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
