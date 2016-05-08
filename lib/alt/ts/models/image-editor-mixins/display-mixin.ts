export let Display = (superclass) => class extends superclass {
  center(displayWidth, displayHeight) {
    let {width, height} = this;
    width *= this.scaleNumber;
    height *= this.scaleNumber;
    this.container.x = (displayWidth - width) / 2;
    this.container.y = (displayHeight - height) / 2;
    this.update();
  }

  scale(n:number, baseX, baseY) {
    if (baseX && baseY) {
      let prePosition  = this.normalizePixel(baseX, baseY);
      this.scaleNumber = n;
      let nextPosition = this.normalizePixel(baseX, baseY);

      let x = prePosition.x - nextPosition.x;
      let y = prePosition.y - nextPosition.y;

      this.container.x -= x * this.scaleNumber;
      this.container.y -= y * this.scaleNumber;
    } else {
      this.scaleNumber = n;
    }

    this.canvasContainer.scaleX = this.canvasContainer.scaleY = this.scaleNumber;
    this.drawGrid();
    this.stage.update();
  }

  switchGrid(bol:boolean) {
    if (this.isGridDisplay === bol) {
      return;
    }

    this.isGridDisplay = bol;
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

  private drawGrid() {
    this.container.removeChild(this.grid);

    if (!this.isGridDisplay) {
      return;
    }

    let scale = this.scaleNumber;

    if (scale <= 2) {
      return;
    }

    if (this.grid = this.gridStore[scale]) {
      this.container.addChild(this.grid);
      this.stage.update();
      return;
    }

    let {width, height} = this.canvasBitmapData;

    this.grid               = new createjs.Shape();
    let g:createjs.Graphics = this.grid.graphics;
    g.setStrokeStyle(0);
    g.beginStroke(this.gridColor);
    this.gridStore[scale] = this.grid;

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
    this.container.addChild(this.grid);
    this.stage.update();
  }

};