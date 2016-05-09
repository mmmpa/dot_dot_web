import FileInformation from '../../models/file-information';
import LayeredImage from '../../models/layered-image';
import ImageEditor from '../../models/image-editor';
import LayeredAnimationFrame from '../../models/layered-animation';
import DataURLEditor from '../../models/data-url-editor';

export let FileMixin = (superclass) => class extends superclass {
  get fileName() {
    let {fileName, layerCount, frames} = this.state;
    return `${fileName}_${new Date().getTime()}.${frames.layerCount}.${frames.length}.png`;
  }

  get dataURL() {
    let {canvasWidth, canvasHeight, frames} = this.state;
    let joinedDataURLs = frames.frames.map((frame) => frame.joinedDataURL);
    return DataURLEditor.joinDataURLs(joinedDataURLs, canvasWidth, canvasHeight * frames.layerCount).data;
  }

  parseFileName(fileName) {
    return FileInformation.parseFileName(fileName);
  }

  createBlankCanvas(width, height, backgroundColor) {
    let frames = new LayeredAnimationFrame([new LayeredImage(width, height, [DataURLEditor.blankDataUrl(width, height)])]);
    this.setState({
      frames,
      canvasWidth: width,
      canvasHeight: height,
      fileName: '',
    }, () => this.dispatch('file:start'));
  }

  createBlankCanvasFromModal(component) {
    let modalProps = {
      width: this.state.canvasWidth,
      height: this.state.canvasHeight,
      onComplete: (w, h, bg) => {
        this.dispatch('modal:hide');
        this.dispatch('file:new:complete', w, h, bg);
      },
      onCancel: () => {
        this.dispatch('modal:hide');
      },
    };
    this.dispatch('modal:rise', component, modalProps);
  }

  start() {
    ImageEditor.initialize();
    this.dispatch('frame:select', 0);
  }

  save() {
    $('<a>')
      .attr('href', this.dataURL)
      .attr('download', this.fileName)
      .trigger('click');
  }

  open() {
    let $fileListener = $('<input type="file"/>');
    $fileListener.on('change', this.forOpenOnChange());
    $fileListener.trigger('click');
  }

  forOpenOnChange() {
    return (e) => {
      let file        = e.path[0].files[0];
      let information = this.parseFileName(file.name);
      let reader      = new FileReader();
      reader.addEventListener('load', this.forOpenOnRead(information));
      reader.readAsDataURL(file);
    };
  }

  forOpenOnRead(information) {
    return (e) => {
      let img = new Image();
      img.addEventListener('load', this.forOpenOnLoaded(information));
      img.src = e.target.result;
    };
  }

  forOpenOnLoaded(information) {
    return (e) => {
      let {width, height} = e.target;
      let baseWidth  = width / information.frameCount;
      let baseHeight = height / information.layerCount;
      let trimmer    = DataURLEditor.trimmer(e.target, baseWidth, baseHeight);

      let frames = new LayeredAnimationFrame(_.times(information.frameCount, (n) => {
        return new LayeredImage(
          baseWidth,
          baseHeight,
          _.times(information.layerCount, (nn) => trimmer(baseWidth * n, baseHeight * nn))
        );
      }));

      this.setState({
        frames,
        canvasWidth: baseWidth,
        canvasHeight: baseHeight,
        selectedFrameNumber: 0,
        fileName: information.name,
      }, () => this.dispatch('file:start'));
    };
  }
};