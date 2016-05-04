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
  static floater:createjs.Bitmap;
  static floaterBitmapData:createjs.BitmapData;

  public state:ImageEditorState;

  private scaleNumber:number = 1;

  private isGridDisplay:boolean = false;
  private gridStore:createjs.Shape[] = [];
  private gridColor:string = 'rgba(0,0,0,0.1)';

  private selectedCount:number = 0;

  // DisplayObject
  private container:createjs.Container;
  private canvasContainer:createjs.Container;
  private grid:createjs.Shape;
  private bg:createjs.Bitmap;
  private selection:createjs.Bitmap;
  private overlay:createjs.Bitmap;
  private underlay:createjs.Bitmap;
  private canvas:createjs.Bitmap;

  // BitmapData
  private selectionBitmapData:createjs.BitmapData;
  private canvasBitmapData:createjs.BitmapData;

  private selectionColor:number = 0x4400ff00;

  static find(id) {
    return this.store[id];
  }

  static clearClip() {
    this.floaterBitmapData && this.floaterBitmapData.dispose();
    this.floaterBitmapData = null;
  }

  static prepareClip(w, h) {
    this.floaterBitmapData && this.floaterBitmapData.dispose();
    this.floaterBitmapData = new createjs.BitmapData(null, w, h);
    return this.floaterBitmapData;
  }

  static prepareFloater() {
    if (!this.floaterBitmapData) {
      return null;
    }
    this.floaterBitmapData.updateContext();
    this.floater = new createjs.Bitmap(this.floaterBitmapData.canvas);
    this.floater.shadow = new createjs.Shadow("#ff0000", 2, 2, 0);
    return this.floater;
  }

  constructor(public stage, public dataURL, public width, public height, imageElement?:HTMLImageElement, overlayElement?:HTMLImageElement, underlayElement?:HTMLImageElement) {

    this.container = new createjs.Container();
    this.canvasContainer = new createjs.Container();

    this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01000000).canvas);

    this.canvasBitmapData = new createjs.BitmapData(imageElement);

    this.overlay = overlayElement
      ? new createjs.Bitmap(new createjs.BitmapData(overlayElement).canvas)
      : null;
    this.underlay = underlayElement
      ? new createjs.Bitmap(new createjs.BitmapData(underlayElement).canvas)
      : null;

    this.selectionBitmapData = new createjs.BitmapData(null, this.width, this.height);
    this.selection = new createjs.Bitmap(this.selectionBitmapData.canvas);

    this.canvas = new createjs.Bitmap(this.canvasBitmapData.canvas);

    this.underlay && this.canvasContainer.addChild(this.underlay);
    this.canvasContainer.addChild(this.canvas);
    this.overlay && this.canvasContainer.addChild(this.overlay);
    this.canvasContainer.addChild(this.selection);

    this.container.addChild(this.canvasContainer);

    stage.addChild(this.bg);
    stage.addChild(this.container);
    this.update();

    this.stateDrawing();
  }

  close() {
    this.fixFloater();
    this.update();
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
    return new DataURL(this.canvasBitmapData.canvas.toDataURL("image/png"));
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
    this.selectionBitmapData.updateContext();
    this.canvasBitmapData.updateContext();
    this.stage.update();
    this.dataURL.update(this.exportPng());
  }

  normalizePixel(rawX, rawY) {
    let x = (rawX - this.container.x) / this.scaleNumber >> 0;
    let y = (rawY - this.container.y) / this.scaleNumber >> 0;

    return {x, y};
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
