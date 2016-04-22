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

  fromImage(image, w, h, top = 0, left = 0) {
    let trimX = 0;
    let trimY = 0;
    let offsetX = left;
    let offsetY = top;

    if(offsetX < 0){
      trimX = -offsetX;
      offsetX = 0;
    }

    if(offsetY < 0){
      trimY = -offsetY;
      offsetY = 0;
    }

    this.canvas.width = w;
    this.canvas.height = h;
    this.context.clearRect(0, 0, w, h);
    this.context.drawImage(image, trimX, trimY, w, h, offsetX, offsetY, w, h);

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