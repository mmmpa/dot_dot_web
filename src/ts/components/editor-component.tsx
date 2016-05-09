import {Good} from '../libs/parcel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import CanvasComponent from './canvas-component';
import ToolSelectorComponent from './tool-selector-component';
import ColorPaletteComponent from './color-palette-component';
import ColorControllerComponent from './color-controller-component';
import FloatingColorPaletteComponent from './floating-color-palette';
import FrameSelectorComponent from './frame-selector-component';
import GradationSelectorComponent from './gradation-component';
import ModalComponent from './modal-component';
import ColorSetComponent from './color-set-component';

require('zepto/zepto.min');
declare const $: any;

export default class EditorComponent extends Good<{}, {}> {
  get components() {
    return [
      <CanvasComponent name="canvas"/>,
      <FrameSelectorComponent name="frameSelector"/>,
      <ToolSelectorComponent name="toolSelector"/>,
      <ColorSetComponent name="colorSet"/>,
      <ColorPaletteComponent name="colorPalette"/>,
      <GradationSelectorComponent name="gradationSelector"/>,
      <ColorControllerComponent name="colorController"/>,
      <FloatingColorPaletteComponent name="floaterColorPalette"/>,
      <ModalComponent name="modal"/>,
    ];
  }

  componentWillMount() {
    super.componentWillMount();
    this.onWindowResize();
    this.setState({
      componentSizeVersion: this.props.componentSize.version,
    });
  }

  componentDidMount() {
    super.componentDidMount();
    this.addEvent();
  }

  componentWillReceiveProps(props) {
    if (props.componentSize.version !== this.state.componentSizeVersion) {
      this.setState({
        layout: props.componentSize.compute($(window).width(), $(window).height()),
      });
    }
  }

  onWindowResize(e?: Event) {
    this.setState({
      layout: this.props.componentSize.compute($(window).width(), $(window).height()),
    });
  }

  addEvent() {
    this.addEventSafety(window, 'resize', this.onWindowResize.bind(this));
  }

  render() {
    return <article className="editor-area">
      {this.relay(this.components)}
    </article>;
  }
}
