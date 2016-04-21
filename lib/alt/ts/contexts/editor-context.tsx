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
import {CanvasMixin} from "./editor-mixins/canvas-mixin"
import {FloaterMixin} from "./editor-mixins/floater-mixin"
import {FrameMixin} from "./editor-mixins/frame-mixin"

interface P {
}

interface S {
}


export default class EditorContext extends mix(Parcel).with(FileMixin, ColorMixin, GradationMixin, CanvasMixin, FloaterMixin, FrameMixin) {
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

    let {scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations, framesScale} = this.configuration.readOnce('scale', 'grid', 'colors', 'selectedColorNumber', 'selectedColor', 'colorSet', 'gradations', 'framesScale');

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
      canvasWidth: 0,
      canvasHeight: 0,
      frames: [],
      selectedFrameNumber: 0,
      // user state
      scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations, framesScale
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
    this.dispatch('file:new:complete', 10, 10, 0);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.intervals.forEach((id)=> clearInterval(id));
  }

  componentDidUpdate(_, state) {
    if (!state.canvasComponentWidth && this.state.canvasComponentWidth) {
      this.dispatch('canvas:center', 0)
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
        gradations: [],
        framesScale: 4
      })
    }

    let id = setInterval(()=> {
      let {scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations, framesScale} = this.state;
      this.configuration.writeOnce({scale, grid, colors, selectedColorNumber, selectedColor, colorSet, gradations, framesScale});
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

  listen(to) {
    to('edit', 'color:switch', (i)=> this.selectFromTip(i));
    to('edit', 'color:select', (color)=> this.selectColor(color));
    to('edit', 'color:add', (color)=> this.addColor(color));
    to('edit', 'color:delete', (color)=> this.deleteColor(color));
    to('edit', 'color:arrange', (argb)=>this.arrangeColor(argb));

    to('edit', 'gradation:add', (color1, color2)=> this.addGradation(color1, color2));
    to('edit', 'gradation:delete', (gradation)=> this.deleteGradation(gradation));
    to('edit', 'gradation:change:color1', (gradation, color)=> this.changeGradationColor('color1', gradation, color));
    to('edit', 'gradation:change:color2', (gradation, color)=> this.changeGradationColor('color2', gradation, color));

    to('edit', 'floater:select', (callback)=> this.selectColorFromFloater(callback));
    to('edit', 'floater:rise', (e, floatingCallback)=> this.riseFloater(e, floatingCallback));

    to('edit', 'canvas:mounted', (canvas)=> this.initializeStage(canvas));
    to('edit', 'canvas:draw', (x, y, color)=> this.draw(x, y, color));
    to('edit', 'canvas:draw:once', (points, color)=> this.drawOnce(points, color));
    to('edit', 'canvas:resize', (w, h)=> this.setState({canvasComponentWidth: w, canvasComponentHeight: h}));
    to('edit', 'canvas:scale:plus', (x, y)=> this.scaleStep(+1, x, y));
    to('edit', 'canvas:scale:minus', (x, y)=> this.scaleStep(-1, x, y));
    to('edit', 'canvas:slide:start', (x, y)=> this.slide = this.ie.startSlide());
    to('edit', 'canvas:slide', (x, y)=> this.slide(x, y));
    to('edit', 'canvas:center', ()=> this.center());
    to('edit', 'canvas:grid:toggle', ()=> this.toggleGrid());

    to('edit', 'frame:select', (n)=> this.selectFrame(n));
    to('edit', 'frame:next', ()=> this.selectNextFrame());
    to('edit', 'frame:previous', ()=> this.selectPreviousFrame());
    to('edit', 'frame:add', ()=> this.addFrame());
    to('edit', 'frame:delete', ()=> this.deleteFrame());
    to('edit', 'frame:move:backward', ()=> this.moveFrameBackward());
    to('edit', 'frame:move:forward', ()=> this.moveFrameForward());
    to('edit', 'frame:scale', (n)=> this.scaleFrame(n));

    to('edit', 'file:save', ()=> this.save());
    to('edit', 'file:open', ()=> this.open());
    to('edit', 'file:new', ()=> this.createBlankCanvasFromModal(<CanvasSettingComponent/>));
    to('edit', 'file:new:complete', (w, h, bg)=> this.createBlankCanvas(w, h, bg));
    to('edit', 'file:name', (fileName)=> this.setState({fileName}));

    to('edit', 'modal:rise', (modalComponent, modalProps)=> this.setState({modalComponent, modalProps}))
    to('modal', 'modal:hide', ()=> this.setState({modalComponent: null, modalProps: null}))

    to('modal', 'modal:canvas', ()=> null)
  }
}