export default class LayeredImage {
  static id:number = 0;

  static genId() {
    return this.id++;
  }

  constructor(public width, public height, public images:any[], public version = 0) {
    this.id = LayeredImage.genId();
  }

  update(index:number, dataUrl) {
    this.images[index] = dataUrl;
    this.version++;
  }

  scale(n:number = 4) {
    return {
      width: this.width * n,
      height: this.height * n
    }
  }

  image(index:number) {
    let element = document.createElement('img');
    element.setAttribute('src', this.raw(index));
    return element;
  }

  raw(index:number) {
    return this.images[index];
  }
}