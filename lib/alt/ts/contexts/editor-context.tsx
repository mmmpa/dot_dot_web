import {Parcel} from "../libs/parcel";
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ARGB from "../models/argb";
import KeyControl from "../models/key-control";
import ColorSet from "../models/color-set";
import {FloatingColorPaletteMode} from "../constants/constants";
import ImageEditor from "../models/image-editor";
import FileInformation from "../models/file-information";
import Configuration from "../records/configuration";

interface P {
}

interface S {
}

export default class EditorContext extends Parcel<P,S> {
  private version:number = 1;
  private stage:any;
  private ie:ImageEditor;
  private scaleNumbers:number[] = [1, 2, 4, 8, 16, 32, 64];
  private slide:(x, y)=>void;
  private commands:any = [];
  private keyControl:KeyControl = new KeyControl((mode)=> mode !== this.state.mode && this.setState({mode}))
  private configuration:Configuration;
  private intervals:number[] = [];


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
      frames: [],
      // user state
      scale, grid, colors, selectedColorNumber, selectedColor, colorSet
    });

    this.commands['onControlS'] = ()=> this.save();
    this.commands['onControlN'] = ()=> this.create();
    this.commands['onControlO'] = ()=> this.open();
    this.commands['onG'] = ()=> this.toggleGrid();

    this.keyControl.hook = (name, e:JQueryKeyEventObject)=> {
      this.call(name, e)()
    }
  }

  componentWillUnmount(){
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
        colorSet: new ColorSet([ARGB.number(0xffff0000), ARGB.number(0xff00ff00), ARGB.number(0xff0000ff)]),
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
    //console.log(argb)
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

  selectColorFromFloater(selectedColor:ARGB, index:number) {
    this.detectFloatingAction()(selectedColor, index);
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
    this.create();
  }

  draw(x, y) {
    this.ie.setPixel(x, y, this.state.selectedColor.number, true);
  }

  drawOnce(points) {
    points.forEach(({x, y})=> this.ie.setPixel(x, y, this.state.selectedColor.number));
    this.ie.update();
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
    let $img = $('<img/>');
    let canvas = document.createElement('canvas');
    let context = canvas.getContext("2d");

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

          canvas.width = baseWidth;
          canvas.height = baseHeight;

          console.log(information)
          context.drawImage(e.target, 0, 0, baseWidth, baseHeight, 0, 0, baseWidth, baseHeight);
          $img.prop('src', canvas.toDataURL());
          this.create($img.get(0));
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
    to('color:switch', (selectedColorNumber)=>this.setState({selectedColorNumber, selectedColor: this.state.colors[selectedColorNumber]}));
    to('color:select', (color)=> this.selectColor(color));
    to('color:add', ()=> this.addColor());
    to('color:arrange', (argb)=>this.arrangeColor(argb));

    to('floater:select', (color)=> this.selectColorFromFloater(color));
    to('floater:rise', (e, mode)=> this.riseFloater(e, mode));

    to('canvas:mounted', (canvas)=> this.initializeStage(canvas));
    to('canvas:draw', (x, y)=> this.draw(x, y));
    to('canvas:draw:once', (points)=> this.drawOnce(points));
    to('canvas:resize', (canvasWidth, canvasHeight)=> this.setState({canvasWidth, canvasHeight}));
    to('canvas:scale:plus', (x, y)=> this.scaleStep(+1, x, y));
    to('canvas:scale:minus', (x, y)=> this.scaleStep(-1, x, y));
    to('canvas:slide:start', (x, y)=> this.slide = this.ie.startSlide());
    to('canvas:slide', (x, y)=> this.slide(x, y));
    to('canvas:center', ()=> this.center());
    to('canvas:grid:toggle', ()=> this.toggleGrid());

    to('file:save', ()=> this.save())
    to('file:open', ()=> this.open())
    to('file:new', ()=> this.create())
  }
}