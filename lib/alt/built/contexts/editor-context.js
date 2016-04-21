"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require('react');
var argb_1 = require("../models/argb");
var key_control_1 = require("../models/key-control");
var color_set_1 = require("../models/color-set");
var constants_1 = require("../constants/constants");
var configuration_1 = require("../records/configuration");
var data_url_generator_1 = require("../models/data-url-generator");
var canvas_setting_component_1 = require("../components/canvas-setting-component");
var mix_1 = require("../libs/mix");
var file_mixin_1 = require("./editor-mixins/file-mixin");
var color_mixin_1 = require("./editor-mixins/color-mixin");
var gradation_mixin_1 = require("./editor-mixins/gradation-mixin");
var canvas_mixin_1 = require("./editor-mixins/canvas-mixin");
var floater_mixin_1 = require("./editor-mixins/floater-mixin");
var frame_mixin_1 = require("./editor-mixins/frame-mixin");
var EditorContext = (function (_super) {
    __extends(EditorContext, _super);
    function EditorContext() {
        var _this = this;
        _super.apply(this, arguments);
        this.version = 1;
        this.scaleNumbers = [1, 2, 4, 8, 16, 32, 64];
        this.commands = [];
        this.keyControl = new key_control_1.default(function (mode) { return mode !== _this.state.mode && _this.setState({ mode: mode }); });
        this.intervals = [];
        this.gen = new data_url_generator_1.default();
    }
    EditorContext.prototype.componentWillMount = function () {
        var _this = this;
        this.initializeConfiguration();
        _super.prototype.componentWillMount.call(this);
        var _a = this.configuration.readOnce('scale', 'grid', 'colors', 'selectedColorNumber', 'selectedColor', 'colorSet', 'gradations'), scale = _a.scale, grid = _a.grid, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber, selectedColor = _a.selectedColor, colorSet = _a.colorSet, gradations = _a.gradations;
        this.setState({
            keyControl: this.keyControl,
            mode: null,
            floatingCallback: null,
            floatingFrom: null,
            commands: this.commands,
            draw: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return _this.draw.apply(_this, args);
            },
            drawOnce: function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i - 0] = arguments[_i];
                }
                return _this.drawOnce.apply(_this, args);
            },
            layerCount: 1,
            frameCount: 1,
            fileName: 'noname',
            layers: [],
            canvasWidth: 0,
            canvasHeight: 0,
            frames: [],
            selectedFrameNumber: 0,
            // user state
            scale: scale, grid: grid, colors: colors, selectedColorNumber: selectedColorNumber, selectedColor: selectedColor, colorSet: colorSet, gradations: gradations
        });
        this.commands['onG'] = function () { return _this.dispatch('canvas:grid:toggle'); };
        this.commands['onShiftG'] = function () { return _this.dispatch('canvas:outline:toggle'); };
        this.commands['onControlS'] = function () { return _this.dispatch('file:save'); };
        this.commands['onControlN'] = function () { return _this.dispatch('file:new'); };
        this.commands['onControlO'] = function () { return _this.dispatch('file:open'); };
        this.commands['onControlZ'] = function () { return _this.dispatch('work:undo'); };
        this.commands['onControlY'] = function () { return _this.dispatch('work:redo'); };
        this.commands['onControlShiftZ'] = function () { return _this.dispatch('work:redo'); };
        this.commands['onControlArrowUp'] = function () { return _this.dispatch('canvas:size', 1, 0, 0, 0); };
        this.commands['onControlArrowRight'] = function () { return _this.dispatch('canvas:size', 0, 1, 0, 0); };
        this.commands['onControlArrowDown'] = function () { return _this.dispatch('canvas:size', 0, 0, 1, 0); };
        this.commands['onControlArrowLeft'] = function () { return _this.dispatch('canvas:size', 0, 0, 0, 1); };
        this.commands['onControlShiftArrowUp'] = function () { return _this.dispatch('canvas:size', -1, 0, 0, 0); };
        this.commands['onControlShiftArrowRight'] = function () { return _this.dispatch('canvas:size', 0, -1, 0, 0); };
        this.commands['onControlShiftArrowDown'] = function () { return _this.dispatch('canvas:size', 0, 0, -1, 0); };
        this.commands['onControlShiftArrowLeft'] = function () { return _this.dispatch('canvas:size', 0, 0, 0, -1); };
        this.keyControl.hook = function (name, e) {
            _this.call(name, e)();
        };
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
    EditorContext.prototype.initializeConfiguration = function () {
        var _this = this;
        this.configuration = new configuration_1.default();
        if (this.configuration.read('initialized') !== this.version) {
            this.configuration.writeOnce({
                initialized: this.version,
                scale: 2,
                grid: true,
                colors: [argb_1.default.number(0xff000000), argb_1.default.number(0xffffffff)],
                selectedColorNumber: 0,
                selectedColor: argb_1.default.number(0xff000000),
                colorSet: new color_set_1.default(constants_1.nes),
                gradations: []
            });
        }
        var id = setInterval(function () {
            var _a = _this.state, scale = _a.scale, grid = _a.grid, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber, selectedColor = _a.selectedColor, colorSet = _a.colorSet, gradations = _a.gradations;
            _this.configuration.writeOnce({ scale: scale, grid: grid, colors: colors, selectedColorNumber: selectedColorNumber, selectedColor: selectedColor, colorSet: colorSet, gradations: gradations });
        }, 1000);
        this.intervals.push(id);
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
            'msImageSmoothingEnabled'
        ].forEach(function (n) { return context[n] = false; });
        this.stage = new createjs.Stage(canvas);
    };
    EditorContext.prototype.listen = function (to) {
        var _this = this;
        to('edit', 'color:switch', function (i) { return _this.selectFromTip(i); });
        to('edit', 'color:select', function (color) { return _this.selectColor(color); });
        to('edit', 'color:add', function (color) { return _this.addColor(color); });
        to('edit', 'color:delete', function (color) { return _this.deleteColor(color); });
        to('edit', 'color:arrange', function (argb) { return _this.arrangeColor(argb); });
        to('edit', 'gradation:add', function (color1, color2) { return _this.addGradation(color1, color2); });
        to('edit', 'gradation:delete', function (gradation) { return _this.deleteGradation(gradation); });
        to('edit', 'gradation:change:color1', function (gradation, color) { return _this.changeGradationColor('color1', gradation, color); });
        to('edit', 'gradation:change:color2', function (gradation, color) { return _this.changeGradationColor('color2', gradation, color); });
        to('edit', 'floater:select', function (callback) { return _this.selectColorFromFloater(callback); });
        to('edit', 'floater:rise', function (e, floatingCallback) { return _this.riseFloater(e, floatingCallback); });
        to('edit', 'canvas:mounted', function (canvas) { return _this.initializeStage(canvas); });
        to('edit', 'canvas:draw', function (x, y) { return _this.draw(x, y); });
        to('edit', 'canvas:draw:once', function (points) { return _this.drawOnce(points); });
        to('edit', 'canvas:resize', function (w, h) { return _this.setState({ canvasComponentWidth: w, canvasComponentHeight: h }); });
        to('edit', 'canvas:scale:plus', function (x, y) { return _this.scaleStep(+1, x, y); });
        to('edit', 'canvas:scale:minus', function (x, y) { return _this.scaleStep(-1, x, y); });
        to('edit', 'canvas:slide:start', function (x, y) { return _this.slide = _this.ie.startSlide(); });
        to('edit', 'canvas:slide', function (x, y) { return _this.slide(x, y); });
        to('edit', 'canvas:center', function () { return _this.center(); });
        to('edit', 'canvas:grid:toggle', function () { return _this.toggleGrid(); });
        to('edit', 'frame:select', function (n) { return _this.selectFrame(n); });
        to('edit', 'frame:next', function () { return _this.selectNextFrame(); });
        to('edit', 'frame:previous', function () { return _this.selectPreviousFrame(); });
        to('edit', 'frame:add', function () { return _this.addFrame(); });
        to('edit', 'frame:delete', function () { return _this.deleteFrame(); });
        to('edit', 'frame:move:backward', function () { return _this.moveFrameBackward(); });
        to('edit', 'frame:move:forward', function () { return _this.moveFrameForward(); });
        to('edit', 'file:save', function () { return _this.save(); });
        to('edit', 'file:open', function () { return _this.open(); });
        to('edit', 'file:new', function () { return _this.createBlankCanvasFromModal(React.createElement(canvas_setting_component_1.default, null)); });
        to('edit', 'file:new:complete', function (w, h, bg) { return _this.createBlankCanvas(w, h, bg); });
        to('edit', 'file:name', function (fileName) { return _this.setState({ fileName: fileName }); });
        to('edit', 'modal:rise', function (modalComponent, modalProps) { return _this.setState({ modalComponent: modalComponent, modalProps: modalProps }); });
        to('modal', 'modal:hide', function () { return _this.setState({ modalComponent: null, modalProps: null }); });
        to('modal', 'modal:canvas', function () { return null; });
    };
    return EditorContext;
}(mix_1.mix(parcel_1.Parcel).with(file_mixin_1.FileMixin, color_mixin_1.ColorMixin, gradation_mixin_1.GradationMixin, canvas_mixin_1.CanvasMixin, floater_mixin_1.FloaterMixin, frame_mixin_1.FrameMixin)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorContext;
//# sourceMappingURL=editor-context.js.map