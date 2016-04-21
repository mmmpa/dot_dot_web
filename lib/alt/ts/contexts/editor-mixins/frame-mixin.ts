import ImageEditor from "../../models/image-editor";
import LayeredImage from "../../models/layered-image";

export let FrameMixin = (superclass) => class extends superclass {
  replaceIeByImageElement(imageElement) {
    this.ie && this.ie.close();
    this.ie = ImageEditor.create(this.stage, 0, 0, imageElement);
    this.scale();
    this.ie.switchGrid(this.state.grid);
  }

  get frameNow():LayeredImage {
    return this.state.frames[this.state.selectedFrameNumber];
  }

  selectFrame(selectedFrameNumber) {
    let frame = this.state.frames[selectedFrameNumber];

    if (!frame) {
      return;
    }

    let ie = this.replaceIeByImageElement(frame.image(0));
    this.setState({ie, selectedFrameNumber});
  }

  updateFrame() {
    let {frames, selectedFrameNumber} = this.state;
    frames[selectedFrameNumber].update(0, this.ie.exportPng());

    this.setState({frames});
  }

  selectNextFrame() {
    this.dispatch('frame:select', this.state.selectedFrameNumber + 1)
  }

  selectPreviousFrame() {
    this.dispatch('frame:select', this.state.selectedFrameNumber - 1)
  }

  addFrame() {
    let {frames, selectedFrameNumber, canvasWidth, canvasHeight} = this.state;
    let newFrames = frames.reduce((a, frame, i)=> {
      a.push(frame)
      if (i === selectedFrameNumber) {
        a.push(new LayeredImage(canvasWidth, canvasHeight, [this.gen.blankDataUrl(canvasWidth, canvasHeight)]));
      }
      return a;
    }, []);
    this.setState({frames: newFrames}, ()=> this.dispatch('frame:select', selectedFrameNumber + 1));
  }

  deleteFrame() {
    let {frames, selectedFrameNumber} = this.state;

    if (frames.length === 1) {
      return
    }

    let newFrames = frames.filter((f)=> f.id !== this.frameNow.id)
    let nextFrame = selectedFrameNumber === 0 ? 0 : selectedFrameNumber - 1;
    this.setState({frames: newFrames}, ()=> this.dispatch('frame:select', nextFrame));
  }

  moveFrameBackward() {

  }

  moveFrameForward() {

  }
};