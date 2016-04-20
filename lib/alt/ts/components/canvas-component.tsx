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
    this.commands['onMouseDown'] = this.draw.bind(this);
    this.commands['onMouseWheel'] = (x, y)=> y > 0 ? this.scaleStep(-1) : this.scaleStep(1);
    this.commands['onDoubleClick'] = this.drawDouble.bind(this);
  }

  get commands() {
    return this.props.commands;
  }

  draw(x, y) {
    switch (this.props.mode) {
      case 'slide':
        return this.startSlide(x, y);
      default:
        return this.startDraw(x, y);
    }
  }

  drawDouble(x, y) {
    switch (this.props.mode) {
      case 'slide':
        return this.dispatch('canvas:center');
      default:
        return null;
    }
  }

  startDraw(startX, startY) {
    //this.dispatch('canvas:draw', startX, startY);
    this.props.draw(startX, startY);
    //let pre = {x: startX, y: startY};

    let move = (e:JQueryMouseEventObject)=> {
      let {x, y} = this.mousePosition(e);
      this.props.draw(x, y);
      /*
       let {x, y} = this.mousePosition(e);
       this.dispatch('canvas:draw', x, y);
       let {x, y} = this.mousePosition(e);
       let points = [{x, y}];
       if (Math.abs(x - pre.x) > 1 || Math.abs(y - pre.y) > 1) {
       let moveX = x - pre.x;
       let moveY = y - pre.y;
       let power = moveY / moveX;
       if (moveX > 0) {
       for (let i = moveX; i--;) {
       points.push({x: x - i, y: y - i * power});
       }
       } else {
       for (let i = moveX; i++;) {
       points.push({x: x - i, y: y - i * power});
       }
       }
       }
       this.dispatch('canvas:draw:once', points);
       pre = {x, y}
       */
    };

    $(window).on('mousemove', move);
    $(window).on('mouseup', ()=> {
      $(window).off('mousemove', move);
    });
  }

  startSlide(startX, startY) {
    this.dispatch('canvas:slide:start', startX, startY);

    let move = (e:JQueryMouseEventObject)=> {
      let {x, y} = this.mousePosition(e);
      this.dispatch('canvas:slide', x - startX, y - startY);
    };
    $(window).on('mousemove', move);
    $(window).on('mouseup', ()=> {
      $(window).off('mousemove', move);
    });
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