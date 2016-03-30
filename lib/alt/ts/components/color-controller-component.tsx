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

    this.setState(this.generateState());
  }

  generateState(state?) {
    let base = state || {
        colors: [ARGB.number(0xff00ff00), ARGB.number(0xffff0000)],
        selectedColor: 0
      };

    let argb = base.colors[base.selectedColor].toJson();

    return _.assign(base, argb);
  }

  changeColor({selectedColor, a, r, g, b}) {
    if (_.isNumber(selectedColor)) {
      let argb = this.state.colors[selectedColor].toJson();
      this.setState(_.assign({selectedColor}, argb));
      return
    }

    let colors:ARGB[] = this.state.colors.concat();
    let color:ARGB = colors[this.state.selectedColor];
    if(_.isNumber(a)){
      color.a = a;
    }
    if(_.isNumber(r)){
      color.r = r;
    }
    if(_.isNumber(g)){
      color.g = g;
    }
    if(_.isNumber(b)){
      color.b = b;
    }
    let argb = color.toJson();
    console.log(a,r,g,b,_.assign({colors}, argb))
    this.setState(_.assign({colors}, argb));
  }

  componentWillUpdate(nextProps, nextState) {
    super.componentWillUpdate(nextProps, nextState);
  }

  render() {
    let {r,g,b,a, colors, selectedColor} = this.state;
    let that = this;
    return <div className="cell y color-controller" style={this.layoutStyle}>
      <header className="cell-header">{this.myName}</header>
      <section className="cell-body">
        <section className="selected">
          <SelectedColor {...{colors, selectedColor}}
            onSelect={(selectedColor)=> that.changeColor({selectedColor})}/>
        </section>
        <section className="slider">
          <ColorSlider title="R" value={r} onChange={(e)=> that.changeColor({r: +e.target.value})}/>
          <ColorSlider title="G" value={g} onChange={(e)=> that.changeColor({g: +e.target.value})}/>
          <ColorSlider title="B" value={b} onChange={(e)=> that.changeColor({b: +e.target.value})}/>
          <ColorSlider title="A" value={a} onChange={(e)=> that.changeColor({a: +e.target.value})}/>
        </section>
      </section>
    </div>
  }
}

interface SelectedColorP {
  colors:ARGB[],
  selectedColor:number,
  onSelect:(n:number)=>void
}

class SelectedColor extends React.Component<SelectedColorP,{}> {
  selectedStyle(n) {
    return n === this.props.selectedColor ? ' selected' : ''
  }

  render() {
    let {onSelect, colors} = this.props;
    let [color1, color2] = colors;

    return <div className="selected-color">
      <div className={"tip first" + this.selectedStyle(0)}>
        <div className="inner" style={{background: color1.hex}} onClick={()=> onSelect(0)}>
          {color1.hex}
        </div>
      </div>
      <div className={"tip second" + this.selectedStyle(1)}>
        <div className="inner" style={{background: color2.hex}} onClick={()=> onSelect(1)}>
          {color2.hex}
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