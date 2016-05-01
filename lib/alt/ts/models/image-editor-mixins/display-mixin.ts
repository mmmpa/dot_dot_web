import ActionHistory from "../action-history";
import ImageEditor from "../image-editor";

export let Display = (superclass) => class extends superclass {
  center(displayWidth, displayHeight) {
    let {width, height} = this;
    width *= this._scale;
    height *= this._scale;
    this.container.x = (displayWidth - width) / 2;
    this.container.y = (displayHeight - height) / 2;
    this.update();
  }

  scale(n:number, baseX, baseY) {
    if (baseX && baseY) {
      let prePosition = this.normalizePixel(baseX, baseY);
      this._scale = n;
      let nextPosition = this.normalizePixel(baseX, baseY);

      let x = prePosition.x - nextPosition.x;
      let y = prePosition.y - nextPosition.y;

      this.container.x -= x * this._scale;
      this.container.y -= y * this._scale;
    } else {
      this._scale = n;
    }

    this.canvasContainer.scaleX = this.canvasContainer.scaleY = this._scale;
    this.selection.scaleX = this.selection.scaleY = this._scale;
    this.drawGrid();
    this.stage.update();
  }


  drawGrid() {
    this.container.removeChild(this._gridElement);

    if (!this._grid) {
      return;
    }

    let scale = this._scale;

    if (scale <= 2) {
      return;
    }

    if (this._gridElement = this._gridStore[scale]) {
      this.container.addChild(this._gridElement);
      this.stage.update();
      return;
    }

    let {width, height} = this.bitmapData;

    this._gridElement = new createjs.Shape();
    let g = this._gridElement.graphics;
    g.setStrokeStyle(0);
    g.beginStroke('rgba(0,0,0,0.1)');
    this._gridStore[scale] = this._gridElement;

    _.times(height + 1, (h)=> {
      let y = h * scale - 0.5
      g.moveTo(-0.5, y);
      g.lineTo(width * scale - 0.5, y);
    });

    _.times(width + 1, (w)=> {
      let x = w * scale - 0.5
      g.moveTo(x, -0.5);
      g.lineTo(x, height * scale - 0.5);
    });
    this.container.addChild(this._gridElement);
    this.stage.update();
  }

  switchGrid(bol:boolean) {
    if (this._grid === bol) {
      return;
    }

    this._grid = bol;
    this.drawGrid();
    this.stage.update();
  }

  slide(x, y, update?) {
    this.container.x += x;
    this.container.y += y;
    update && this.update();
  }

  posit({x, y}) {
    this.container.x = x;
    this.container.y = y;
  }
};