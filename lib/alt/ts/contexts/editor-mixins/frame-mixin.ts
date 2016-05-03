import ImageEditor from "../../models/image-editor";
import LayeredImage from "../../models/layered-image";
import DataURLGenerator from "../../models/data-url-generator";

const gen = new DataURLGenerator();

export let FrameMixin = (superclass) => class extends superclass {
  replaceIeByLayeredImage(layeredImage:LayeredImage) {
    this.ie && this.ie.close();
    this.ie = ImageEditor.create(
      this.stage,
      layeredImage.width,
      layeredImage.height,
      gen.convertToImage(layeredImage.selected),
      gen.convertToImage(layeredImage.overlay),
      gen.convertToImage(layeredImage.underlay)
    );
    let target = layeredImage.selected;
    this.ie.onChange = (ie:ImageEditor)=> {
      target.update(ie.exportPng());
    };
    this.scale();
    this.ie.switchGrid(this.state.grid);
  }

  get frameNow():LayeredImage {
    return this.state.frames[this.state.selectedFrameNumber];
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

  updateFrame() {
    let {frames, selectedFrameNumber, selectedLayerNumber} = this.state;

    this.setState({frames});
  }

  selectNextFrame() {
    let nextFrame = this.state.selectedFrameNumber + 1;
    if (!this.state.frames[nextFrame]) {
      nextFrame = 0;
    }
    this.dispatch('frame:select', nextFrame)
  }

  selectPreviousFrame() {
    let nextFrame = this.state.selectedFrameNumber - 1;
    if (!this.state.frames[nextFrame]) {
      nextFrame = this.state.frames.length - 1;
    }
    this.dispatch('frame:select', nextFrame)
  }

  scaleFrame(framesScale) {
    this.setState({framesScale})
  }

  setFrameRate(frameRate) {
    this.setState({frameRate})
  }

  playFrame(frameRate) {
    let id = setInterval(()=> {
      this.selectNextFrame();
    }, 1000 / frameRate);

    let stop = (e)=> {
      e.preventDefault();
      clearInterval(id);
      $(window).unbind('mousedown', stop);
    };
    $(window).bind('mousedown', stop);
  }

  addLayer() {
    let {frames, selectedLayerNumber, selectedFrameNumber} = this.state;
    frames.forEach((layeredImage)=>layeredImage.add(selectedLayerNumber));
    this.dispatch('frame:select', selectedFrameNumber, selectedLayerNumber);
  }

  removeLayer() {
    let {frames, selectedLayerNumber, selectedFrameNumber} = this.state;
    frames.forEach((layeredImage)=>layeredImage.remove(selectedLayerNumber))
    this.dispatch('frame:select', selectedFrameNumber, selectedLayerNumber);
  }

  moveLayerUpward(){
    let {selectedLayerNumber, selectedFrameNumber} = this.state;
    this.frameNow.moveUpward(selectedLayerNumber, (movedLayerNumber)=>{
      this.dispatch('frame:select', selectedFrameNumber, movedLayerNumber);
    });
  }

  moveLayerDownward(){
    let {selectedLayerNumber, selectedFrameNumber} = this.state;
    this.frameNow.moveDownward(selectedLayerNumber, (movedLayerNumber)=>{
      this.dispatch('frame:select', selectedFrameNumber, movedLayerNumber);
    });
  }

  addFrame() {
    let {frames, selectedFrameNumber} = this.state;
    let newFrame = frames[selectedFrameNumber].clone();
    frames.splice(selectedFrameNumber, 0, newFrame);
    this.setState({frames}, ()=> this.dispatch('frame:select', selectedFrameNumber + 1));
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
    let {frames, selectedFrameNumber} = this.state;
    let target = frames[selectedFrameNumber - 1];
    if (!target) {
      return;
    }

    let newFrames = frames.concat();

    newFrames[selectedFrameNumber] = target;
    newFrames[selectedFrameNumber - 1] = this.frameNow;

    this.setState({frames: newFrames}, ()=> this.dispatch('frame:select', selectedFrameNumber - 1));
  }

  moveFrameForward() {
    let {frames, selectedFrameNumber} = this.state;
    let target = frames[selectedFrameNumber + 1];
    if (!target) {
      return;
    }

    let newFrames = frames.concat();

    newFrames[selectedFrameNumber] = target;
    newFrames[selectedFrameNumber + 1] = this.frameNow;

    this.setState({frames: newFrames}, ()=> this.dispatch('frame:select', selectedFrameNumber + 1));
  }
};