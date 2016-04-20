import ImageEditor from "../../models/image-editor";

export let FrameMixin = (superclass) => class extends superclass {
  replaceIeByImageElement(imageElement) {
    this.ie && this.ie.close();
    this.ie = ImageEditor.create(this.stage, 0, 0, imageElement);
    this.scale();
    this.ie.switchGrid(this.state.grid);
  }
  
  selectFrame(selectedFrameNumber) {
    let ie = this.replaceIeByImageElement(this.state.frames[selectedFrameNumber].image(0));

    this.setState({ie, selectedFrameNumber});
  }

  updateFrame() {
    let {frames, selectedFrameNumber} = this.state;
    frames[selectedFrameNumber].update(0, this.ie.exportPng());

    this.setState({});
  }
};