import ImageEditor from "../../models/image-editor";
import LayeredImage from "../../models/layered-image";
import DataURLEditor from "../../models/data-url-editor";

const gen = DataURLEditor;

export let LayerMixin = (superclass) => class extends superclass {
  addLayer() {
    let {frames, selectedLayerNumber, selectedFrameNumber} = this.state;
    frames.forEach((layeredImage)=> layeredImage.add(selectedLayerNumber));
    this.dispatch('frame:select', selectedFrameNumber, selectedLayerNumber);
  }

  removeLayer() {
    let {frames, selectedLayerNumber, selectedFrameNumber} = this.state;
    frames.forEach((layeredImage)=> layeredImage.remove(selectedLayerNumber));
    this.dispatch('frame:select', selectedFrameNumber, selectedLayerNumber);
  }

  moveLayerUpward() {
    let {selectedLayerNumber, selectedFrameNumber} = this.state;
    this.frameNow.moveUpward(selectedLayerNumber, (movedLayerNumber)=> {
      this.dispatch('frame:select', selectedFrameNumber, movedLayerNumber);
    });
  }

  moveLayerDownward() {
    let {selectedLayerNumber, selectedFrameNumber} = this.state;
    this.frameNow.moveDownward(selectedLayerNumber, (movedLayerNumber)=> {
      this.dispatch('frame:select', selectedFrameNumber, movedLayerNumber);
    });
  }
};