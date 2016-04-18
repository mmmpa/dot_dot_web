import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ARGB from "../models/argb";
import KeyControl from "../models/key-control";
import ColorSet from "../models/color-set";
import {FloatingColorPaletteMode, nes} from "../constants/constants";
import ImageEditor from "../models/image-editor";
import FileInformation from "../models/file-information";
import Configuration from "../records/configuration";
import LayeredImage from "../models/layered-image";
import DataUrlGenerator from "../models/data-url-generator";

interface P {
}

interface S {
}

export default class EditorContext extends Parcel<P,S> {
  private version:number = 2;
  private stage:any;
  private ie:ImageEditor;
  private scaleNumbers:number[] = [1, 2, 4, 8, 16, 32, 64];
  private slide:(x, y)=>void;
  private commands:any = [];
  private keyControl:KeyControl = new KeyControl((mode)=> mode !== this.state.mode && this.setState({mode}))
  private configuration:Configuration;
  private intervals:number[] = [];
  private gen:DataUrlGenerator = new DataUrlGenerator();

  componentWillMount() {
    this.initializeConfiguration();
    super.componentWillMount();

    let {scale, grid, colors, selectedColorNumber, selectedColor, colorSet} = this.configuration.readOnce('scale', 'grid', 'colors', 'selectedColorNumber', 'selectedColor', 'colorSet');

    this.setState({
      keyControl: this.keyControl,
      mode: null,
      floatingColorPaletteMode: null,
      floatingFrom: null,
      commands: this.commands,
      draw: (...args)=> this.draw(...args),
      drawOnce: (...args)=> this.drawOnce(...args),
      layerCount: 1,
      frameCount: 1,
      fileName: 'noname',
      layers: [],
      frames: [new LayeredImage(10, 10, [this.gen.blankDataUrl(10, 10)])],
      selectedFrameNumber: 0,
      // user state
      scale, grid, colors, selectedColorNumber, selectedColor, colorSet
    });

    this.commands['onG'] = ()=> this.dispatch('canvas:grid:toggle');
    this.commands['onShiftG'] = ()=> this.dispatch('canvas:outline:toggle');
    this.commands['onControlS'] = ()=> this.dispatch('file:save');
    this.commands['onControlN'] = ()=> this.dispatch('file:new');
    this.commands['onControlO'] = ()=> this.dispatch('file:open');
    this.commands['onControlZ'] = ()=> this.dispatch('work:undo');
    this.commands['onControlY'] = ()=> this.dispatch('work:redo');
    this.commands['onControlShiftZ'] = ()=> this.dispatch('work:redo');
    this.commands['onControlArrowUp'] = ()=> this.dispatch('canvas:size', 1, 0, 0, 0);
    this.commands['onControlArrowRight'] = ()=> this.dispatch('canvas:size', 0, 1, 0, 0);
    this.commands['onControlArrowDown'] = ()=> this.dispatch('canvas:size', 0, 0, 1, 0);
    this.commands['onControlArrowLeft'] = ()=> this.dispatch('canvas:size', 0, 0, 0, 1);
    this.commands['onControlShiftArrowUp'] = ()=> this.dispatch('canvas:size', -1, 0, 0, 0);
    this.commands['onControlShiftArrowRight'] = ()=> this.dispatch('canvas:size', 0, -1, 0, 0);
    this.commands['onControlShiftArrowDown'] = ()=> this.dispatch('canvas:size', 0, 0, -1, 0);
    this.commands['onControlShiftArrowLeft'] = ()=> this.dispatch('canvas:size', 0, 0, 0, -1);

    this.keyControl.hook = (name, e:JQueryKeyEventObject)=> {
      this.call(name, e)()
    }
  }

  componentDidMount() {
    this.dispatch('frame:select', 0);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.intervals.forEach((id)=> clearInterval(id));
  }

  componentDidUpdate(_, state) {
    if (!state.canvasWidth && this.state.canvasWidth) {
      this.center();
    }

    if (state.grid !== this.state.grid) {
      this.ie.switchGrid(this.state.grid);
    }
  }

  initializeConfiguration() {
    this.configuration = new Configuration();

    if (this.configuration.read('initialized') !== this.version) {
      this.configuration.writeOnce({
        initialized: this.version,
        scale: 2,
        grid: true,
        colors: [ARGB.number(0xff000000), ARGB.number(0xffffffff)],
        selectedColorNumber: 0,
        selectedColor: ARGB.number(0xff000000),
        colorSet: new ColorSet(nes),
      })
    }

    let id = setInterval(()=> {
      let {scale, grid, colors, selectedColorNumber, selectedColor, colorSet} = this.state;
      this.configuration.writeOnce({scale, grid, colors, selectedColorNumber, selectedColor, colorSet});
    }, 1000);
    this.intervals.push(id);
  }

  call(name, e?) {
    let command = this.state.commands[name];

    if (command) {
      e && e.preventDefault();
      return command;
    } else {
      return (...args) => null
    }
  }

  arrangeColor({a, r, g, b}) {
    let {selectedColorNumber} = this.state;
    let colors = this.state.colors.concat();
    let selectedColor = new ARGB(a, r, g, b)
    colors[selectedColorNumber] = selectedColor;
    this.setState({colors, selectedColor});
  }

  selectColor(selectedColor:ARGB) {
    let {colors, selectedColorNumber} = this.state;
    colors = colors.concat();
    colors[selectedColorNumber] = selectedColor;
    this.setState({colors, selectedColor})
  }

  riseFloater(e, floatingColorPaletteMode) {
    let floatingFrom = e.currentTarget;
    this.setState({floatingColorPaletteMode, floatingFrom});
  }

  selectColorFromFloater(selectedColor:ARGB) {
    this.detectFloatingAction()(selectedColor);
    this.setState({floatingColorPaletteMode: null})
  }

  detectFloatingAction() {
    switch (this.state.floatingColorPaletteMode) {
      case FloatingColorPaletteMode.Delete:
        return this.deleteColor.bind(this)
    }
  }

  addColor() {
    let {colorSet, selectedColor} = this.state;
    colorSet.add(selectedColor);
    this.setState({colorSet})
  }

  deleteColor(color) {
    let {colorSet} = this.state;
    colorSet.remove(color);
    this.setState({colorSet})
  }

  initializeStage(canvas) {
    let context = canvas.getContext('2d');
    [
      'imageSmoothingEnabled',
      'mozImageSmoothingEnabled',
      'oImageSmoothingEnabled',
      'msImageSmoothingEnabled'
    ].forEach((n)=> context[n] = false);

    this.stage = new createjs.Stage(canvas);
  }

  draw(x, y) {
    this.ie.setPixel(x, y, this.state.selectedColor.number, true);
    this.updateFrame();
  }

  drawOnce(points) {
    points.forEach(({x, y})=> this.ie.setPixel(x, y, this.state.selectedColor.number));
    this.ie.update();
    this.updateFrame();
  }

  updateFrame() {
    let {frames, selectedFrameNumber} = this.state;
    frames[selectedFrameNumber].update(0, this.ie.exportPng());

    this.setState({});
  }

  scaleStep(direction, x?, y?) {
    let {scale} = this.state;
    scale += direction;
    if (scale < 0) {
      scale = 0;
    } else if (scale >= this.scaleNumbers.length) {
      scale = this.scaleNumbers.length - 1;
    }

    this.scale(scale, x, y)
    this.setState({scale});
  }

  scale(scale?, x?, y?) {
    this.ie.scale(this.scaleNumbers[scale || this.state.scale], x, y);
    if (!x && !y) {
      this.center();
    }
  }

  get fileName() {
    let {fileName, layerCount, frameCount} = this.state;
    return `${fileName}_${new Date().getTime()}.${layerCount}.${frameCount}.png`
  }

  center() {
    let {canvasWidth, canvasHeight} = this.state;
    return this.ie.center(parseInt(canvasWidth), parseInt(canvasHeight));
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

  parseFileName(fileName) {
    return FileInformation.parseFileName(fileName)
  }

  selectFrame(selectedFrameNumber) {
    this.create(this.state.frames[selectedFrameNumber].image(0));
    this.setState({selectedFrameNumber});
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

  toggleGrid() {
    this.setState({grid: !this.state.grid})
  }

  listen(to) {
    to('edit', 'color:switch', (selectedColorNumber)=>this.setState({selectedColorNumber, selectedColor: this.state.colors[selectedColorNumber]}));
    to('edit', 'color:select', (color)=> this.selectColor(color));
    to('edit', 'color:add', ()=> this.addColor());
    to('edit', 'color:arrange', (argb)=>this.arrangeColor(argb));

    to('edit', 'floater:select', (color)=> this.selectColorFromFloater(color));
    to('edit', 'floater:rise', (e, mode)=> this.riseFloater(e, mode));

    to('edit', 'canvas:mounted', (canvas)=> this.initializeStage(canvas));
    to('edit', 'canvas:draw', (x, y)=> this.draw(x, y));
    to('edit', 'canvas:draw:once', (points)=> this.drawOnce(points));
    to('edit', 'canvas:resize', (canvasWidth, canvasHeight)=> this.setState({canvasWidth, canvasHeight}));
    to('edit', 'canvas:scale:plus', (x, y)=> this.scaleStep(+1, x, y));
    to('edit', 'canvas:scale:minus', (x, y)=> this.scaleStep(-1, x, y));
    to('edit', 'canvas:slide:start', (x, y)=> this.slide = this.ie.startSlide());
    to('edit', 'canvas:slide', (x, y)=> this.slide(x, y));
    to('edit', 'canvas:center', ()=> this.center());
    to('edit', 'canvas:grid:toggle', ()=> this.toggleGrid());

    to('edit', 'frame:select', (n)=> this.selectFrame(n));

    to('edit', 'file:save', ()=> this.save());
    to('edit', 'file:open', ()=> this.open());
    to('edit', 'file:new', ()=> this.create());
  }
}