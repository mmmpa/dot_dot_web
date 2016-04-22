import GradationColor from "../../models/gradation-color";

export let GradationMixin = (superclass) => class extends superclass {
  addGradation(color1, color2) {
    this.state.gradations.push(new GradationColor(color1, color2));
    this.setState({});
  }

  deleteGradation(gradation) {
    let {gradations} = this.state;
    _.remove(gradations, (g)=> g === gradation);
    this.setState({gradations})
  }

  changeGradationColor(target, gradation, color) {
    gradation[target] = color;
    this.setState({})
  }
};