import * as React from "react";
import * as ReactDOM from 'react-dom';
import {Good} from "../libs/parcel";
import Cell from "./cell-component";

export default class ModalComponent extends Cell<{modalComponent:any},{}> {
  render() {
    if (!this.props.modalComponent) {
      return null;
    }

    return <div className="modal" style={this.layoutStyle} onClick={()=> this.dispatch('modal:cancel')}>
      <div className="window">
        {this.relay([this.props.modalComponent])} 
      </div>
    </div>
  }
}
