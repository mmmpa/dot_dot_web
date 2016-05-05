import ActionHistory from "../action-history";
import ImageEditor from "../image-editor";
import DataURL from "../data-url";
import DataURLEditor from "../data-url-editor";

export interface IDrawing {
  draw(x, y, color, update?:boolean),
  fill(rawX, rawY, color, update?:boolean),
  getPixel(rawX, rawY),
  setPixel(rawX, rawY, color, update?:boolean),
  setPixelToPixel(rawX, rawY, endRawX, endRawY, color, update?:boolean),
}

export let Drawing = (superclass) => class extends superclass {
  draw(x, y, color, update?:boolean = false, stock? = true) {
    this.fixFloater();
    if (this.isSelected) {
      if (!this.isCellSelected(x, y)) {
        return;
      }
    }

    let oldColor = this.canvasBitmapData.getPixel32(x, y);
    this.canvasBitmapData.setPixel32(x, y, color);
    if (update) {
      this.update();
    }

    if (stock) {
      ImageEditor.history.stock({
        up: ()=> {
          this.draw(x, y, color, true, false);
        },
        down: ()=> {
          this.draw(x, y, oldColor, true, false);
        }
      });
    }

    return {x, y, color, oldColor}
  }

  fill(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    let old = this.canvasBitmapData.getPixel32(x, y);
    let updated = this.canvasBitmapData.floodFill(x, y, color);

    if (!!updated && updated.length > 0) {
      update && this.update();

      ImageEditor.history.stock({
        up: ()=> {
          updated.forEach(({x, y})=> this.draw(x, y, color, false, false));
          this.update();
        },
        down: ()=> {
          updated.forEach(({x, y})=> this.draw(x, y, old, false, false));
          this.update();
        }
      });
    }
  }

  getPixel(rawX, rawY) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.canvasBitmapData.getPixel32(x, y);
  }

  setPixel(rawX, rawY, color, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.draw(x, y, color, update)
  }

  setPixelToPixel(rawX, rawY, endRawX, endRawY, color, update?:boolean = false, stock? = true) {
    let {x, y} = this.normalizePixel(rawX, rawY);
    let end = this.normalizePixel(endRawX, endRawY);

    let points = ImageEditor.pToP(x, y, end.x, end.y);
    let histories = points.map(({x, y})=> this.draw(x, y, color, false, false)).reverse();

    update && this.update();

    if (stock) {
      ImageEditor.history.stockPrevious({
        up: ()=> {
          histories.forEach(({x, y, color})=> this.draw(x, y, color, false, false));
          this.update();
        },
        down: ()=> {
          histories.forEach(({x, y, oldColor})=> this.draw(x, y, oldColor, false, false));
          this.update();
        }
      });
    }
  }
};