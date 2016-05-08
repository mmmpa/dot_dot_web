import LayeredImage from "../../models/layered-image";
import ARGB from "../../models/argb";
import {presetScale} from '../../constants/constants';

export let DrawingMixin = (superclass) => class extends superclass {
  pressCanvas(x, y, isRight = false) {
    this.detectPressAction(isRight)(x, y);
  }

  dragCanvas(startX, startY, x, y, endX, endY, isRight = false) {
    this.detectDragAction(isRight)(startX, startY, x, y, endX, endY);
  }

  spuitCanvas(x, y, isRight = false) {
    let color = ARGB.number(this.ie.getPixel(x, y));
    this.dispatch('color:select', color, isRight);
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

  moveCanvas(t, r, b, l) {
    this.ie.move(t, r, b, l);
  }

  detectPressAction(isRight = false) {
    this.isAlternative() && (isRight = !isRight);
    switch (true) {
      case this.isSlideMode():
        return (...args)=> null;
      case this.isSelectRectangleMode():
        return (...args)=> null;
      case this.isSelectMode():
        return (x, y)=> this.select(x, y, !isRight);
      case this.isSpuitMode():
        return (x, y)=> this.spuitCanvas(x, y, isRight);
      case this.isFillMode():
        return isRight
          ? (x, y)=> this.fill(x, y, this.rightColor)
          : (x, y)=> this.fill(x, y, this.leftColor);
      default:
        return isRight
          ? (x, y)=> this.draw(x, y, this.rightColor)
          : (x, y)=> this.draw(x, y, this.leftColor);
    }
  }

  detectDragAction(isRight = false) {
    this.isAlternative() && (isRight = !isRight);
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

  isAlternative(){
    return this.state.keyControl.isDown('Alt')
  }

  isFillMode() {
    return this.state.keyControl.isDown('KeyF')
  }

  isSlideMode() {
    return this.state.keyControl.isDown('Space')
  }

  isSelectMode() {
    return this.state.keyControl.isDown('Shift')
  }

  isSpuitMode() {
    return this.state.keyControl.isDown('Control')
  }

  isSelectRectangleMode() {
    return this.state.keyControl.isDown('Shift') && this.state.keyControl.isDown('Control')
  }

  select(x, y, add = true) {
    this.ie.setSelection(x, y, add, true);
  }

  fill(x, y, color) {
    this.ie.fill(x, y, color.number, true);
    this.dispatch('frame:update');
  }

  selectLine(x, y, endX, endY, add = true) {
    this.ie.setSelectionPixelToPixel(x, y, endX, endY, add, true);
  }

  selectRectangle(x, y, endX, endY, add = true) {
    this.ie.setRectangleSelection(x, y, endX, endY, add, true);
  }

  draw(x, y, color) {
    this.ie.draw(x, y, color.number, true);
    this.dispatch('frame:update');
  }

  drawLine(x, y, endX, endY, color) {
    this.ie.drawPixelToPixel(x, y, endX, endY, color.number, true);
    this.dispatch('frame:update');
  }

  hideSelection(selectionHidden) {
    selectionHidden ? this.ie.hideSelection() : this.ie.showSelection()
    this.setState({selectionHidden})
  }

  slide(x, y, endX, endY) {
    this.ie.slide(endX - x, endY - y, true)
  }

  scaleStep(direction, x?, y?) {
    let {scale} = this.state;
    scale += direction;
    if (scale < 0) {
      scale = 0;
    } else if (scale >= presetScale.length) {
      scale = presetScale.length - 1;
    }

    this.scale(scale, x, y)
    this.setState({scale});
  }

  scale(scale?, x?, y?) {
    this.ie.scale(presetScale[scale || this.state.scale], x, y);
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
};