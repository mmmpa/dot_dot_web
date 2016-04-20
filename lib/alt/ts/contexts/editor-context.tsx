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
import GradationColor from "../models/gradation-color";
import CanvasSettingComponent from "../components/canvas-setting-component";
import {mix} from "../libs/mix"
import {FileMixin} from "./editor-mixins/file-mixin"
import {ColorMixin} from "./editor-mixins/color-mixin"
import {GradationMixin} from "./editor-mixins/gradation-mixin"

interface P {
}

interface S {
}



export default class EditorContext extends mix(Parcel).with(FileMixin, ColorMixin, GradationMixin) {
  private version:number = 1;
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

    let {scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations} = this.configuration.readOnce('scale', 'grid', 'colors', 'selectedColorNumber', 'selectedColor', 'colorSet', 'gradations');

    this.setState({
      keyControl: this.keyControl,
      mode: null,
      floatingCallback: null,
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
      scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations
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
    //this.dispatch('modal:rise', <CanvasSettingComponent/>, {});
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.intervals.forEach((id)=> clearInterval(id));
  }

  componentDidUpdate(_, state) {
    if (!state.canvasComponentWidth && this.state.canvasComponentWidth) {
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
        gradations: []
      })
    }

    let id = setInterval(()=> {
      let {scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations} = this.state;
      this.configuration.writeOnce({scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations});
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

  riseFloater(e, floatingCallback) {
    let floatingFrom = e.currentTarget;
    this.setState({floatingCallback, floatingFrom}, ()=> {
      let remove = ()=> {
        $(window).unbind('click', remove);
        this.setState({floatingCallback: null, floatingFrom: null})
      };
      setTimeout(()=> {
        $(window).bind('click', remove);
      }, 1)
    });
  }

  selectColorFromFloater(callback) {
    callback();
    this.setState({floatingCallback: null, floatingFrom: null});
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

  center() {
    let {canvasComponentWidth, canvasComponentHeight} = this.state;
    return this.ie.center(parseInt(canvasComponentWidth), parseInt(canvasComponentHeight));
  }



  parseFileName(fileName) {
    return FileInformation.parseFileName(fileName)
  }

  selectFrame(selectedFrameNumber) {
    this.create(this.state.frames[selectedFrameNumber].image(0));
    this.setState({selectedFrameNumber});
  }

  toggleGrid() {
    this.setState({grid: !this.state.grid})
  }

  listen(to) {
    to('edit', 'color:switch', (selectedColorNumber)=>this.setState({selectedColorNumber, selectedColor: this.state.colors[selectedColorNumber]}));
    to('edit', 'color:select', (color)=> this.selectColor(color));
    to('edit', 'color:add', ()=> this.addColor());
    to('edit', 'color:delete', (color)=> this.deleteColor(color));
    to('edit', 'color:arrange', (argb)=>this.arrangeColor(argb));

    to('edit', 'gradation:add', (color1, color2)=> this.addGradation(color1, color2));
    to('edit', 'gradation:delete', (gradation)=> this.deleteGradation(gradation));
    to('edit', 'gradation:change:color1', (gradation, color)=> this.changeGradationColor('color1', gradation, color));
    to('edit', 'gradation:change:color2', (gradation, color)=> this.changeGradationColor('color2', gradation, color));

    to('edit', 'floater:select', (callback)=> this.selectColorFromFloater(callback));
    to('edit', 'floater:rise', (e, floatingCallback)=> this.riseFloater(e, floatingCallback));

    to('edit', 'canvas:mounted', (canvas)=> this.initializeStage(canvas));
    to('edit', 'canvas:draw', (x, y)=> this.draw(x, y));
    to('edit', 'canvas:draw:once', (points)=> this.drawOnce(points));
    to('edit', 'canvas:resize', (canvasComponentWidth, canvasComponentHeight)=> this.setState({canvasComponentWidth, canvasComponentHeight}));
    to('edit', 'canvas:scale:plus', (x, y)=> this.scaleStep(+1, x, y));
    to('edit', 'canvas:scale:minus', (x, y)=> this.scaleStep(-1, x, y));
    to('edit', 'canvas:slide:start', (x, y)=> this.slide = this.ie.startSlide());
    to('edit', 'canvas:slide', (x, y)=> this.slide(x, y));
    to('edit', 'canvas:center', ()=> this.center());
    to('edit', 'canvas:grid:toggle', ()=> this.toggleGrid());

    to('edit', 'frame:select', (n)=> this.selectFrame(n));

    to('edit', 'file:save', ()=> this.save());
    to('edit', 'file:open', ()=> this.open());
    to('edit', 'file:new', (width, height, backgroundColor)=> this.create(width, height, backgroundColor));

    to('edit', 'modal:rise', (modalComponent, modalProps)=> this.setState({modalComponent, modalProps}))

    to('modal', 'modal:canvas', ()=> null)
  }
}