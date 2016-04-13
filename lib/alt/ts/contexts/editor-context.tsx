import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ARGB from "../models/argb";
import KeyControl from "../models/key-control";
import ColorSet from "../models/color-set";

interface P {
}

interface S {
}

export default class EditorContext extends Parcel<P,S> {
  componentWillMount() {
    super.componentWillMount();
    this.setState({
      colors: [ARGB.number(0xff000000), ARGB.number(0xffffffff)],
      selectedColorNumber: 0,
      selectedColor: ARGB.number(0xff000000),
      scale: 1,
      grid: true,
      keyControl: new KeyControl((mode)=> mode !== this.state.mode && this.setState({mode})),
      mode: null,
      colorSet: new ColorSet([ARGB.number(0xffff0000), ARGB.number(0xff00ff00), ARGB.number(0xff0000ff)])
    });
  }

  arrangeColor({a, r, g, b}) {
    //console.log(argb)
    let {selectedColorNumber} = this.state;
    let colors = this.state.colors.concat();
    let selectedColor = new ARGB(a, r, g, b)
    colors[selectedColorNumber] = selectedColor;
    this.setState({colors, selectedColor});
  }

  selectColor(selectedColor:ARGB) {
    let {colors, selectedColorNumber} = this.state;
    colors = colors.concat();
    colors[selectedColorNumber] = selectedColor;
    this.setState({colors, selectedColor})
  }

  listen(to) {
    to('color:switch', (selectedColorNumber)=>this.setState({selectedColorNumber, selectedColor: this.state.colors[selectedColorNumber]}));
    to('color:select', (color)=> this.selectColor(color))
    to('color:arrange', (argb)=>this.arrangeColor(argb));
    to('canvas:scale', (scale)=>this.setState({scale}));
    to('image:save', (dataUrl)=> {
      let name = 'test'
      $('<a>')
        .attr("href", dataUrl)
        .attr("download", "file-" + name)
        .trigger('click');
    });
  }
}
