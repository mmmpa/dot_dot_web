export default class DataUrlGenerator {
  public img:HTMLImageElement;
  public canvas:HTMLCanvasElement;
  public context:CanvasRenderingContext2D

  constructor() {
    this.img = document.createElement('img');
    this.canvas = document.createElement('canvas');
    this.context = this.canvas.getContext("2d");
  }

  blankDataUrl(w, h) {
    this.canvas.width = w;
    this.canvas.height = h;
    this.context.clearRect(0, 0, w, h);

    return this.canvas.toDataURL();
  }

  trimmer(image, baseWidth, baseHeight) {
    this.canvas.width = baseWidth;
    this.canvas.height = baseHeight;

    return (offsetX, offsetY)=> {
      this.context.clearRect(0, 0, baseWidth, baseHeight);
      this.context.drawImage(image, offsetX, offsetY, baseWidth, baseHeight, 0, 0, baseWidth, baseHeight);
      return this.canvas.toDataURL();
    }
  }

  join(images, baseWidth, baseHeight) {
    let {length} = images
    this.canvas.width = baseWidth * length;
    this.canvas.height = baseHeight;

    images.forEach((image, i)=> {
      this.context.drawImage(image, 0, 0, baseWidth, baseHeight, baseWidth * i, 0, baseWidth, baseHeight);
    });
    return this.canvas.toDataURL();
  }
}