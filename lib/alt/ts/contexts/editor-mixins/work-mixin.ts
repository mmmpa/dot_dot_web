import FileInformation from "../../models/file-information";
import LayeredImage from "../../models/layered-image";
import ImageEditor from "../../models/image-editor";

export let WorkMixin = (superclass) => class extends superclass {
  undo() {
    ImageEditor.undo();
    this.dispatch('frame:update');
  }

  redo() {
    ImageEditor.redo();
    this.dispatch('frame:update');
  }
};