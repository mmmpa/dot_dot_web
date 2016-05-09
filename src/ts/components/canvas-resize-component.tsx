import {Good} from '../libs/parcel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class CanvasSettingComponent extends Good<{}, {}> {
  componentWillMount() {
    super.componentWillMount();

    let {canvasWidth, canvasHeight} = this.props;
    this.setState({
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      canvasWidth,
      canvasHeight,
      message: '',
    });
  }

  check() {
    let {canvasWidth, canvasHeight, top, left, right, bottom} = this.state;
    if (canvasWidth + left + right < 1 || canvasHeight + top + bottom < 1) {
      return this.setState({message: 'invalid'});
    }
    this.props.onComplete(top, right, bottom, left);
  }

  writeMessage() {
    let {message} = this.state;
    if (message.length === 0) {
      return null;
    }

    return <p className="message">{message}</p>;
  }

  render() {
    let {canvasWidth, canvasHeight, top, left, right, bottom} = this.state;
    let {onComplete, onCancel} = this.props;

    return <div className="canvas-resize modal-window">
      <header className="modal-header">New</header>
      <section className="params">
        <h1>Top</h1>
        <div><input type="number" step="1" value={top} onChange={(e) => this.setState({top: +e.target.value})}/></div>
      </section>
      <section className="params side">
        <h1>Left</h1>
        <div><input type="number" step="1" value={left} onChange={(e) => this.setState({left: +e.target.value})}/></div>
      </section>
      <section className="params side">
        <div><input type="number" step="1" value={right} onChange={(e) => this.setState({right: +e.target.value})}/></div>
        <h1>Right</h1>
      </section>
      <section className="params">
        <div><input type="number" step="1" value={bottom} onChange={(e) => this.setState({bottom: +e.target.value})}/></div>
        <h1>Bottom</h1>
      </section>
      <div className="result">
        <section>
          <h1>Width : Height</h1>
          <div>{canvasWidth + left + right}px : {canvasHeight + top + bottom}px</div>
          {this.writeMessage()}
        </section>
      </div>
      <div className="buttons">
        <button className="complete-button" onClick={() => this.check()}>Resize</button>
        <button className="cancel-button" onClick={() => onCancel()}>Cancel</button>
      </div>
    </div>;
  }
}
