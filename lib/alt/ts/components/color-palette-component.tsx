import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ARGB from "../models/argb";

interface P {
  colorSet:ColorSet
}

export default class ColorPaletteComponent extends Cell<P,{}> {
  render() {
    let {colors} = this.props.colorSet;

    return <div className="cell y color-pallet" style={this.layoutStyle}>
      <header className="cell-header">{this.myName}</header>
      <section className="cell-body">
        <ul className="colors">
          {colors.map((color, key)=> {
            let onClick = ()=> this.dispatch('color:select', color);
            return <ColorCell {...{key, color, onClick}}/>;
            })}
        </ul>
      </section>
    </div>
  }
}

class ColorCell extends React.Component<{color:ARGB, onClick:()=> void},{}> {
  render() {
    let {color, onClick} = this.props;
    return <div className="inner" style={{background: color.hex}} onClick={onClick}>
      {color.hex}
    </div>

  }
}