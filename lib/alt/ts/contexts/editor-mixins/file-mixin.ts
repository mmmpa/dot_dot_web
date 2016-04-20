import FileInformation from "../../models/file-information";
import LayeredImage from "../../models/layered-image";

export let FileMixin = (superclass) => class extends superclass {
  get fileName() {
    let {fileName, layerCount, frameCount} = this.state;
    return `${fileName}_${new Date().getTime()}.${layerCount}.${frameCount}.png`
  }

  parseFileName(fileName) {
    return FileInformation.parseFileName(fileName)
  }

  createBlankCanvas(width, height, backgroundColor) {
    let frames = [new LayeredImage(width, height, [this.gen.blankDataUrl(width, height)])]
    this.setState({
      frames,
      canvasWidth: width,
      canvasHeight: height,
      selectedFrameNumber: 0,
      fileName: ''
    }, ()=> this.dispatch('frame:select', 0));
  }

  save() {
    $('<a>')
      .attr("href", this.ie.exportPng())
      .attr("download", this.fileName)
      .trigger('click');
  }

  open() {
    let $fileListener = $('<input type="file"/>');
    $fileListener.on('change', this.forOpenOnChange());
    $fileListener.trigger('click');
  }

  forOpenOnChange() {
    return (e)=> {
      let file = e.path[0].files[0];
      let information = this.parseFileName(file.name);
      let reader = new FileReader();
      reader.addEventListener('load', this.forOpenOnRead(information));
      reader.readAsDataURL(file);
    }
  }

  forOpenOnRead(information) {
    return (e)=> {
      let img = new Image();
      img.addEventListener('load', this.forOpenOnLoaded(information));
      img.src = e.target.result;
    }
  }

  forOpenOnLoaded(information) {
    return (e)=> {
      let {width, height} = e.target;
      let baseWidth = width / information.frameCount;
      let baseHeight = height / information.layerCount;
      let trimmer = this.gen.trimmer(e.target, baseWidth, baseHeight);

      let frames = _.times(information.frameCount, (n)=> {
        return new LayeredImage(baseWidth, baseHeight, [trimmer(baseWidth * n, 0)])
      });

      this.setState({
        frames,
        canvasWidth: baseWidth,
        canvasHeight: baseHeight,
        selectedFrameNumber: 0,
        fileName: information.name
      }, ()=> this.dispatch('frame:select', 0));
    }
  }
};