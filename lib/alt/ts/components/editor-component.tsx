import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import CanvasComponent from "./canvas-component";
import ToolSelectorComponent from "./tool-selector-component";
import ToolControllerComponent from "./tool-contoroller-component";
import ColorPaletteComponent from "./color-palette-component";
import SelectedColorComponent from "./selected-color-component";
import StyleStylist from "../models/style-stylist"
import ColorControllerComponent from "./color-controller-component";
import FloatingColorPaletteComponent from "./floating-color-palette";
import FrameSelectorComponent from "./frame-selector-component";

require("zepto/zepto.min");
declare const $:any;

interface P {
  bitmap
}

export default class EditorComponent extends Good<P,{}> {
  get components() {
    return [
      <CanvasComponent name="canvas"/>,
      <FrameSelectorComponent name="frameSelector"/>,
      <ToolSelectorComponent name="toolSelector"/>,
      <ToolControllerComponent name="toolController"/>,
      <ColorPaletteComponent name="colorPalette"/>,
      <SelectedColorComponent name="selectedColor"/>,
      <ColorControllerComponent name="colorController"/>,
      <FloatingColorPaletteComponent  name="floaterColorPalette"/>
    ]
  }

  componentWillMount() {
    super.componentWillMount();
    this.onWindowResize();
  }

  componentDidMount() {
    super.componentDidMount();
    this.addEvent();
  }

  onWindowResize(e?:Event) {
    let w = $(window).width();
    let h = $(window).height();

    let left = w * 0.7 >> 0;
    let right = w - left;
    let split = h / 5;

    this.setState({
      layout: {
        canvas: new StyleStylist(0, 0, left, h - 200).css,
        frameSelector: new StyleStylist(0, h - 200, left, 200).css,
        toolSelector: new StyleStylist(left, 0, right, split).css,
        toolController: new StyleStylist(left, split, right, split).css,
        colorPalette: new StyleStylist(left, split * 2, right, split).css,
        selectedColor: new StyleStylist(left, split * 3, right, split).css,
        colorController: new StyleStylist(left, split * 4, right, h - split * 4).css
      }
    })
  }

  addEvent() {
    this.addEventSafety(window, 'resize', this.onWindowResize.bind(this));
  }

  render() {
    return <article className="editor-area">
      {this.relay(this.components)}
    </article>
  }
}
