import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";

export default class ColorPaletteComponent extends Cell<{},{}> {
  render() {
    return <div className="cell y" style={this.layoutStyle}>
      {this.myName}
    </div>
  }
}