import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ColorCellSet from "./color-cell-set";
import {FloatingColorPaletteMode} from "../constants/constants";
import GradationColor from "../models/gradation-color";

interface P {
  gradations:ColorSet[]
}

export default class GradationSelectorComponent extends Cell<P,{}> {
  writeGradations() {
    let onClick = (color)=> this.dispatch('color:select', color);
    return this.props.gradations.map((colorSet)=> {
      return <div className="gradation-line" key={colorSet.id}>
        <div className="button-container">
          <button className="change icon-button" onClick={(e)=> this.dispatch('floater:rise', e,(color)=> this.dispatch('gradation:change:color1', colorSet, color))}>
            <Fa icon="eyedropper"/>
          </button>
        </div>
        <div className="color-container"><ColorCellSet {...{colorSet, onClick}}/></div>
        <div className="button-container">
          <button className="change icon-button" onClick={(e)=> this.dispatch('floater:rise', e,(color)=> this.dispatch('gradation:change:color2', colorSet, color))}>
            <Fa icon="eyedropper"/>
          </button>
          <button className="delete icon-button" onClick={(e)=> this.dispatch('gradation:delete', colorSet)}>
            <Fa icon="trash"/>
          </button>
        </div>
      </div>
    })
  }

  render() {
    let [color1, color2] = this.props.colors;

    return <div className="cell y color-palette" style={this.layoutStyle}>
      <header className="cell-header">{this.myName}</header>
      <section className="cell-body">
        {this.writeGradations()}
        <div className="controller">
          <button className="add icon-button" onClick={()=> this.dispatch('gradation:add', color1, color2)}>
            <Fa icon="plus-circle"/>
          </button>
        </div>
      </section>
    </div>
  }
}
