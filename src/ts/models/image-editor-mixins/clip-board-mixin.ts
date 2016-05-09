export let ClipBoardMixin = (superclass) => class extends superclass {
  static clearClip() {
    this.floaterBitmapData && this.floaterBitmapData.dispose();
    this.floaterBitmapData = null;
  }

  static prepareClip(w, h) {
    this.floaterBitmapData && this.floaterBitmapData.dispose();
    this.floaterBitmapData = new createjs.BitmapData(null, w, h);
    return this.floaterBitmapData;
  }

  static prepareFloater() {
    if (!this.floaterBitmapData) {
      return null;
    }
    this.floaterBitmapData.updateContext();
    this.floater        = new createjs.Bitmap(this.floaterBitmapData.canvas);
    this.floater.shadow = new createjs.Shadow('#ff0000', 2, 2, 0);
    return this.floater;
  }
};
