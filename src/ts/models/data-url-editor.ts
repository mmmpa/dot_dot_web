import DataURL from './data-url';

export default class DataURLEditor {
  static img_: HTMLImageElement;
  static canvas_: HTMLCanvasElement;
  static context_: CanvasRenderingContext2D;

  static get img() {
    if (!this.img_) {
      this.img_ = document.createElement('img');
    }

    return this.img_;
  }

  static get canvas() {
    if (!this.canvas_) {
      this.canvas_ = document.createElement('canvas');
    }

    return this.canvas_;
  }

  static get context() {
    if (!this.context_) {
      this.context_ = this.canvas.getContext('2d');
    }

    return this.context_;
  }

  static blankDataUrl(w, h): DataURL {
    this.canvas.width  = w;
    this.canvas.height = h;
    this.context.clearRect(0, 0, w, h);

    return new DataURL(this.canvas.toDataURL());
  }

  static imageToCanvas(image, w, h, top = 0, left = 0): HTMLCanvasElement {
    let trimX   = 0;
    let trimY   = 0;
    let offsetX = left;
    let offsetY = top;

    if (offsetX < 0) {
      trimX   = -offsetX;
      offsetX = 0;
    }

    if (offsetY < 0) {
      trimY   = -offsetY;
      offsetY = 0;
    }

    this.canvas.width  = w;
    this.canvas.height = h;
    this.context.clearRect(0, 0, w, h);
    this.context.drawImage(image, trimX, trimY, w, h, offsetX, offsetY, w, h);

    return this.canvas;
  }

  static fromImage(image, w, h, top = 0, left = 0): DataURL {
    return new DataURL(this.imageToCanvas(image, w, h, top, left).toDataURL());
  }

  static combineImages(images: HTMLImageElement[], w, h): DataURL {
    this.canvas.width  = w;
    this.canvas.height = h;
    this.context.clearRect(0, 0, w, h);
    images.reverse().forEach((image) => {
      this.context.drawImage(image, 0, 0, w, h, 0, 0, w, h);
    });
    return new DataURL(this.canvas.toDataURL());
  }

  static combineDataURLs(dataURLs: DataURL[], w, h): DataURL {
    let images = dataURLs.map((d) => this.convertToImage(d));
    return this.combineImages(images, w, h);
  }

  static trimmer(image, baseWidth, baseHeight) {
    this.canvas.width  = baseWidth;
    this.canvas.height = baseHeight;

    return (offsetX, offsetY) => {
      this.context.clearRect(0, 0, baseWidth, baseHeight);
      this.context.drawImage(image, offsetX, offsetY, baseWidth, baseHeight, 0, 0, baseWidth, baseHeight);
      return new DataURL(this.canvas.toDataURL());
    };
  }

  static join(images, baseWidth, baseHeight) {
    let {length} = images;
    this.canvas.width  = baseWidth * length;
    this.canvas.height = baseHeight;

    images.forEach((image, i) => {
      this.context.drawImage(image, 0, 0, baseWidth, baseHeight, baseWidth * i, 0, baseWidth, baseHeight);
    });
    return new DataURL(this.canvas.toDataURL());
  }

  static joinDataURLs(dataURLs: DataURL[], baseWidth, baseHeight, vertical: boolean = false) {
    let {length} = dataURLs;
    let images = dataURLs.map((d) => this.convertToImage(d));

    if (vertical) {
      this.canvas.width  = baseWidth;
      this.canvas.height = baseHeight * length;
      images.forEach((image, i) => {
        this.context.drawImage(image, 0, 0, baseWidth, baseHeight, 0, baseHeight * i, baseWidth, baseHeight);
      });
    } else {
      this.canvas.width  = baseWidth * length;
      this.canvas.height = baseHeight;
      images.forEach((image, i) => {
        this.context.drawImage(image, 0, 0, baseWidth, baseHeight, baseWidth * i, 0, baseWidth, baseHeight);
      });
    }

    return new DataURL(this.canvas.toDataURL());
  }

  static convertToImage(dataURL: DataURL): HTMLImageElement {
    if (!dataURL) {
      return;
    }
    let element = document.createElement('img');
    element.setAttribute('src', dataURL.data);
    return element;
  }
}
