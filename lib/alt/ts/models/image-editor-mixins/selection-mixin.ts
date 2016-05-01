import ActionHistory from "../action-history";
import ImageEditor from "../image-editor";
import {ImageEditorState} from "../image-editor";

export let Selection = (superclass) => class extends superclass {
  doSelected(callback):any[] {
    if (!this.isSelected) {
      return;
    }

    let result = []
    let raw = this.selectionBitmap.context.getImageData(0, 0, this.width, this.height).data
    for (let i = raw.length - 1; i >= 0; i -= 4) {
      if (raw[i] !== 0) {
        let position = (i - 3) / 4;
        let x = (position % this.width);
        let y = position / this.width >> 0;
        let color = this.bitmapData.getPixel32(x, y);

        result.push(callback(x, y, color))
      }
    }
    return result;
  }

  clearSelection(nextStateCallback?:()=>void) {
    this.selectedCount = 0;
    this.selectionBitmap.clearRect(0, 0, this.width, this.height);
    this.selectionBitmap.setPixel(0, 0, 0);
    nextStateCallback ? nextStateCallback() : this.stateDrawing();
  }

  addSelection(x, y, add = true, update?:boolean) {
    this.fixFloater();
    if (add) {
      if (!this.isCellSelected(x, y)) {
        this.selectedCount++;
        this.selectionBitmap.setPixel32(x, y, this.selectionColor);
      }
    } else {
      if (this.isCellSelected(x, y)) {
        this.selectedCount--;
        this.selectionBitmap.setPixel32(x, y, 0);
      }
    }
    this.checkSelected();

    if (update) {
      this.update();
    }
  }

  isCellSelected(x, y) {
    return this.selectionBitmap.getPixel32(x, y) !== 0;
  }

  checkSelected() {
    if (this.selectedCount !== 0) {
      this.stateSelected();
    } else {
      this.stateDrawing();
    }
  }

  showSelection() {
    this.selection.visible = true;
    this.update();
  }

  hideSelection() {
    this.selection.visible = false;
    this.update();
  }

  normalizeStart(start, end) {
    if (start < end) {
      return {start, end}
    } else {
      return {start: end, end: start}
    }
  }

  setRectangleSelection(startX, startY, endX, endY) {
    this.clearSelection();
    let start = this.normalizePixel(startX, startY);
    let end = this.normalizePixel(endX, endY);

    let x = this.normalizeStart(start.x, end.x);
    let y = this.normalizeStart(start.y, end.y);

    for (let i = x.end; i >= x.start; i--) {
      for (let ii = y.end; ii >= y.start; ii--) {
        this.addSelection(i, ii, true)
      }
    }

    this.update();
  }

  setSelection(rawX, rawY, add = true, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);

    return this.addSelection(x, y, add, update)
  }

  setSelectionPixelToPixel(rawX, rawY, endRawX, endRawY, add = true, update?:boolean) {
    let {x, y} = this.normalizePixel(rawX, rawY);
    let end = this.normalizePixel(endRawX, endRawY);

    ImageEditor.pToP(x, y, end.x, end.y).map(({x, y})=> this.addSelection(x, y, add));

    update && this.update();
  }
};