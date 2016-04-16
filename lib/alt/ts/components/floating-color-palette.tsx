import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ColorCellSet from "./color-cell-set";
import {FloatingColorPaletteMode} from "../constants/constants";

require("zepto/zepto.min");
declare const $:any;

interface P {
  colorSet:ColorSet,
  floatingColorPaletteMode:FloatingColorPaletteMode,
  floatingFrom:HTMLElement
}

export default class FloatingColorPaletteComponent extends Good<P,{}> {
  componentWillMount() {
    this.setState({
      visible: this.detectVisibility(this.props),
      position: this.detectPosition(this.props)
    })
  }

  detectPosition(props) {
    if (!props.floatingFrom) {
      return {top: 0, left: 0}
    }

    let $from = $(props.floatingFrom);
    let {top, left} = $from.offset();
    top += $from.height();
    return {top, left}
  }

  shouldComponentUpdate(props) {
    return props.floatingColorPaletteMode !== this.props.floatingColorPaletteMode
  }

  componentWillReceiveProps(props) {
    this.setState({
      visible: this.detectVisibility(props),
      position: this.detectPosition(props)
    })
  }

  detectVisibility(props) {
    return !_.isNull(props.floatingColorPaletteMode)
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    let {top, left} = this.state.position;
    let {colorSet} = this.props;

    return <div className="floating-color-palette" style={{top, left}}>
      <ColorCellSet {...{colorSet, onClick: (color)=> this.dispatch('floater:select', color)}}/>
    </div>
  }
}
