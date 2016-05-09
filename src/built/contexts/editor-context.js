"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require('../libs/parcel');
var React = require('react');
var argb_1 = require('../models/argb');
var key_control_1 = require('../models/key-control');
var color_set_1 = require('../models/color-set');
var configuration_1 = require('../records/configuration');
var canvas_setting_component_1 = require('../components/canvas-setting-component');
var canvas_resize_component_1 = require('../components/canvas-resize-component');
var mix_1 = require('../libs/mix');
var file_mixin_1 = require('./editor-mixins/file-mixin');
var color_mixin_1 = require('./editor-mixins/color-mixin');
var gradation_mixin_1 = require('./editor-mixins/gradation-mixin');
var canvas_mixin_1 = require('./editor-mixins/canvas-mixin');
var drawing_mixin_1 = require('./editor-mixins/drawing-mixin');
var floater_mixin_1 = require('./editor-mixins/floater-mixin');
var frame_mixin_1 = require('./editor-mixins/frame-mixin');
var frame_display_mixin_1 = require('./editor-mixins/frame-display-mixin');
var layer_mixin_1 = require('./editor-mixins/layer-mixin');
var work_mixin_1 = require('./editor-mixins/work-mixin');
var component_size_1 = require('../models/component-size');
var layered_animation_1 = require('../models/layered-animation');
var EditorContext = (function (_super) {
    __extends(EditorContext, _super);
    function EditorContext() {
        _super.apply(this, arguments);
        this.version = 1;
        this.commands = {};
        this.keyControl = new key_control_1.default();
        this.intervals = [];
    }
    EditorContext.prototype.componentWillMount = function () {
        var _this = this;
        _super.prototype.componentWillMount.call(this);
        this.initializeConfiguration();
        var configuration = this.configuration.readInitial();
        this.setState(_.merge(configuration, {
            componentSize: new component_size_1.default({}),
            keyControl: this.keyControl,
            mode: null,
            floatingCallback: null,
            floatingFrom: null,
            commands: this.commands,
            fileName: 'noname',
            canvasWidth: 0,
            canvasHeight: 0,
            frames: new layered_animation_1.default(),
        }));
        this.keyControl.bind('onG', 'sc', function () { return _this.dispatch('canvas:grid:toggle'); });
        this.keyControl.bind('onDelete', 'sc', function () { return _this.dispatch('canvas:delete'); });
        this.keyControl.bind('onShiftG', 'sc', function () { return _this.dispatch('canvas:outline:toggle'); });
        this.keyControl.bind('onControlS', 'sc', function () { return _this.dispatch('file:save'); });
        this.keyControl.bind('onControlN', 'sc', function () { return _this.dispatch('file:new'); });
        this.keyControl.bind('onControlO', 'sc', function () { return _this.dispatch('file:open'); });
        this.keyControl.bind('onControlZ', 'sc', function () { return _this.dispatch('canvas:undo'); });
        this.keyControl.bind('onControlY', 'sc', function () { return _this.dispatch('canvas:redo'); });
        this.keyControl.bind('onControlShiftZ', 'sc', function () { return _this.dispatch('canvas:redo'); });
        this.keyControl.bind('onControlC', 'sc', function () { return _this.dispatch('canvas:copy'); });
        this.keyControl.bind('onControlV', 'sc', function () { return _this.dispatch('canvas:paste'); });
        this.keyControl.bind('onControlX', 'sc', function () { return _this.dispatch('canvas:cut'); });
        this.keyControl.bind('onArrowUp', 'sc', function () { return _this.dispatch('canvas:move', 1, 0, 0, 0); });
        this.keyControl.bind('onArrowRight', 'sc', function () { return _this.dispatch('canvas:move', 0, 1, 0, 0); });
        this.keyControl.bind('onArrowDown', 'sc', function () { return _this.dispatch('canvas:move', 0, 0, 1, 0); });
        this.keyControl.bind('onArrowLeft', 'sc', function () { return _this.dispatch('canvas:move', 0, 0, 0, 1); });
        this.keyControl.bind('onControlArrowUp', 'sc', function () { return _this.dispatch('canvas:move', 1, 0, 0, 0); });
        this.keyControl.bind('onControlArrowRight', 'sc', function () { return _this.dispatch('canvas:move', 0, 1, 0, 0); });
        this.keyControl.bind('onControlArrowDown', 'sc', function () { return _this.dispatch('canvas:move', 0, 0, 1, 0); });
        this.keyControl.bind('onControlArrowLeft', 'sc', function () { return _this.dispatch('canvas:move', 0, 0, 0, 1); });
    };
    EditorContext.prototype.componentDidMount = function () {
        this.dispatch('file:new:complete', 10, 10, 0);
    };
    EditorContext.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.intervals.forEach(function (id) { return clearInterval(id); });
    };
    EditorContext.prototype.componentDidUpdate = function (_, state) {
        if (!state.canvasComponentWidth && this.state.canvasComponentWidth) {
            this.dispatch('canvas:center', 0);
        }
    };
    EditorContext.prototype.componentWillUpdate = function (props, state) {
        this.configuration.saveFrom(state);
    };
    EditorContext.prototype.initializeConfiguration = function () {
        this.configuration = new configuration_1.default(this.version, {
            scale: 2,
            grid: true,
            colors: [argb_1.default.fromNumber(0xff000000), argb_1.default.fromNumber(0xffffffff)],
            selectedColorNumber: 0,
            selectedColor: argb_1.default.fromNumber(0xff000000),
            colorSet: new color_set_1.default(),
            gradations: [],
        });
    };
    EditorContext.prototype.call = function (name, e) {
        var command = this.state.commands[name];
        if (command) {
            e && e.preventDefault();
            return command;
        }
        else {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return null;
            };
        }
    };
    EditorContext.prototype.initializeStage = function (canvas) {
        var context = canvas.getContext('2d');
        [
            'imageSmoothingEnabled',
            'mozImageSmoothingEnabled',
            'oImageSmoothingEnabled',
            'msImageSmoothingEnabled',
        ].forEach(function (n) { return context[n] = false; });
        this.stage = new createjs.Stage(canvas);
    };
    EditorContext.prototype.resizeComponent = function (target, moveX, moveY) {
        var componentSize = this.state.componentSize;
        var newSize = {};
        newSize[target] = componentSize[target] + moveY;
        componentSize.update(newSize);
        this.setState({ componentSize: componentSize });
    };
    EditorContext.prototype.listen = function (to) {
        var _this = this;
        to(null, 'component:canvas:mounted', function (canvas) { return _this.initializeStage(canvas); });
        to(null, 'component:canvas:resize', function (w, h) { return _this.setState({
            canvasComponentWidth: w,
            canvasComponentHeight: h,
        }); });
        to(null, 'component:resize', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.resizeComponent.apply(_this, args);
        });
        to('edit', 'color:switch', function (i) { return _this.selectFromTip(i); });
        to('edit', 'color:select', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.selectColor.apply(_this, args);
        });
        to('edit', 'color:add', function (color) { return _this.addColor(color); });
        to('edit', 'color:remove', function (color) { return _this.removeColor(color); });
        to('edit', 'color:arrange', function (argb) { return _this.arrangeColor(argb); });
        to('edit', 'gradation:add', function () { return _this.addGradation(); });
        to('edit', 'gradation:remove', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.removeGradation.apply(_this, args);
        });
        to('edit', 'gradation:change:color', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.changeGradationColor.apply(_this, args);
        });
        to('edit', 'floater:select', function (callback) { return _this.selectColorFromFloater(callback); });
        to('edit', 'floater:rise', function (e, floatingCallback) { return _this.riseFloater(e, floatingCallback); });
        to('edit', 'canvas:undo', function () { return _this.undo(); });
        to('edit', 'canvas:redo', function () { return _this.redo(); });
        to('edit', 'canvas:press', function (x, y) { return _this.pressCanvas(x, y); });
        to('edit', 'canvas:press:right', function (x, y) { return _this.pressCanvas(x, y, true); });
        to('edit', 'canvas:drag', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.dragCanvas.apply(_this, args);
        });
        to('edit', 'canvas:drag:right', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.dragCanvas.apply(_this, args.concat([true]));
        });
        to('edit', 'canvas:copy', function (x, y) { return _this.copyCanvas(); });
        to('edit', 'canvas:paste', function (x, y) { return _this.pasteCanvas(); });
        to('edit', 'canvas:cut', function (x, y) { return _this.cutCanvas(); });
        to('edit', 'canvas:select:hidden', function (hidden) { return _this.hideSelection(hidden); });
        to('edit', 'canvas:wheel:up', function (x, y) { return _this.scaleStep(+1, x, y); });
        to('edit', 'canvas:wheel:down', function (x, y) { return _this.scaleStep(-1, x, y); });
        to('edit', 'canvas:center', function () { return _this.center(); });
        to('edit', 'canvas:grid:toggle', function () { return _this.toggleGrid(); });
        to('edit', 'canvas:delete', function (x, y) { return _this.delSelection(); });
        to('edit', 'canvas:move', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.moveCanvas.apply(_this, args);
        });
        to('edit', 'canvas:size', function () { return _this.resizeCanvasFromModal(React.createElement(canvas_resize_component_1.default, null)); });
        to('edit', 'canvas:size:complete', function (top, right, bottom, left) { return _this.resizeCanvas(top, right, bottom, left); });
        to('edit', 'layer:add', function () { return _this.addLayer(); });
        to('edit', 'layer:remove', function () { return _this.removeLayer(); });
        to('edit', 'layer:move:upward', function () { return _this.moveLayerUpward(); });
        to('edit', 'layer:move:downward', function () { return _this.moveLayerDownward(); });
        to('edit', 'frame:select', function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return _this.selectFrame.apply(_this, args);
        });
        to('edit', 'frame:next', function () { return _this.selectNextFrame(); });
        to('edit', 'frame:previous', function () { return _this.selectPreviousFrame(); });
        to('edit', 'frame:add', function () { return _this.addFrame(); });
        to('edit', 'frame:remove', function () { return _this.removeFrame(); });
        to('edit', 'frame:move:backward', function () { return _this.moveFrameBackward(); });
        to('edit', 'frame:move:forward', function () { return _this.moveFrameForward(); });
        to('edit', 'frame:scale', function (n) { return _this.scaleFrame(n); });
        to('edit', 'frame:play', function (n) { return _this.playFrame(n); });
        to('edit', 'frame:rate', function (n) { return _this.setFrameRate(n); });
        to('edit', 'frame:replace', function (frames) { return _this.replaceFrames(frames); });
        to('edit', 'frame:update', function () { return _this.updateFrame(); });
        to('edit', 'file:save', function () { return _this.save(); });
        to('edit', 'file:open', function () { return _this.open(); });
        to('edit', 'file:new', function () { return _this.createBlankCanvasFromModal(React.createElement(canvas_setting_component_1.default, null)); });
        to('edit', 'file:new:complete', function (w, h, bg) { return _this.createBlankCanvas(w, h, bg); });
        to('edit', 'file:name', function (fileName) { return _this.setState({ fileName: fileName }); });
        to('edit', 'file:start', function (fileName) { return _this.start(); });
        to('edit', 'modal:rise', function (modalComponent, modalProps) { return _this.setState({
            modalComponent: modalComponent,
            modalProps: modalProps,
        }); });
        to('modal', 'modal:hide', function () { return _this.setState({
            modalComponent: null,
            modalProps: null,
        }); });
        to('modal', 'modal:canvas', function () { return null; });
    };
    return EditorContext;
}(mix_1.mix(parcel_1.Parcel).mix(file_mixin_1.FileMixin, canvas_mixin_1.CanvasMixin, drawing_mixin_1.DrawingMixin, color_mixin_1.ColorMixin, floater_mixin_1.FloaterMixin, gradation_mixin_1.GradationMixin, frame_mixin_1.FrameMixin, frame_display_mixin_1.FrameDisplayMixin, layer_mixin_1.LayerMixin, work_mixin_1.WorkMixin)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorContext;
//# sourceMappingURL=editor-context.js.map