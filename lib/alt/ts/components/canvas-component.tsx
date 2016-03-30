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
  private stage:any;
  private ie:ImageEditor;
  private commands:any = {};

  componentWillMount() {
    this.setState({
      src: this.props.src || null
    })
  }

  componentDidMount() {
    super.componentDidMount();

    this.initializeCanvas();
    this.initializeCommand();
    this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));

    if (!this.state.src) {
      this.ie = ImageEditor.create(this.stage, 1000, 1000);
      this.ie.once((wrapper, s)=> {
        wrapper(
          s.setPixel(1, 1, 0xff0000ff),
          s.setPixel(2, 1, 0xff0000ff),
          s.setPixel(1, 2, 0xff0000ff),
          s.setPixel(2, 2, 0xff0000ff)
        )
      });
    }
  }

  initializeCanvas() {
    let canvas = this.refs['canvas'] as HTMLCanvasElement;
    let context = canvas.getContext('2d');
    [
      'imageSmoothingEnabled',
      'mozImageSmoothingEnabled',
      'oImageSmoothingEnabled',
      'msImageSmoothingEnabled'
    ].forEach((n)=> context[n] = false);

    this.stage = new createjs.Stage(canvas);
  }

  initializeCommand() {
    this.commands['onMouseDown'] = this.draw.bind(this);
    this.commands['onMouseWheel'] = (x, y)=> y > 0 ? this.scaleStep(-1) : this.scaleStep(1);
  }

  bitmapData() {
  }

  draw(x, y) {
    this.ie.setPixel(x, y, 0xff0000ff, true);
  }

  scaleStep(direction){
    this.ie.scaleStep(direction);
  }

  call(name) {
    return this.commands[name] || ((...args) => console.log('未設定', ...args))
  }

  onMouseWheel(e:WheelEvent) {
    e.preventDefault();
    this.call('onMouseWheel')(e.deltaX, e.deltaY);
  }

  onMouseDown(e:MouseEvent) {
    e.preventDefault();
    var x = e.pageX - this.refs['canvas'].offsetLeft;
    var y = e.pageY - this.refs['canvas'].offsetTop;

    this.call('onMouseDown')(x, y);
  }

  render() {
    return <div style={this.layoutStyle} className="cell canvas" ref="container">
      <canvas height="1000" width="1000" ref="canvas" onMouseDown={(e)=> this.onMouseDown(e)}>canvas</canvas>
    </div>
  }
}


/*

 // 読み込み
 new createjs.BitmapData(HTMLImageElement)

 // 新規作成
 new createjs.BitmapData(null, 100, 100, 0xffff0000)

 * */