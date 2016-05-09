import {ImageEditorState} from '../image-editor';

export let State = (superclass) => class extends superclass {
  stateFloating() {
    this.state = ImageEditorState.Floating;
  }

  stateDrawing() {
    this.state = ImageEditorState.Drawing;
  }

  stateSelected() {
    this.state = ImageEditorState.Selected;
  }

  get isFloating() {
    return this.state === ImageEditorState.Floating;
  }

  get isDrawing() {
    return this.state === ImageEditorState.Drawing;
  }

  get isSelected() {
    return this.state === ImageEditorState.Selected;
  }
};
