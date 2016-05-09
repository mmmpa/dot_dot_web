import ImageEditor from '../../models/image-editor';

export let WorkMixin = (superclass) => class extends superclass {
  undo() {
    ImageEditor.undo(this.ie);
    this.dispatch('frame:update');
  }

  redo() {
    ImageEditor.redo(this.ie);
    this.dispatch('frame:update');
  }
};
