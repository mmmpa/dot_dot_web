import {Good} from '../libs/parcel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Fa from '../mods/fa';
import Cell from './cell-component';
import ColorSet from '../models/color-set';
import ColorCellSet from './color-cell-set';
import {FloatingColorPaletteMode, colorPreset} from '../constants/constants';
import BlurButton from './blur-button';
import * as _ from 'lodash';

interface P {
  colorSet: ColorSet;
}

export default class ColorSetComponent extends Cell<P, {}> {
  componentWillMount() {
    this.setState({
      colorSetName: 'sfc',
    });
  }

  writeOption() {
    return _.map(colorPreset, (v, k) => {
      return <option value={k}>{v.title}</option>;
    });
  }

  writeSelector() {
    return <select value={this.state.colorSetName} onChange={(e) => this.setState({colorSetName: e.target.value})}>
      {this.writeOption()}
    </select>;
  }

  render() {
    let {colorSet} = colorPreset[this.state.colorSetName];
    return <div className="cell y color-palette" style={this.layoutStyle}>
      <header className="cell-header">カラーセット</header>
      {this.writeSelector()}
      <section className="cell-body">
        <ColorCellSet {...{colorSet, onClick: (color, index, isRight) => this.dispatch('color:select', color, isRight)}}/>
      </section>
    </div>;
  }
}
