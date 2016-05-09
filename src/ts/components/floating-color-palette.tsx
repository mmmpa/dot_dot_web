import {Good} from '../libs/parcel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ColorSet from '../models/color-set';
import ColorCellSet from './color-cell-set';

require('zepto/zepto.min');
declare const $: any;

interface P {
  colorSet: ColorSet;
  floatingCallback: (color) => void;
  floatingFrom: HTMLElement;
}

export default class FloatingColorPaletteComponent extends Good<P, {}> {
  componentWillMount() {
    this.setState({
      visible: this.detectVisibility(this.props),
      position: this.detectPosition(this.props),
    });
  }

  detectPosition(props) {
    if (!props.floatingFrom) {
      return {top: 0, left: 0};
    }

    let $from = $(props.floatingFrom);
    let {top, left} = $from.offset();
    top += $from.height();
    return {top, left};
  }

  shouldComponentUpdate(props) {
    return props.floatingCallback !== this.props.floatingCallback;
  }

  componentWillReceiveProps(props) {
    this.setState({
      visible: this.detectVisibility(props),
      position: this.detectPosition(props),
    });
  }

  detectVisibility(props) {
    return !_.isNull(props.floatingCallback);
  }

  render() {
    if (!this.state.visible) {
      return null;
    }

    let {top, left} = this.state.position;
    let {colorSet, floatingCallback} = this.props;

    return <div className="floating-color-palette" style={{top, left}}>
      <ColorCellSet {...{colorSet, onClick: (color) => this.dispatch('floater:select', () => floatingCallback(color))}}/>
    </div>;
  }
}
