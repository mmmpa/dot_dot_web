import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ColorCellSet from "./color-cell-set";
import {FloatingColorPaletteMode} from "../constants/constants";

interface P {
  colorSet:ColorSet,
  floatingColorPaletteMode:FloatingColorPaletteMode
}

export default class FloatingColorPaletteComponent extends Good<P,{}> {
  componentWillMount() {
    this.setState({
      visible: this.detectVisibility(this.props)
    })
  }

  shouldComponentUpdate(props) {
    return props.floatingColorPaletteMode !== this.props.floatingColorPaletteMode
  }

  componentWillReceiveProps(props) {
    this.setState({visible: this.detectVisibility(props)})
  }

  detectVisibility(props) {
    console.log(props.floatingColorPaletteMode, !_.isNull(props.floatingColorPaletteMode))
    return !_.isNull(props.floatingColorPaletteMode)
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    let {colorSet} = this.props;
    return <div className="floating-color-palette">
      <section className="cell-body">
        <ColorCellSet {...{colorSet, onClick: (color)=> this.dispatch('floater:select', color)}}/>
      </section>
    </div>
  }
}
