import * as React from "react";
import * as ReactDOM from 'react-dom';
import {Good} from "../libs/parcel";
import Cell from "./cell-component";

export default class ModalComponent extends Cell<{modalComponent:any},{}> {
  componentWillReceiveProps(props) {
    props.modalProps && this.setState(props.modalProps);
  }

  componentDidUpdate(prevProps, prevState) {
    if(!this.props.modalComponent){
      return;
    }

    let {width, height} = this.layoutStyle;
    let {clientWidth, clientHeight} = this.window;

    this.window.style.top = (parseInt(height) - clientHeight) / 2 + 'px';
    this.window.style.left = (parseInt(width) - clientWidth) / 2 + 'px';
  }

  get window() {
    return this.refs['window']
  }

  render() {
    if (!this.props.modalComponent) {
      return null;
    }

    return <div className="modal" style={this.layoutStyle} onClick={()=> this.dispatch('modal:cancel')}>
      <div className="window" ref="window">
        {this.relay([this.props.modalComponent])}
      </div>
    </div>
  }
}
