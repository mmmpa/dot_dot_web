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
  private scaleNumbers:number[] = [1, 2, 4, 8, 16, 32, 64];
  private stage:any;
  private ie:ImageEditor;
  private commands:any = {};

  private nowX;
  private nowY;

  componentWillMount() {
    this.setState({
      src: this.props.src || null,
      width: 1000,
      height: 1000
    });

    $(window).on('mousemove', (e)=> this.recordPosition(e));
    console.log(this.props)
    this.props.keyControl.hook = (name, e:JQueryKeyEventObject)=> {
      e.preventDefault();
      this.call(name)()
    }
  }

  recordPosition(e:JQueryMouseEventObject) {
    let {x, y} = this.mousePosition(e);
    this.nowX = x;
    this.nowY = y;
  }

  componentDidMount() {
    super.componentDidMount();

    this.initializeCanvas();
    this.initializeCommand();
    this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));
    $(this.refs['container']).on('dblclick', (e)=> this.call('onDoubleClick')(e));

    if (!this.state.src) {
      this.ie = ImageEditor.create(this.stage, 100, 100);
    }

    this.refreshCanvas(this.props);
    this.center();
  }

  componentWillReceiveProps(props) {
    this.refreshCanvas(props, this.props);
  }

  refreshCanvas(props, oldProps?) {
    let {scale, grid} = props;

    if (!oldProps || oldProps.scale !== scale) {
      this.ie.scale(this.scaleNumbers[scale], this.nowX, this.nowY)
    }

    if (!oldProps || oldProps.grid !== grid) {
      this.ie.switchGrid(grid);
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
    this.commands['onDoubleClick'] = this.drawDouble.bind(this);
    this.commands['onControlS'] = ()=> this.save();
  }

  bitmapData() {
  }

  save() {
    this.dispatch('image:save', this.ie.exportPng());
  }

  draw(x, y) {
    switch (this.props.mode) {
      case 'slide':
        return this.startSlide(x, y);
      default:
        return this.ie.setPixel(x, y, this.props.selectedColor.number, true);
    }
  }

  drawDouble(x, y) {
    switch (this.props.mode) {
      case 'slide':
        return this.center();
      default:
        return null;
    }
  }

  center() {
    let {width, height} = this.layoutStyle;
    return this.ie.center(parseInt(width), parseInt(height));
  }

  startSlide(startX, startY) {
    let slide = this.ie.startSlide();
    let move = (e:JQueryMouseEventObject)=> {
      let {x, y} = this.mousePosition(e);
      slide(x - startX, y - startY);
    };
    $(window).on('mousemove', move);
    $(window).on('mouseup', ()=> {
      $(window).off('mousemove', move);
    });
  }

  scaleStep(direction) {
    let {scale} = this.props;
    scale += direction
    if (scale < 0) {
      scale = 0;
    } else if (scale >= this.scaleNumbers.length) {
      scale = this.scaleNumbers.length - 1;
    }

    this.dispatch('canvas:scale', scale);
  }

  call(name) {
    return this.commands[name] || ((...args) => console.log('未設定', ...args))
  }

  onMouseWheel(e:WheelEvent) {
    e.preventDefault();
    let {x, y} = this.mousePosition(e);
    this.call('onMouseWheel')(e.deltaX, e.deltaY);
  }

  onMouseDown(e:MouseEvent) {
    e.preventDefault();
    let {x, y} = this.mousePosition(e);

    this.call('onMouseDown')(x, y);
  }

  get canvas() {
    return this.refs['canvas'];
  }

  mousePosition(e) {
    var x = e.pageX - this.canvas.offsetLeft;
    var y = e.pageY - this.canvas.offsetTop;

    return {x, y};
  }

  render() {
    return <div style={this.layoutStyle} className="cell canvas" ref="container">
      <canvas width="2000" height="2000" ref="canvas" onMouseDown={(e)=> this.onMouseDown(e)}>canvas</canvas>
    </div>
  }
}


/*

 // 読み込み
 new createjs.BitmapData(HTMLImageElement)

 // 新規作成
 new createjs.BitmapData(null, 100, 100, 0xffff0000)

 * */