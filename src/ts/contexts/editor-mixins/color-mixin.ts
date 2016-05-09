import ARGB from '../../models/argb';

export let ColorMixin = (superclass) => class extends superclass {
  get leftColor() {
    let {colors, selectedColorNumber} = this.state;
    return colors[selectedColorNumber];
  }

  get rightColor() {
    let {colors, selectedColorNumber} = this.state;
    return colors[selectedColorNumber ^ 1];
  }

  selectFromTip(i) {
    this.setState({selectedColorNumber: i, selectedColor: this.state.colors[i]});
  }

  arrangeColor({a, r, g, b}) {
    let {selectedColorNumber} = this.state;
    let colors                  = this.state.colors.concat();
    let selectedColor           = new ARGB(a, r, g, b)
    colors[selectedColorNumber] = selectedColor;
    this.setState({colors, selectedColor});
  }

  selectColor(selectedColor: ARGB, isRight: boolean = false) {
    let {colors, selectedColorNumber} = this.state;
    isRight && (selectedColorNumber = selectedColorNumber ^ 1);
    colors                      = colors.concat();
    colors[selectedColorNumber] = selectedColor;
    this.setState({colors, selectedColor});
  }

  addColor(color) {
    let {colorSet} = this.state;
    colorSet.add(color);
    this.setState({colorSet});
  }

  removeColor(color) {
    let {colorSet} = this.state;
    colorSet.remove(color);
    this.setState({colorSet});
  }
};
