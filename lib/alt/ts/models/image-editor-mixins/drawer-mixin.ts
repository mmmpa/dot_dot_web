import ActionHistory from "../action-history";
import ImageEditor from "../image-editor";

export let Drawing = (superclass) => class extends superclass {
  draw(x, y, color, update?:boolean) {
    this.fixFloater();
    if (this.isSelected) {
      if (!this.isCellSelected(x, y)) {
        return;
      }
    }
    let old = this.bitmapData.getPixel32(x, y);
    this.bitmapData.setPixel32(x, y, color);
    if (update) {
      this.update();
    }
    console.log(old, color)
    return new ActionHistory('setPixel', {x, y, color: old}, {x, y, color});
  }

  fill(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    let targetColor = this.bitmapData.getPixel32(x, y);
    if (targetColor === color) {
      return;
    }

    this.fillLine(x, y, targetColor, color);
    update && this.update();
  }

  fillLine(x, y, targetColor, color, from = 0) {
    this.bitmapData.setPixel32(x, y, color);

    for (let fx = x + 1; fx < this.width && this.bitmapData.getPixel32(fx, y) === targetColor; fx++) {
      this.bitmapData.setPixel32(fx, y, color);
      this.fillLineUpDown(fx, y, targetColor, color, from)
    }
    for (let fx = x - 1; fx >= 0 && this.bitmapData.getPixel32(fx, y) === targetColor; fx--) {
      this.bitmapData.setPixel32(fx, y, color);
      this.fillLineUpDown(fx, y, targetColor, color, from)
    }
  }

  fillLineUpDown(x, y, targetColor, color, from = 0) {
    if (from !== -1 && y - 1 >= 0 && this.bitmapData.getPixel32(x, y - 1) === targetColor) {
      this.fillLine(x, y - 1, targetColor, color, 0);
    }

    if (from !== 1 && y + 1 <= this.height && this.bitmapData.getPixel32(x, y + 1) === targetColor) {
      this.fillLine(x, y + 1, targetColor, color, 0);
    }
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