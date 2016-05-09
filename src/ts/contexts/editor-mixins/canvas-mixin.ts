import LayeredImage from '../../models/layered-image';
import DataURLEditor from '../../models/data-url-editor';

export let CanvasMixin = (superclass) => class extends superclass {
  resizeCanvasFromModal(component) {
    let modalProps = {
      canvasWidth: this.state.canvasWidth,
      canvasHeight: this.state.canvasHeight,
      onComplete: (top, right, bottom, left) => {
        this.dispatch('modal:hide');
        this.dispatch('canvas:size:complete', top, right, bottom, left);
      },
      onCancel: () => {
        this.dispatch('modal:hide');
      },
    };
    this.dispatch('modal:rise', component, modalProps);
  }

  resizeCanvas(top, right, bottom, left) {
    let {canvasWidth, canvasHeight, frames} = this.state;
    let width  = canvasWidth + left + right;
    let height = canvasHeight + top + bottom;

    let newFrames = frames.map((frame) => {
      return new LayeredImage(width, height, [DataURLEditor.fromImage(frame.image(0), width, height, top, left)]);
    });

    this.setState({
      canvasWidth: width,
      canvasHeight: height,
    }, () => this.dispatch('frame:replace', newFrames));
  }
};
