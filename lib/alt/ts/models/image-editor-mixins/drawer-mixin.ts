import ActionHistory from "../action-history";
import ImageEditor from "../image-editor";

export interface IDrawing{
  draw(x, y, color, update?:boolean),
  fill(rawX, rawY, color, update?:boolean),
  getPixel(rawX, rawY),
  setPixel(rawX, rawY, color, update?:boolean),
  setPixelToPixel(rawX, rawY, endRawX, endRawY, color, update?:boolean),
}

export let Drawing = (superclass) => class extends superclass {
  draw(x, y, color, update?:boolean) {
    this.fixFloater();
    if (this.isSelected) {
      if (!this.isCellSelected(x, y)) {
        return;
      }
    }
    let old = this.canvasBitmapData.getPixel32(x, y);
    this.canvasBitmapData.setPixel32(x, y, color);
    if (update) {
      this.update();
    }
    return new ActionHistory('setPixel', {x, y, color: old}, {x, y, color});
  }

  fill(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    this.canvasBitmapData.floodFill(x, y, color);
    update && this.update();
  }

  getPixel(rawX, rawY){
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.canvasBitmapData.getPixel32(x, y);
  }

  setPixel(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.draw(x, y, color, update)
  }

  setPixelToPixel(rawX, rawY, endRawX, endRawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);
    let end = this.normalizePixel(endRawX, endRawY);

    let points = ImageEditor.pToP(x, y, end.x, end.y);
    let histories = points.map(({x, y})=> this.draw(x, y, color));

    update && this.update();

    return histories;
  }
};