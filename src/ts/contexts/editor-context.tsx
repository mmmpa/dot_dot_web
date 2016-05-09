import {Parcel} from '../libs/parcel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ARGB from '../models/argb';
import KeyControl from '../models/key-control';
import ColorSet from '../models/color-set';
import Configuration from '../records/configuration';
import CanvasSettingComponent from '../components/canvas-setting-component';
import CanvasResizeComponent from '../components/canvas-resize-component';
import {mix} from '../libs/mix';
import {FileMixin} from './editor-mixins/file-mixin';
import {ColorMixin} from './editor-mixins/color-mixin';
import {GradationMixin} from './editor-mixins/gradation-mixin';
import {CanvasMixin} from './editor-mixins/canvas-mixin';
import {DrawingMixin} from './editor-mixins/drawing-mixin';
import {FloaterMixin} from './editor-mixins/floater-mixin';
import {FrameMixin} from './editor-mixins/frame-mixin';
import {FrameDisplayMixin} from './editor-mixins/frame-display-mixin';
import {LayerMixin} from './editor-mixins/layer-mixin';
import {WorkMixin} from './editor-mixins/work-mixin';
import ComponentSize from '../models/component-size';
import LayeredAnimationFrame from '../models/layered-animation';

interface P {
}

interface S {
}


export default class EditorContext extends (mix(Parcel).mix(
  FileMixin,
  CanvasMixin,
  DrawingMixin,
  ColorMixin,
  FloaterMixin,
  GradationMixin,
  FrameMixin,
  FrameDisplayMixin,
  LayerMixin,
  WorkMixin
) as typeof Parcel) {
  private version: number        = 1;
  private stage: any;
  private commands: any          = {};
  private keyControl: KeyControl = new KeyControl();
  private configuration: Configuration;
  private intervals: number[]    = [];

  componentWillMount() {
    super.componentWillMount();
    this.initializeConfiguration();
    let configuration = this.configuration.readInitial();

    this.setState(_.merge(configuration, {
      componentSize: new ComponentSize({}),
      keyControl: this.keyControl,
      mode: null,
      floatingCallback: null,
      floatingFrom: null,
      commands: this.commands,
      fileName: 'noname',
      canvasWidth: 0,
      canvasHeight: 0,
      frames: new LayeredAnimationFrame(),
    }));

    this.keyControl.bind('onG', 'sc', () => this.dispatch('canvas:grid:toggle'));
    this.keyControl.bind('onDelete', 'sc', () => this.dispatch('canvas:delete'));
    this.keyControl.bind('onShiftG', 'sc', () => this.dispatch('canvas:outline:toggle'));
    this.keyControl.bind('onControlS', 'sc', () => this.dispatch('file:save'));
    this.keyControl.bind('onControlN', 'sc', () => this.dispatch('file:new'));
    this.keyControl.bind('onControlO', 'sc', () => this.dispatch('file:open'));
    this.keyControl.bind('onControlZ', 'sc', () => this.dispatch('canvas:undo'));
    this.keyControl.bind('onControlY', 'sc', () => this.dispatch('canvas:redo'));
    this.keyControl.bind('onControlShiftZ', 'sc', () => this.dispatch('canvas:redo'));
    this.keyControl.bind('onControlC', 'sc', () => this.dispatch('canvas:copy'));
    this.keyControl.bind('onControlV', 'sc', () => this.dispatch('canvas:paste'));
    this.keyControl.bind('onControlX', 'sc', () => this.dispatch('canvas:cut'));
    this.keyControl.bind('onArrowUp', 'sc', () => this.dispatch('canvas:move', 1, 0, 0, 0));
    this.keyControl.bind('onArrowRight', 'sc', () => this.dispatch('canvas:move', 0, 1, 0, 0));
    this.keyControl.bind('onArrowDown', 'sc', () => this.dispatch('canvas:move', 0, 0, 1, 0));
    this.keyControl.bind('onArrowLeft', 'sc', () => this.dispatch('canvas:move', 0, 0, 0, 1));
    this.keyControl.bind('onControlArrowUp', 'sc', () => this.dispatch('canvas:move', 1, 0, 0, 0));
    this.keyControl.bind('onControlArrowRight', 'sc', () => this.dispatch('canvas:move', 0, 1, 0, 0));
    this.keyControl.bind('onControlArrowDown', 'sc', () => this.dispatch('canvas:move', 0, 0, 1, 0));
    this.keyControl.bind('onControlArrowLeft', 'sc', () => this.dispatch('canvas:move', 0, 0, 0, 1));
  }

  componentDidMount() {
    this.dispatch('file:new:complete', 10, 10, 0);
  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.intervals.forEach((id) => clearInterval(id));
  }

  componentDidUpdate(_, state) {
    if (!state.canvasComponentWidth && this.state.canvasComponentWidth) {
      this.dispatch('canvas:center', 0);
    }
  }

  componentWillUpdate(props, state) {
    this.configuration.saveFrom(state);
  }

  initializeConfiguration() {
    this.configuration = new Configuration(this.version, {
      scale: 2,
      grid: true,
      colors: [ARGB.fromNumber(0xff000000), ARGB.fromNumber(0xffffffff)],
      selectedColorNumber: 0,
      selectedColor: ARGB.fromNumber(0xff000000),
      colorSet: new ColorSet(),
      gradations: [],
    });
  }

  call(name, e?) {
    let command = this.state.commands[name];

    if (command) {
      e && e.preventDefault();
      return command;
    } else {
      return (...args) => null;
    }
  }

  initializeStage(canvas) {
    let context = canvas.getContext('2d');
    [
      'imageSmoothingEnabled',
      'mozImageSmoothingEnabled',
      'oImageSmoothingEnabled',
      'msImageSmoothingEnabled',
    ].forEach((n) => context[n] = false);

    this.stage = new createjs.Stage(canvas);
  }

  resizeComponent(target: string, moveX: number, moveY: number) {
    let {componentSize} = this.state;
    let newSize     = {};
    newSize[target] = componentSize[target] + moveY;
    componentSize.update(newSize);
    this.setState({componentSize});
  }

  listen(to) {
    to(null, 'component:canvas:mounted', (canvas) => this.initializeStage(canvas));
    to(null, 'component:canvas:resize', (w, h) => this.setState({
      canvasComponentWidth: w,
      canvasComponentHeight: h,
    }));

    to(null, 'component:resize', (...args) => this.resizeComponent(...args));

    to('edit', 'color:switch', (i) => this.selectFromTip(i));
    to('edit', 'color:select', (...args) => this.selectColor(...args));
    to('edit', 'color:add', (color) => this.addColor(color));
    to('edit', 'color:remove', (color) => this.removeColor(color));
    to('edit', 'color:arrange', (argb) => this.arrangeColor(argb));

    to('edit', 'gradation:add', () => this.addGradation());
    to('edit', 'gradation:remove', (...args) => this.removeGradation(...args));
    to('edit', 'gradation:change:color', (...args) => this.changeGradationColor(...args));

    to('edit', 'floater:select', (callback) => this.selectColorFromFloater(callback));
    to('edit', 'floater:rise', (e, floatingCallback) => this.riseFloater(e, floatingCallback));

    to('edit', 'canvas:undo', () => this.undo());
    to('edit', 'canvas:redo', () => this.redo());

    to('edit', 'canvas:press', (x, y) => this.pressCanvas(x, y));
    to('edit', 'canvas:press:right', (x, y) => this.pressCanvas(x, y, true));
    to('edit', 'canvas:drag', (...args) => this.dragCanvas(...args));
    to('edit', 'canvas:drag:right', (...args) => this.dragCanvas(...args, true));
    to('edit', 'canvas:copy', (x, y) => this.copyCanvas());
    to('edit', 'canvas:paste', (x, y) => this.pasteCanvas());
    to('edit', 'canvas:cut', (x, y) => this.cutCanvas());
    to('edit', 'canvas:select:hidden', (hidden) => this.hideSelection(hidden));
    to('edit', 'canvas:wheel:up', (x, y) => this.scaleStep(+1, x, y));
    to('edit', 'canvas:wheel:down', (x, y) => this.scaleStep(-1, x, y));
    to('edit', 'canvas:center', () => this.center());
    to('edit', 'canvas:grid:toggle', () => this.toggleGrid());
    to('edit', 'canvas:delete', (x, y) => this.delSelection());
    to('edit', 'canvas:move', (...args) => this.moveCanvas(...args));

    to('edit', 'canvas:size', () => this.resizeCanvasFromModal(<CanvasResizeComponent/>));
    to('edit', 'canvas:size:complete', (top, right, bottom, left) => this.resizeCanvas(top, right, bottom, left));

    to('edit', 'layer:add', () => this.addLayer());
    to('edit', 'layer:remove', () => this.removeLayer());
    to('edit', 'layer:move:upward', () => this.moveLayerUpward());
    to('edit', 'layer:move:downward', () => this.moveLayerDownward());

    to('edit', 'frame:select', (...args) => this.selectFrame(...args));
    to('edit', 'frame:next', () => this.selectNextFrame());
    to('edit', 'frame:previous', () => this.selectPreviousFrame());
    to('edit', 'frame:add', () => this.addFrame());
    to('edit', 'frame:remove', () => this.removeFrame());
    to('edit', 'frame:move:backward', () => this.moveFrameBackward());
    to('edit', 'frame:move:forward', () => this.moveFrameForward());
    to('edit', 'frame:scale', (n) => this.scaleFrame(n));
    to('edit', 'frame:play', (n) => this.playFrame(n));
    to('edit', 'frame:rate', (n) => this.setFrameRate(n));
    to('edit', 'frame:replace', (frames) => this.replaceFrames(frames));
    to('edit', 'frame:update', () => this.updateFrame());

    to('edit', 'file:save', () => this.save());
    to('edit', 'file:open', () => this.open());
    to('edit', 'file:new', () => this.createBlankCanvasFromModal(<CanvasSettingComponent/>));
    to('edit', 'file:new:complete', (w, h, bg) => this.createBlankCanvas(w, h, bg));
    to('edit', 'file:name', (fileName) => this.setState({fileName}));
    to('edit', 'file:start', (fileName) => this.start());

    to('edit', 'modal:rise', (modalComponent, modalProps) => this.setState({
      modalComponent,
      modalProps,
    }));

    to('modal', 'modal:hide', () => this.setState({
      modalComponent: null,
      modalProps: null,
    }));

    to('modal', 'modal:canvas', () => null);
  }
}
