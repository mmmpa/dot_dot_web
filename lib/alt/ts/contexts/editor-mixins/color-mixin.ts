import ARGB from "../../models/argb";

export let ColorMixin = (superclass) => class extends superclass {
  selectFromTip(i){
    this.setState({selectedColorNumber: i, selectedColor: this.state.colors[i]})
  }

  arrangeColor({a, r, g, b}) {
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

  addColor(color) {
    let {colorSet} = this.state;
    colorSet.add(color);
    this.setState({colorSet})
  }

  deleteColor(color) {
    let {colorSet} = this.state;
    colorSet.remove(color);
    this.setState({colorSet})
  }
};