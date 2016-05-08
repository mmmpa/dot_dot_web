import ImageEditor from "../../models/image-editor";
import LayeredImage from "../../models/layered-image";
import DataURLEditor from "../../models/data-url-editor";

const gen = DataURLEditor;

export let FrameMixin = (superclass) => class extends superclass {
  get frameNow():LayeredImage {
    return this.state.frames[this.state.selectedFrameNumber];
  }

  addFrame() {
    let {frames, selectedFrameNumber} = this.state;
    let newFrame = frames[selectedFrameNumber].clone();
    frames.splice(selectedFrameNumber, 0, newFrame);
    this.setState({frames}, ()=> this.dispatch('frame:select', selectedFrameNumber + 1));
  }

  removeFrame() {
    let {frames, selectedFrameNumber} = this.state;

    if (frames.length === 1) {
      return
    }

    let newFrames = frames.filter((f)=> f.id !== this.frameNow.id)
    let nextFrame = selectedFrameNumber === 0 ? 0 : selectedFrameNumber - 1;
    this.setState({frames: newFrames}, ()=> this.dispatch('frame:select', nextFrame));
  }

  moveFrameN(n) {
    let {frames, selectedFrameNumber} = this.state;
    let target = frames[selectedFrameNumber + n];
    if (!target) {
      return;
    }

    let newFrames = frames.concat();

    newFrames[selectedFrameNumber]     = target;
    newFrames[selectedFrameNumber + n] = this.frameNow;

    this.setState({frames: newFrames}, ()=> this.dispatch('frame:select', selectedFrameNumber + n));
  }

  moveFrameBackward() {
    this.moveFrameN(-1);
  }

  moveFrameForward() {
    this.moveFrameN(+1);
  }

  selectFrame(selectedFrameNumber, selectedLayerNumber_ = -1) {
    let frame:LayeredImage = this.state.frames[selectedFrameNumber];

    let selectedLayerNumber = selectedLayerNumber_ !== -1 ? selectedLayerNumber_ : this.state.selectedLayerNumber

    if (!frame) {
      return;
    }

    frame.select(selectedLayerNumber);
    let ie = this.replaceIeByLayeredImage(frame);
    this.setState({ie, selectedFrameNumber, selectedLayerNumber});
  }

  replaceFrames(frames) {
    let {selectedFrameNumber} = this.state;

    this.setState({frames}, ()=> this.selectFrame(selectedFrameNumber));
  }

  replaceIeByLayeredImage(layeredImage:LayeredImage) {
    this.ie && this.ie.close();
    this.ie = new ImageEditor(
      this.stage,
      layeredImage.selected,
      layeredImage.width,
      layeredImage.height,
      gen.convertToImage(layeredImage.selected),
      gen.convertToImage(layeredImage.overlay),
      gen.convertToImage(layeredImage.underlay)
    );
    this.scale();
    this.ie.switchGrid(this.state.grid);
  }
};