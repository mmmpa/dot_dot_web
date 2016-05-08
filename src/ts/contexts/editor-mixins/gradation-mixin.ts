import GradationColor from "../../models/gradation-color";

export let GradationMixin = (superclass) => class extends superclass {
  addGradation() {
    let {gradations} = this.state;
    gradations.push(new GradationColor(this.leftColor, this.rightColor));
    this.setState({gradations});
  }

  removeGradation(gradation) {
    let {gradations} = this.state;
    _.remove(gradations, (g)=> g === gradation);
    this.setState({gradations})
  }

  changeGradationColor(target, gradation, color) {
    gradation.changeColor(target, color);
    this.setState({})
  }
};