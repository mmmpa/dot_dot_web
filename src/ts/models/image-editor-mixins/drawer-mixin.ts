import ImageEditor from "../image-editor";

export let Drawing = (superclass) => class extends superclass {
  fill(rawX, rawY, color, update?:boolean) {
    let {x, y}  = this.normalizePixel(rawX, rawY);
    let updated = this.canvasBitmapData.floodFill(x, y, color);

    this.stockPixels(updated);
    update && this.update();
  }

  getPixel(rawX, rawY) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.canvasBitmapData.getPixel32(x, y);
  }

  draw(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.setPixel(x, y, color, update)
  }

  drawPixelToPixel(rawX, rawY, endRawX, endRawY, color, update?:boolean = false, stock? = true) {
    let {x, y} = this.normalizePixel(rawX, rawY);
    let end = this.normalizePixel(endRawX, endRawY);

    let points    = ImageEditor.pToP(x, y, end.x, end.y);
    let updated = points.map(({x, y})=> this.setPixel(x, y, color, false, false)).reverse();

    update && this.update();

    if (stock) {
      ImageEditor.history.stockPrevious({
        up: ()=> {
          updated.forEach(({x, y, color})=> this.setPixel(x, y, color, false, false));
        },
        down: ()=> {
          updated.forEach(({x, y, oldColor})=> this.setPixel(x, y, oldColor, false, false));
        }
      });
    }
  }

  private isDrawable(x, y) {
    return !this.isSelected || this.isCellSelected(x, y)
  }

  private setPixel(x, y, color, update?:boolean = false, stock? = true, fix? = true) {
    if (fix && this.fixFloater()) {
      return;
    }

    if (!this.isDrawable) {
      return;
    }

    let oldColor = this.canvasBitmapData.getPixel32(x, y);
    this.canvasBitmapData.setPixel32(x, y, color);

    let updated = {x, y, color, oldColor}

    stock && this.stockPixels([updated]);
    update && this.update();

    return updated
  }
};