import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ColorCellSet from "./color-cell-set";
import {FloatingColorPaletteMode} from "../constants/constants";
import BlurButton from "./blur-button";

interface P {
  colorSet:ColorSet
}

export default class ColorPaletteComponent extends Cell<P,{}> {
  render() {
    let {colorSet} = this.props;
    let {top, left} = this.layoutStyle;

    return <div className="cell y color-palette" style={this.layoutStyle}>
      <header className="cell-header">カラーパレット</header>
      <section className="cell-body">
        <ColorCellSet {...{colorSet, onClick: (color)=> this.dispatch('color:select', color)}}/>
        <div className="controller">
          <BlurButton className="add icon-button" onClick={()=> this.dispatch('color:add', this.props.selectedColor)}>
            <Fa icon="plus-circle"/>
          </BlurButton>
          <BlurButton className="delete icon-button" onClick={(e)=> this.dispatch('floater:rise', e,(color)=> this.dispatch('color:delete', color))}>
            <Fa icon="trash"/>
          </BlurButton>
        </div>
      </section>
    </div>
  }
}
