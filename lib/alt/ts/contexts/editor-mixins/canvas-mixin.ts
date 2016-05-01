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

  pressCanvas(x, y, isRight = false) {
    this.detectPressAction(isRight)(x, y);
  }

  dragCanvas(startX, startY, x, y, endX, endY, isRight = false) {
    this.detectDragAction(isRight)(startX, startY, x, y, endX, endY);
  }

  copyCanvas() {
    this.ie.copy();
    this.dispatch('frame:update');
  }
  
  cutCanvas() {
    this.ie.cut();
    this.dispatch('frame:update');
  }

  pasteCanvas() {
    this.ie.paste();
    this.dispatch('frame:update');
  }

  delSelection() {
    this.ie.del();
    this.dispatch('frame:update');
  }

  moveCanvas(t,r,b,l){
    this.ie.move(t,r,b,l);
  }

  detectPressAction(isRight = false) {
    switch (true) {
      case this.isSlideMode():
        return (...args)=> null;
      case this.isSelectRectangleMode():
        return (...args)=> null;
      case this.isSelectMode():
        return isRight
          ? (x, y)=> this.select(x, y, false)
          : (x, y)=> this.select(x, y);
      default:
        return isRight
          ? (x, y)=> this.draw(x, y, this.rightColor)
          : (x, y)=> this.draw(x, y, this.leftColor);
    }
  }

  detectDragAction(isRight = false) {
    switch (true) {
      case this.isSlideMode():
        return (startX, startY, x, y, endX, endY)=> this.slide(x, y, endX, endY);
      case this.isSelectRectangleMode():
        return isRight
          ? (startX, startY, x, y, endX, endY)=> this.selectRectangle(startX, startY, endX, endY, false)
          : (startX, startY, x, y, endX, endY)=> this.selectRectangle(startX, startY, endX, endY);
      case this.isSelectMode():
        return isRight
          ? (startX, startY, x, y, endX, endY)=> this.selectLine(x, y, endX, endY, false)
          : (startX, startY, x, y, endX, endY)=> this.selectLine(x, y, endX, endY);
      default:
        return isRight
          ? (startX, startY, x, y, endX, endY)=> this.drawLine(x, y, endX, endY, this.rightColor)
          : (startX, startY, x, y, endX, endY)=> this.drawLine(x, y, endX, endY, this.leftColor);
    }
  }

  isSlideMode() {
    return this.state.keyControl.isDown('Space')
  }

  isSelectMode() {
    return this.state.keyControl.isDown('Shift')
  }

  isSelectRectangleMode() {
    return this.state.keyControl.isDown('Shift') && this.state.keyControl.isDown('Control')
  }

  slide(x, y, endX, endY) {
    this.ie.slide(endX - x, endY - y, true)
  }

  select(x, y, add = true) {
    this.ie.setSelection(x, y, add, true);
  }

  selectLine(x, y, endX, endY, add = true) {
    this.ie.setSelectionPixelToPixel(x, y, endX, endY, add, true);
  }

  selectRectangle(x, y, endX, endY, add = true) {
    this.ie.setRectangleSelection(x, y, endX, endY, add, true);
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