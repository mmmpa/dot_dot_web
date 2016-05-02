import DataURL from "./data-url";
import IDMan from "../libs/id-man";
import DataURLGenerator from "./data-url-generator";

const gen = new DataURLGenerator();

export default class LayeredImage extends IDMan {
  private invisible:boolean[];
  private overlay:DataURL;
  private underlay:DataURL;
  private locked:boolean = false;
  private storedCombined:DataURL;
  private selectedIndex:number = 0;

  constructor(public width, public height, public dataURLs:DataURL[], public version = 0) {
    super();
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

  select(index:number) {
    this.selectedIndex = index;

    if (index === 0) {
      this.overlay = null;
    } else {
      this.overlay = gen.combineImages(this.dataURLs.slice(0, index).map((d)=> this.genImage(d)), this.width, this.height)
    }

    if (index === this.dataURLs.length - 1) {
      this.underlay = null;
    } else {
      this.underlay = gen.combineImages(this.dataURLs.slice(index + 1, this.dataURLs.length).map((d)=> this.genImage(d)), this.width, this.height)
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

  get layerCount():number{
    return this.dataURLs.length;
  }
  
  get selectedElement() {
    return this.genImage(this.raw(this.selectedIndex))
  }

  get overlayElement() {
    return this.overlay ? this.genImage(this.overlay) : null;
  }

  get underlayElement() {
    return this.underlay ? this.genImage(this.underlay) : null;
  }
  
  get joinedDataURL():DataURL{
    return gen.joinFromImageElements(this.imageElements, this.width, this.height, true)
  }
  
  get joinedImageElement():HTMLImageElement{
    return this.genImage(this.joinedDataURL)
  }
  
  get imageElements():HTMLImageElement[]{
    return this.dataURLs.map((d)=> this.genImage(d));
  }

  combine() {
    return gen.combineImages(this.dataURLs.map((dataURL)=> this.genImage(dataURL)), this.width, this.height);
  }

  genImage(dataURL:DataURL):HTMLImageElement {
    let element = document.createElement('img');
    element.setAttribute('src', dataURL as string);
    return element;
  }

  clone() {
    return new LayeredImage(this.width, this.height, this.dataURLs.concat());
  }

  image(index:number):HTMLImageElement {
    return this.genImage(this.raw(index));
  }

  raw(index:number):string {
    return this.dataURLs[index] as string;
  }
}