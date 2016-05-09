import ImageEditor from '../../models/image-editor';
import LayeredImage from '../../models/layered-image';
import DataURLEditor from '../../models/data-url-editor';

const gen = DataURLEditor;

export let FrameDisplayMixin = (superclass) => class extends superclass {
  updateFrame() {
    let {frames} = this.state;
    this.setState({frames});
  }

  scaleFrame(framesScale) {
    this.setState({framesScale});
  }

  playFrame(frameRate) {
    let id = setInterval(() => {
      this.selectNextFrame();
    }, 1000 / frameRate);

    let stop = (e) => {
      e.preventDefault();
      clearInterval(id);
      $(window).unbind('mousedown', stop);
    };
    $(window).bind('mousedown', stop);
  }
};
