import DataURL from "./data-url";
import IDMan from "../libs/id-man";
import DataURLGenerator from "./data-url-generator";

const gen = new DataURLGenerator();

export default class LayeredImage extends IDMan {
  private up:DataURL;
  private down:DataURL;
  private locked:boolean = false;
  private storedCombined:DataURL;
  private selectedIndex:number = 0;

  constructor(public width, public height, public dataURLs:DataURL[], public version = 0) {
    super();
  }

  add(index:number) {
    let blank = gen.blankDataUrl(this.width, this.height);
    this.dataURLs.splice(index, 0, blank);
  }

  remove(index:number) {
    if(this.dataURLs.length === 1){
      return;
    }
    this.dataURLs.splice(index, 1);
  }

  select(index:number) {
    this.selectedIndex = index;
    if (index === 0) {
      this.up = null;
    } else {

    }
    if (index === this.dataURLs.length - 1) {
      this.down = null;
    } else {

    }
    return this.raw(index);
  }

  lock() {
    this.storedCombined = this.combine();
    this.locked = true;
  }

  unlock() {
    this.storedCombined = null;
    this.locked = false;
  }

  update(index:number, dataURL) {
    this.dataURLs[index] = dataURL;
    this.version++;
  }

  scale(n:number = 4) {
    return {
      width: this.width * n,
      height: this.height * n
    }
  }

  get combined() {
    if (this.locked) {
      return this.storedCombined;
    }
    return this.combine();
  }

  combine() {
    return gen.combineImages(this.dataURLs.map((dataURL)=> this.genImage(dataURL)), this.width, this.height);
  }

  genImage(dataURL:DataURL):HTMLImageElement {
    let element = document.createElement('img');
    element.setAttribute('src', dataURL as string);
    return element;
  }

  image(index:number):HTMLImageElement {
    return this.genImage(this.raw(index));
  }

  raw(index:number):string {
    return this.dataURLs[index] as string;
  }
}