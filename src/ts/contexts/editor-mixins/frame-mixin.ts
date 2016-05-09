import ImageEditor from '../../models/image-editor';
import LayeredImage from '../../models/layered-image';
import DataURLEditor from '../../models/data-url-editor';

const gen = DataURLEditor;

export let FrameMixin = (superclass) => class extends superclass {
  get frameNow(): LayeredImage {
    return this.state.frames.selected;
  }

  addFrame() {
    this.state.frames.cloneSelectedFrame();
    this.dispatch('frame:select');
  }

  removeFrame() {
    this.state.frames.removeSelectedFrame();
    this.dispatch('frame:select');
  }

  moveFrameN(n) {
    this.state.frames.move(n);
    this.dispatch('frame:select');
  }

  moveFrameBackward() {
    this.moveFrameN(-1);
  }

  moveFrameForward() {
    this.moveFrameN(+1);
  }

  selectFrame(selectedFrameNumber_ = -1, selectedLayerNumber_ = -1) {
    let {frames} = this.state;
    let selectedFrameNumber = selectedFrameNumber_ === -1 ? frames.selectedIndex : selectedFrameNumber_;
    let selectedLayerNumber = selectedLayerNumber_ === -1 ? frames.selectedLayerIndex : selectedLayerNumber_;

    frames.select(selectedFrameNumber);
    frames.selectLayer(selectedLayerNumber);

    let ie = this.replaceIeByLayeredImage(frames.selected);
    this.setState({ie});
  }

  replaceFrames(frames) {
    this.setState({frames}, () => this.dispatch('frame:select'));
  }

  replaceIeByLayeredImage(layeredImage: LayeredImage) {
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
