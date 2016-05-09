import * as React from 'react';
import * as ReactDOM from 'react-dom';
import Fa from '../mods/fa';
import Cell from './cell-component';
import ColorSet from '../models/color-set';
import ColorCellSet from './color-cell-set';
import BlurButton from './blur-button';
import ARGB from '../models/argb';

//
// グラデーションのツールウィンドウ
// 選択中の二色から二色間のグラデーション風パレットを作成する
// 作成後はカラーセットから色を選んで色の変更が行える
//

interface P {
  gradations: ColorSet[];
  colors: ARGB[];
}

export default class GradationSelectorComponent extends Cell<P, {}> {
  writeDropper(which: number, colorSet) {
    let select = (color) => this.dispatch('gradation:change:color', which, colorSet, color);

    return <div className="button-container">
      <BlurButton className="change icon-button" onClick={(e) => this.dispatch('floater:rise', e, select)}>
        <Fa icon="eyedropper"/>
      </BlurButton>
    </div>;
  }

  writeGradations() {
    let onClick = (color) => this.dispatch('color:select', color);

    return this.props.gradations.map((colorSet) => {
      return <div className="gradation-line" key={colorSet.id}>
        {this.writeDropper(1, colorSet)}
        <div className="color-container">
          <ColorCellSet {...{colorSet, onClick}}/>
        </div>
        {this.writeDropper(2, colorSet)}
        <BlurButton className="delete icon-button" onClick={(e) => this.dispatch('gradation:remove', colorSet)}>
          <Fa icon="trash"/>
        </BlurButton>
      </div>;
    });
  }

  render() {
    return <div className="cell y color-palette" style={this.layoutStyle}>
      <header className="cell-header">二色間カラーパレット</header>
      <section className="cell-body">
        {this.writeGradations()}
        <div className="controller">
          <BlurButton className="add icon-button" onClick={() => this.dispatch('gradation:add')}>
            <Fa icon="plus-circle"/>
          </BlurButton>
        </div>
      </section>
    </div>;
  }
}
