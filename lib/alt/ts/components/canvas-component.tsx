import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import ImageEditor from "../models/image-editor";
import Cell from "./cell-component";
declare const createjs;


interface P {
}

enum CanvasState{
  Starting,
  Started
}

export default class CanvasComponent extends Cell<P,{}> {
  private nowX;
  private nowY;

  componentWillMount() {
    this.setState({
      src: this.props.src || null,
      width: 1000,
      height: 1000
    });

    $(window).on('mousemove', (e)=> this.recordPosition(e));
  }

  recordPosition(e:JQueryMouseEventObject) {
    let {x, y} = this.mousePosition(e);
    this.nowX = x;
    this.nowY = y;
  }

  componentDidMount() {
    super.componentDidMount();

    let {width, height} = this.layoutStyle;
    this.dispatch('canvas:resize', parseInt(width), parseInt(height));
    this.dispatch('canvas:mounted', this.refs['canvas']);

    this.initializeCommand();
    this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));
    $(this.refs['container']).on('dblclick', (e)=> this.call('onDoubleClick')(e));
  }

  initializeCommand() {
    this.commands['onMouseDownRight'] = (x, y)=> this.onPressRight(x, y);
    this.commands['onMouseDown'] = (x, y)=> this.onPress(x, y);
    this.commands['onMouseWheel'] = (x, y)=> y > 0 ? this.scaleStep(-1) : this.scaleStep(1);
    this.commands['onDoubleClick'] = (x, y)=> this.onPressDouble(x, y);
  }

  get commands() {
    return this.props.commands;
  }

  onPress(x, y) {
    this.dispatch('canvas:press', this.canvas, x, y);
  }

  onPressRight(x, y) {
    this.dispatch('canvas:press:right', this.canvas, x, y);
  }

  onPressDouble(x, y) {
    this.dispatch('canvas:press:double', this.canvas, x, y);
  }

  draw(x, y) {
    switch (this.props.mode) {
      case 'slide':
        return this.startSlide(x, y);
      case 'select':
        return this.startSelect(x, y);
      default:
        return this.startDraw(x, y, this.leftColor);
    }
  }

  drawRight(x, y) {
    this.startDraw(x, y, this.rightColor);
  }

  scaleStep(direction) {
    if (direction > 0) {
      this.dispatch('canvas:scale:plus', this.nowX, this.nowY);
    } else {
      this.dispatch('canvas:scale:minus', this.nowX, this.nowY);
    }
  }

  call(name) {
    return this.commands[name] || ((...args) => null)
  }

  onMouseWheel(e:WheelEvent) {
    e.preventDefault();
    let {x, y} = this.mousePosition(e);
    this.call('onMouseWheel')(e.deltaX, e.deltaY);
  }

  onMouseDown(e:MouseEvent, isRight = false) {
    e.preventDefault();
    let {x, y} = this.mousePosition(e);

    console.log(e, isRight)
    isRight ? this.call('onMouseDownRight')(x, y) : this.call('onMouseDown')(x, y);
  }

  get canvas() {
    return this.refs['canvas'];
  }

  render() {
    return <div style={this.layoutStyle} className="cell canvas" ref="container">
      <canvas width="2000" height="2000" ref="canvas" onMouseDown={(e)=> this.onMouseDown(e)} onContextMenu={(e)=> this.onMouseDown(e, true)}>canvas</canvas>
      <div className="controller">
        <div className="scale">
          {this.props.scale * 100 + '%'}
        </div>
        <div className="selection">
          <label><input type="checkbox" checked={this.props.selectionHidden} onChange={(e)=> this.dispatch('canvas:select:hidden', e.target.checked)}/>選択範囲を非表示にする</label>
        </div>
        <div className="message">
          {this.props.message}
        </div>
      </div>
    </div>
  }
}
