import ImageEditor from '../image-editor';

export let Editor = (superclass) => class extends superclass {
  del() {
    if (!this.isSelected) {
      return;
    }
    let updated = this.doSelected((x, y, color) => this.setPixel(x, y, 0, false, false));
    this.clearSelection();
    this.update();
    this.stockPixels(updated);
  }

  copy() {
    if (!this.isSelected) {
      return;
    }
    let clip = ImageEditor.prepareClip(this.width, this.height);
    this.doSelected((x, y, color) => clip.setPixel32(x, y, color));
    this.update();
  }

  paste() {
    this.clearSelection(() => null);
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
    let clip    = ImageEditor.prepareClip(this.width, this.height);
    let updated = this.doSelected((x, y, color) => {
      clip.setPixel32(x, y, color);
      return this.setPixel(x, y, 0, false, false);
    });
    this.clearSelection();
    this.update();
    this.stockPixels(updated);
  }

  fixFloater(): boolean {
    if (!this.isFloating) {
      return false;
    }

    let raw     = ImageEditor.floaterBitmapData.context.getImageData(0, 0, this.width, this.height).data;
    let offsetX = ImageEditor.floater.x;
    let offsetY = ImageEditor.floater.y;

    let updated = [];
    for (let i = raw.length - 1; i >= 0; i -= 4) {
      if (raw[i] !== 0) {
        let position = (i - 3) / 4;
        let x        = (position % this.width);
        let y        = position / this.width >> 0;
        let color    = ImageEditor.floaterBitmapData.getPixel32(x, y);
        updated.push(this.setPixel(x + offsetX, y + offsetY, color, false, false, false));
      }
    }

    this.stateDrawing();
    this.canvasContainer.removeChild(this.floater);
    this.floater = null;
    this.stockPixels(updated);
    this.update();
    return true;
  }

  move(t, r, b, l) {
    if (!this.isFloating) {
      return;
    }
    switch (true) {
      case t !== 0:
        return this.moveTop(t);
      case r !== 0:
        return this.moveRight(r);
      case b !== 0:
        return this.moveBottom(b);
      case l !== 0:
        return this.moveLeft(l);
      default:
        return;
    }
  }

  moveTop(n) {
    ImageEditor.floater.y += n;
    this.update();
  }

  moveRight(n) {
    ImageEditor.floater.x += n;
    this.update();
  }

  moveBottom(n) {
    ImageEditor.floater.y += n;
    this.update();
  }

  moveLeft(n) {
    ImageEditor.floater.x += n;
    this.update();
  }
};
