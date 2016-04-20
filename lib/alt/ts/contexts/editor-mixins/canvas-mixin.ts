export let CanvasMixin = (superclass) => class extends superclass {
  draw(x, y) {
    this.ie.setPixel(x, y, this.state.selectedColor.number, true);
    this.updateFrame();
  }

  drawOnce(points) {
    points.forEach(({x, y})=> this.ie.setPixel(x, y, this.state.selectedColor.number));
    this.ie.update();
    this.updateFrame();
  }

  scaleStep(direction, x?, y?) {
    let {scale} = this.state;
    scale += direction;
    if (scale < 0) {
      scale = 0;
    } else if (scale >= this.scaleNumbers.length) {
      scale = this.scaleNumbers.length - 1;
    }

    this.scale(scale, x, y)
    this.setState({scale});
  }

  scale(scale?, x?, y?) {
    this.ie.scale(this.scaleNumbers[scale || this.state.scale], x, y);
    if (!x && !y) {
      this.center();
    }
  }

  center() {
    let {canvasComponentWidth, canvasComponentHeight} = this.state;
    return this.ie.center(parseInt(canvasComponentWidth), parseInt(canvasComponentHeight));
  }

  toggleGrid() {
    this.setState({grid: !this.state.grid})
  }
};