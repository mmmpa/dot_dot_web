import * as React from "react";
import * as ReactDOM from 'react-dom';
import Cell from "./cell-component";

interface P {
}

export default class CanvasComponent extends Cell<P,{}> {
  componentWillMount() {
    let {width, height} = this.layoutStyle;
    this.setState({width, height});
  }

  componentDidMount() {
    super.componentDidMount();

    let {width, height} = this.layoutStyle;

    this.dispatch('component:canvas:resize', parseInt(width), parseInt(height));
    this.dispatch('component:canvas:mounted', this.refs['canvas']);

    this.initializeCommand();
    this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));
    $(this.refs['container']).on('dblclick', (e)=> this.call('onDoubleClick')(e));
  }

  initializeCommand() {
    this.commands['onMouseDownRight'] = (x, y)=> this.onPressRight(x, y);
    this.commands['onMouseDown'] = (x, y)=> this.onPress(x, y);
    this.commands['onMouseWheel'] = (x, y, deltaX, deltaY)=> this.onWheel(x, y, deltaY);
    this.commands['onDoubleClick'] = (x, y)=> this.onPressDouble(x, y);
  }

  componentWillReceiveProps(props) {
    let {width, height} = this.pickLayout(props);
    if (this.state.width !== width || this.state.height !== height) {
      this.setState({width, height});
      this.dispatch('component:canvas:resize', parseInt(width), parseInt(height));
    }
  }

  call(name) {
    return this.commands[name] || ((...args) => null)
  }

  get canvas() {
    return this.refs['canvas'];
  }

  get commands() {
    return this.props.commands;
  }

  onMouseWheel(e:WheelEvent) {
    e.preventDefault();
    let {x, y} = this.mousePosition(e);
    this.call('onMouseWheel')(x, y, e.deltaX, e.deltaY);
  }

  onMouseDown(e:MouseEvent) {
    e.preventDefault();
    let isRight = e.nativeEvent.which === 3;
    let {x, y} = this.mousePosition(e);

    isRight ? this.call('onMouseDownRight')(x, y) : this.call('onMouseDown')(x, y);
  }

  onPress(x, y) {
    this.dispatch('canvas:press', x, y);
    this.startDragCanvas(x, y);
  }

  onPressRight(x, y) {
    this.dispatch('canvas:press:right', x, y);
    this.startDragCanvas(x, y, true);
  }

  onPressDouble(x, y) {
    this.dispatch('canvas:press:double', x, y);
  }

  startDragCanvas(startX, startY, isRight = false) {
    let pre = {x: startX, y: startY};

    let move = (e:MouseEvent)=> {
      let {x, y} = this.mousePosition(e);
      if (isRight) {
        this.dispatch('canvas:drag:right', startX, startY, pre.x, pre.y, x, y);
      } else {
        this.dispatch('canvas:drag', startX, startY, pre.x, pre.y, x, y);
      }
      pre = {x, y}
    };

    let clear = (e)=>{
      $(window).unbind('mouseup', clear);
      $(window).unbind('mousemove', move);
    };

    $(window).bind('mousemove', move);
    $(window).bind('mouseup', clear);
  }

  mousePosition(e:MouseEvent) {
    var x = e.pageX - this.canvas.offsetLeft;
    var y = e.pageY - this.canvas.offsetTop;

    return {x, y};
  }

  onWheel(x, y, direction) {
    if (direction < 0) {
      this.dispatch('canvas:wheel:up', x, y);
    } else {
      this.dispatch('canvas:wheel:down', x, y);
    }
  }

  render() {
    return <div style={this.layoutStyle} className="cell canvas" ref="container">
      <canvas width="2000" height="2000" ref="canvas" onMouseDown={(e)=> this.onMouseDown(e)} onContextMenu={(e)=> e.preventDefault()}>canvas</canvas>
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
