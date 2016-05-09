import {Good} from '../libs/parcel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

interface SellP {
  layout: any;
  name: string;
}

export default class CanvasSettingComponent extends Good<{}, {}> {
  componentWillMount() {
    super.componentWillMount();

    let {width, height, bg} = this.props;
    this.setState({width, height, bg});
  }

  render() {
    let {width, height, bg} = this.state;
    let {onComplete, onCancel} = this.props;

    return <div className="canvas-setting modal-window">
      <header className="modal-header">New</header>
      <section className="params">
        <h1>Width</h1>
        <div><input type="text" value={width} onChange={(e) => this.setState({width: +e.target.value})}/></div>
      </section>
      <section className="params">
        <h1>Height</h1>
        <div><input type="text" value={height} onChange={(e) => this.setState({height: +e.target.value})}/></div>
      </section>
      <div className="buttons">
        <button className="complete-button" onClick={() => onComplete(width, height, bg)}>Create</button>
        <button className="cancel-button" onClick={() => onCancel()}>Cancel</button>
      </div>
    </div>;
  }
}
