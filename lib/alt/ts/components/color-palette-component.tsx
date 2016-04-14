import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ColorCellSet from "./color-cell-set";
import {FloatingColorPaletteMode} from "../constants/constants";

interface P {
  colorSet:ColorSet
}

export default class ColorPaletteComponent extends Cell<P,{}> {
  render() {
    let {colorSet} = this.props;
    return <div className="cell y color-pallet" style={this.layoutStyle}>
      <header className="cell-header">{this.myName}</header>
      <section className="cell-body">
        <ColorCellSet {...{colorSet, onClick: (color)=> this.dispatch('color:select', color)}}/>
        <div className="controller">
          <button className="add icon-button" onClick={()=> this.dispatch('color:add')}>
            <Fa icon="plus-circle"/>
          </button>
          <button className="delete icon-button" onClick={(e)=> this.dispatch('floater:rise', e,FloatingColorPaletteMode.Delete)}>
            <Fa icon="trash"/>
          </button>
        </div>
      </section>
    </div>
  }
}
