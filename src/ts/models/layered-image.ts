import DataURL from "./data-url";
import IDMan from "../libs/id-man";
import DataURLEditor from "./data-url-editor";

const gen = DataURLEditor;

export default class LayeredImage extends IDMan {
  public overlay:DataURL;
  public underlay:DataURL;
  public selected:DataURL;
  public selectedIndex:number;

  private locked:boolean = false;
  private storedCombined:DataURL;

  constructor(public width, public height, public dataURLs:DataURL[], public version = 0) {
    super();
    this.select(0);
  }

  get combined() {
    if (this.locked) {
      return this.storedCombined;
    }
    return this.combine();
  }

  get joinedDataURL():DataURL {
    return gen.joinDataURLs(this.dataURLs, this.width, this.height, true)
  }

  get layerCount():number {
    return this.dataURLs.length;
  }

  add(index:number) {
    let blank = gen.blankDataUrl(this.width, this.height);
    this.dataURLs.splice(index, 0, blank);
    this.select(index + 1)
  }

  remove(index:number) {
    if (this.dataURLs.length === 1) {
      return;
    }
    this.dataURLs.splice(index, 1);
  }

  moveUpward(index:number, callback?:(index)=>void) {
    if (index === 0) {
      return;
    }

    let target = this.raw(index);
    this.dataURLs.splice(index, 1);
    this.dataURLs.splice(index - 1, 0, target);
    callback && callback(index - 1);
  }

  moveDownward(index:number, callback:(index)=>void) {
    if (index === this.dataURLs.length - 1) {
      return;
    }

    let target = this.raw(index);
    this.dataURLs.splice(index, 1);
    this.dataURLs.splice(index + 1, 0, target);
    callback && callback(index + 1);
  }


  select(index:number, force:boolean = false) {
    if (!force && this.selectedIndex === index) {
      return;
    }
    this.selectedIndex = index;

    if (index === 0) {
      this.overlay = null;
    } else {
      this.overlay = gen.combineDataURLs(this.dataURLs.slice(0, index), this.width, this.height);
    }

    if (index === this.dataURLs.length - 1) {
      this.underlay = null;
    } else {
      this.underlay = gen.combineDataURLs(this.dataURLs.slice(index + 1, this.dataURLs.length), this.width, this.height);
    }

    this.selected = this.raw(index);
  }

  lock() {
    this.storedCombined = this.combine();
    this.locked = true;
  }

  unlock() {
    this.storedCombined = null;
    this.locked = false;
  }

  update(index:number, dataURL:DataURL) {
    this.dataURLs[index].update(dataURL);
    this.version++;
  }

  scale(n:number = 4) {
    return {
      width: this.width * n,
      height: this.height * n
    }
  }

  combine():DataURL {
    return gen.combineDataURLs(this.dataURLs, this.width, this.height);
  }

  clone() {
    return new LayeredImage(this.width, this.height, this.dataURLs.map((d)=> new DataURL(d.data)));
  }

  raw(index:number):DataURL {
    return this.dataURLs[index];
  }
}