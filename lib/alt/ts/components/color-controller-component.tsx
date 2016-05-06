import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ARGB from "../models/argb";
import * as _ from 'lodash';

export default class ColorControllerComponent extends Cell<{},{}> {
  componentWillMount() {
    super.componentWillMount();

    let {a,r,g,b} = this.selectedColor(this.props);
    this.setState({a, r, g, b});
  }

  needUpdate(p, nextP) {
    return this.selectedColor(p) !== this.selectedColor(nextP)
      || p.layout !== nextP.layout
  }

  componentWillReceiveProps(props) {
    super.componentWillReceiveProps(props);

    if (this.needUpdate(this.props, props)) {
      let {a,r,g,b} = this.selectedColor(props);
      this.setState({a, r, g, b});
    }
  }

  shouldComponentUpdate(props, state) {
    return this.needUpdate(this.props, props);
  }

  selectedColor(props) {
    let {selectedColor} = props;
    return selectedColor;
  }

  changeARGB({a, r, g, b}) {
    let newState = _.clone(this.state);
    this.dispatch('color:arrange', _.merge(newState, {a, r, b, g}));
  }

  componentWillUpdate(nextProps, nextState) {
    super.componentWillUpdate(nextProps, nextState);
  }

  render() {
    let {r,g,b,a} = this.state;
    let {colors, selectedColorNumber} = this.props;
    let that = this;
    return <div className="cell y color-controller" style={this.layoutStyle}>
      <header className="cell-header">選択カラー調整</header>
      <section className="cell-body">
        <section className="selected">
          <SelectedColor {...{colors, selectedColorNumber}}
            onSelect={(n)=> that.dispatch('color:switch', n)}/>
        </section>
        <section className="slider">
          <ColorSlider title="R" value={r} onChange={(e)=> that.changeARGB({r: +e.target.value})}/>
          <ColorSlider title="G" value={g} onChange={(e)=> that.changeARGB({g: +e.target.value})}/>
          <ColorSlider title="B" value={b} onChange={(e)=> that.changeARGB({b: +e.target.value})}/>
          <ColorSlider title="A" value={a} onChange={(e)=> that.changeARGB({a: +e.target.value})}/>
        </section>
      </section>
    </div>
  }
}

interface SelectedColorP {
  colors:ARGB[],
  selectedColorNumber:number,
  onSelect:(n:number)=>void
}

class SelectedColor extends React.Component<SelectedColorP,{}> {
  selectedStyle(n) {
    return n === this.props.selectedColorNumber ? ' selected' : ''
  }

  render() {
    let {onSelect, colors} = this.props;
    let [color1, color2] = colors;

    return <div className="selected-color">
      <div className={"tip first" + this.selectedStyle(0)}>
        <div className="inner" onClick={()=> onSelect(0)}>
          <em style={{background: color1.css}}>{color1.hex}</em>
        </div>
      </div>
      <div className={"tip second" + this.selectedStyle(1)}>
        <div className="inner" onClick={()=> onSelect(1)}>
          <em style={{background: color2.css}}>{color2.hex}</em>
        </div>
      </div>
    </div>
  }
}

interface ColorSliderP {
  title:string,
  value:number,
  onChange:(e)=>void
}

class ColorSlider extends React.Component<ColorSliderP,{}> {
  shouldComponentUpdate(nextProps, _) {
    return this.props.value !== nextProps.value
  }

  render() {
    let {title, value, onChange} = this.props;
    return <div className="color-slider">
      <div className="title">
        {title}
      </div>
      <div className="number">
        <input type="number" min="0" max="255" step="1" {...{value, onChange}}/>
      </div>
      <div className="slider">
        <input type="range" min="0" max="255" step="1" {...{value, onChange}}/>
      </div>
    </div>
  }
}