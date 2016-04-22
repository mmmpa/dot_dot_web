export let CanvasMixin = (superclass) => class extends superclass {
  draw(x, y, color) {
    this.ie.setPixel(x, y, color.number, true);
    this.updateFrame();
  }

  drawOnce(points, color) {
    points.forEach(({x, y})=> this.ie.setPixel(x, y, color.number));
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
    this.ie.switchGrid(!this.state.grid)
    this.setState({grid: !this.state.grid})
  }

  resizeCanvasFromModal(component) {
    let modalProps = {
      canvasWidth: this.state.canvasWidth,
      canvasHeight: this.state.canvasHeight,
      onComplete: (top, right, bottom, left)=> {
        this.dispatch('modal:hide');
        this.dispatch('canvas:size:complete', top, right, bottom, left);
      },
      onCancel: ()=> {
        this.dispatch('modal:hide');
      }
    };
    this.dispatch('modal:rise', component, modalProps);
  }


  resizeCanvas(top, right, bottom, left){
    
  }
};