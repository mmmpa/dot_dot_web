import LayeredImage from "../../models/layered-image";

export let CanvasMixin = (superclass) => class extends superclass {
  get leftColor() {
    let {colors, selectedColorNumber} = this.state;
    return colors[selectedColorNumber];
  }

  get rightColor() {
    let {colors, selectedColorNumber} = this.state;
    return colors[selectedColorNumber ^ 1];
  }

  pressCanvas(canvas, mouseX, mouseY, isRight = false) {
    let {x, y} = this.mousePosition(canvas, mouseX, mouseY);
    this.detectMouseAction(isRight)(x, y);
    this.dragCanvas(canvas, x, y);
  }

  dragCanvas(canvas, startX, startY, props?) {
    this.draw(startX, startY, props);
    let pre = {x: startX, y: startY};

    let move = (e:JQueryMouseEventObject)=> {
      let {x, y} = this.mousePosition(canvas, e);
      this.drawLine(pre.x, pre.y, x, y, props);
      pre = {x, y}
    };

    $(window).on('mousemove', move);
    $(window).on('mouseup', ()=> {
      $(window).off('mousemove', move);
    });
  }

  detectMouseAction(isRight = false) {
    switch (this.state.mode) {
      case 'slide':
        return this.startSlide(x, y);
      case 'select':
        return this.select.bind(this);
      default:
        return isRight
          ? (x, y)=> this.draw(x, y, this.rightColor)
          : (x, y)=> this.draw(x, y, this.leftColor);
    }
  }

  mousePosition(canvas, mouseX, mouseY) {
    var x = mouseX - canvas.offsetLeft;
    var y = mouseY - canvas.offsetTop;

    return {x, y};
  }


  select(x, y) {
    this.ie.setSelection(x, y, true);
  }

  selectLine(x, y, endX, endY) {
    this.ie.setSelectionPixelToPixel(x, y, endX, endY, true);
  }

  draw(x, y, color) {
    this.ie.setPixel(x, y, color.number, true);
    this.dispatch('frame:update');
  }

  drawLine(x, y, endX, endY, color) {
    this.ie.setPixelToPixel(x, y, endX, endY, color.number, true);
    this.dispatch('frame:update');
  }

  hideSelection(selectionHidden) {
    selectionHidden ? this.ie.hideSelection() : this.ie.showSelection()
    this.setState({selectionHidden})
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


  resizeCanvas(top, right, bottom, left) {
    let {canvasWidth, canvasHeight, frames} = this.state;
    let width = canvasWidth + left + right;
    let height = canvasHeight + top + bottom;

    let newFrames = frames.map((frame)=> {
      return new LayeredImage(width, height, [this.gen.fromImage(frame.image(0), width, height, top, left)])
    });

    this.setState({
      canvasWidth: width,
      canvasHeight: height
    }, ()=> this.dispatch('frame:replace', newFrames));
  }
};