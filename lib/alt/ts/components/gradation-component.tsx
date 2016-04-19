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
      return <div className="gradation-line">
        <button className="chage icon-button" onClick={(e)=> this.dispatch('floater:rise', e,()=> console.log('gradation1'))}>
          <Fa icon="eyedropper"/>
        </button>
        <ColorCellSet {...{colorSet, onClick}}/>
        <button className="chage icon-button" onClick={(e)=> this.dispatch('floater:rise', e,()=> console.log('gradation2'))}>
          <Fa icon="eyedropper"/>
        </button>
      </div>
    })
  }

  render() {
    return <div className="cell y color-palette" style={this.layoutStyle}>
      <header className="cell-header">{this.myName}</header>
      <section className="cell-body">
        {this.writeGradations()}
        <div className="controller">
          <button className="add icon-button" onClick={()=> this.dispatch('gradation:add')}>
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
