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

  replaceFrames(frames) {
    let {selectedFrameNumber} = this.state;

    this.setState({frames}, ()=> this.selectFrame(selectedFrameNumber));
  }

  updateFrame() {
    let {frames, selectedFrameNumber} = this.state;
    frames[selectedFrameNumber].update(0, this.ie.exportPng());

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

    setTimeout(()=> {
      $(window).bind('mousedown', (e)=> {
        e.preventDefault();
        clearInterval(id);
      })
    }, 1);
  }

  addFrame() {
    let {frames, selectedFrameNumber, canvasWidth, canvasHeight} = this.state;
    let newFrames = frames.reduce((a, frame, i)=> {
      a.push(frame);
      if (i === selectedFrameNumber) {
        a.push(new LayeredImage(canvasWidth, canvasHeight, [this.gen.fromImage(frame.image(0), canvasWidth, canvasHeight)]));
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