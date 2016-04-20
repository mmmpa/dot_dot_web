import ImageEditor from "../../models/image-editor";

export let FileMixin = (superclass) => class extends superclass {
  get fileName() {
    let {fileName, layerCount, frameCount} = this.state;
    return `${fileName}_${new Date().getTime()}.${layerCount}.${frameCount}.png`
  }

  createBlankCanvas(width, height, backgroundColor) {
    return ImageEditor.create(this.stage, 50, 50);
  }

  createFromImageElement(imageElement){
    return ImageEditor.create(this.stage, 0, 0, imageElement);
  }

  create(imageElement?) {
    this.ie && this.ie.close();
    if (imageElement) {
      this.ie = ImageEditor.create(this.stage, 0, 0, imageElement);
    } else {
      this.ie = ImageEditor.create(this.stage, 50, 50);
    }
    this.scale();
    this.ie.switchGrid(this.state.grid);
    this.setState({ie: this.ie});
  }

  save() {
    $('<a>')
      .attr("href", this.ie.exportPng())
      .attr("download", this.fileName)
      .trigger('click');
  }

  open() {
    let $fileListener = $('<input type="file"/>');

    $fileListener.on('change', (e)=> {
      let file = e.path[0].files[0];
      let information = this.parseFileName(file.name);
      let reader = new FileReader();
      reader.addEventListener('load', (e)=> {
        let img = new Image();
        img.addEventListener('load', (e)=> {
          let {width, height} = e.target;
          let baseWidth = width / information.frameCount;
          let baseHeight = height / information.layerCount;
          let trimmer = this.gen.trimmer(e.target, baseWidth, baseHeight);

          let frames = _.times(information.frameCount, (n)=> {
            // レイヤー分割処理を入れる。
            return new LayeredImage(baseWidth, baseHeight, [trimmer(baseWidth * n, 0)])
          });

          this.setState({frames}, ()=> this.dispatch('frame:select', 0));
        });
        img.src = e.target.result;
      });
      reader.readAsDataURL(file);
    });
    $fileListener.trigger('click');
  }
};