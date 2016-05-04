import ActionHistory from "../action-history";
import ImageEditor from "../image-editor";
import {ImageEditorState} from "../image-editor";

export interface IEditor{
  del(),
  copy(),
  paste(),
  cut(),
  fixFloater(),
  move(t, r, b, l)
}

export let Editor = (superclass) => class extends superclass {
  del() {
    if (!this.isSelected) {
      return;
    }
    let result = this.doSelected((x, y, color)=> this.draw(x, y, 0));
    this.clearSelection();
    this.update();
  }

  copy() {
    if (!this.isSelected) {
      return;
    }
    let clip = ImageEditor.prepareClip(this.width, this.height);
    this.doSelected((x, y, color)=> clip.setPixel32(x, y, color));
    this.update();
  }

  paste() {
    this.clearSelection(()=> null);
    this.fixFloater();
    this.floater = ImageEditor.prepareFloater();
    if (!this.floater) {
      return;
    }
    this.canvasContainer.addChild(this.floater);
    this.stateFloating();
    this.update();
  }

  cut() {
    if (!this.isSelected) {
      return;
    }
    let clip = ImageEditor.prepareClip(this.width, this.height);
    let result = this.doSelected((x, y, color)=> {
      clip.setPixel32(x, y, color);
      return this.draw(x, y, 0);
    });
    this.clearSelection();
    this.update();
  }

  fixFloater() {
    if (!this.isFloating) {
      return;
    }

    let raw = ImageEditor.floaterBitmapData.context.getImageData(0, 0, this.width, this.height).data;
    let offsetX = ImageEditor.floater.x;
    let offsetY = ImageEditor.floater.y;

    for (let i = raw.length - 1; i >= 0; i -= 4) {
      if (raw[i] !== 0) {
        let position = (i - 3) / 4;
        let x = (position % this.width);
        let y = position / this.width >> 0;
        let color = ImageEditor.floaterBitmapData.getPixel32(x, y);
        this.canvasBitmapData.setPixel32(x + offsetX, y + offsetY, color);
      }
    }

    this.stateDrawing();
    this.canvasContainer.removeChild(this.floater);
    this.floater = null;
    this.canvasBitmapData.updateContext();
  }

  move(t, r, b, l) {
    console.log(this.isFloating)
    if (!this.isFloating) {
      return;
    }
    if (t) return this.moveTop(t);
    if (r) return this.moveRight(r);
    if (b) return this.moveBottom(b);
    if (l) return this.moveLeft(l);
  }

  moveTop(n) {
    ImageEditor.floater.y -= 1
    this.update();
  }

  moveRight(n) {
    ImageEditor.floater.x += 1
    this.update();
  }

  moveBottom(n) {
    ImageEditor.floater.y += 1
    this.update();
  }

  moveLeft(n) {
    ImageEditor.floater.x -= 1
    this.update();
  }
};