"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var argb_1 = require("../models/argb");
var key_control_1 = require("../models/key-control");
var color_set_1 = require("../models/color-set");
var constants_1 = require("../constants/constants");
var image_editor_1 = require("../models/image-editor");
var EditorContext = (function (_super) {
    __extends(EditorContext, _super);
    function EditorContext() {
        var _this = this;
        _super.apply(this, arguments);
        this.scaleNumbers = [1, 2, 4, 8, 16, 32, 64];
        this.commands = [];
        this.keyControl = new key_control_1.default(function (mode) { return mode !== _this.state.mode && _this.setState({ mode: mode }); });
    }
    EditorContext.prototype.componentWillMount = function () {
        var _this = this;
        _super.prototype.componentWillMount.call(this);
        this.setState({
            colors: [argb_1.default.number(0xff000000), argb_1.default.number(0xffffffff)],
            selectedColorNumber: 0,
            selectedColor: argb_1.default.number(0xff000000),
            scale: 1,
            grid: true,
            keyControl: this.keyControl,
            mode: null,
            colorSet: new color_set_1.default([argb_1.default.number(0xffff0000), argb_1.default.number(0xff00ff00), argb_1.default.number(0xff0000ff)]),
            floatingColorPaletteMode: null,
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
            }
        });
        this.commands['onControlS'] = function () { return _this.save(); };
        this.commands['onControlN'] = function () { return _this.create(); };
        this.commands['onControlO'] = function () { return _this.open(); };
        this.commands['onG'] = function () { return _this.toggleGrid(); };
        this.keyControl.hook = function (name, e) {
            _this.call(name, e)();
        };
    };
    EditorContext.prototype.componentDidUpdate = function (_, state) {
        if (!state.canvasWidth && this.state.canvasWidth) {
            this.center();
        }
        if (state.grid !== this.state.grid) {
            this.ie.switchGrid(this.state.grid);
        }
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
    EditorContext.prototype.arrangeColor = function (_a) {
        var a = _a.a, r = _a.r, g = _a.g, b = _a.b;
        //console.log(argb)
        var selectedColorNumber = this.state.selectedColorNumber;
        var colors = this.state.colors.concat();
        var selectedColor = new argb_1.default(a, r, g, b);
        colors[selectedColorNumber] = selectedColor;
        this.setState({ colors: colors, selectedColor: selectedColor });
    };
    EditorContext.prototype.selectColor = function (selectedColor) {
        var _a = this.state, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber;
        colors = colors.concat();
        colors[selectedColorNumber] = selectedColor;
        this.setState({ colors: colors, selectedColor: selectedColor });
    };
    EditorContext.prototype.riseFloater = function (e, floatingColorPaletteMode) {
        var floatingFrom = e.currentTarget;
        this.setState({ floatingColorPaletteMode: floatingColorPaletteMode, floatingFrom: floatingFrom });
    };
    EditorContext.prototype.selectColorFromFloater = function (selectedColor, index) {
        this.detectFloatingAction()(selectedColor, index);
        this.setState({ floatingColorPaletteMode: null });
    };
    EditorContext.prototype.detectFloatingAction = function () {
        switch (this.state.floatingColorPaletteMode) {
            case constants_1.FloatingColorPaletteMode.Delete:
                return this.deleteColor.bind(this);
        }
    };
    EditorContext.prototype.addColor = function () {
        var _a = this.state, colorSet = _a.colorSet, selectedColor = _a.selectedColor;
        colorSet.add(selectedColor);
        this.setState({ colorSet: colorSet });
    };
    EditorContext.prototype.deleteColor = function (color) {
        var colorSet = this.state.colorSet;
        colorSet.remove(color);
        this.setState({ colorSet: colorSet });
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
        this.create();
    };
    EditorContext.prototype.draw = function (x, y) {
        this.ie.setPixel(x, y, this.state.selectedColor.number, true);
    };
    EditorContext.prototype.drawOnce = function (points) {
        var _this = this;
        points.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.ie.setPixel(x, y, _this.state.selectedColor.number);
        });
        this.ie.update();
    };
    EditorContext.prototype.scaleStep = function (direction, x, y) {
        var scale = this.state.scale;
        scale += direction;
        if (scale < 0) {
            scale = 0;
        }
        else if (scale >= this.scaleNumbers.length) {
            scale = this.scaleNumbers.length - 1;
        }
        this.scale(scale, x, y);
        this.setState({ scale: scale });
    };
    EditorContext.prototype.scale = function (scale, x, y) {
        this.ie.scale(this.scaleNumbers[scale || this.state.scale], x, y);
        if (!x && !y) {
            this.center();
        }
    };
    EditorContext.prototype.center = function () {
        var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        return this.ie.center(parseInt(canvasWidth), parseInt(canvasHeight));
    };
    EditorContext.prototype.save = function () {
        var name = 'test';
        $('<a>')
            .attr("href", this.ie.exportPng())
            .attr("download", "file-" + name)
            .trigger('click');
    };
    EditorContext.prototype.open = function () {
        var _this = this;
        var $fileListener = $('<input type="file"/>');
        var $img = $('<img/>');
        var $canvas = $('<canvas/>');
        var canvas = $canvas.get(0);
        var context = canvas.getContext("2d");
        $fileListener.on('change', function (e) {
            var file = e.path[0].files[0];
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                var image = new Image();
                image.addEventListener('load', function (e) {
                    canvas.width = e.target.width / 2;
                    canvas.height = e.target.height / 2;
                    context.drawImage(e.target, 0, 0, canvas.width, canvas.height);
                    $img.prop('src', canvas.toDataURL());
                    _this.create($img.get(0));
                });
                image.src = e.target.result;
            });
            reader.readAsDataURL(file);
        });
        $fileListener.trigger('click');
    };
    EditorContext.prototype.create = function (imageElement) {
        this.ie && this.ie.close();
        if (imageElement) {
            this.ie = image_editor_1.default.create(this.stage, 0, 0, imageElement);
        }
        else {
            this.ie = image_editor_1.default.create(this.stage, 50, 50);
        }
        this.scale();
        this.ie.switchGrid(this.state.grid);
        this.setState({ ie: this.ie });
    };
    EditorContext.prototype.toggleGrid = function () {
        this.setState({ grid: !this.state.grid });
    };
    EditorContext.prototype.listen = function (to) {
        var _this = this;
        to('color:switch', function (selectedColorNumber) { return _this.setState({ selectedColorNumber: selectedColorNumber, selectedColor: _this.state.colors[selectedColorNumber] }); });
        to('color:select', function (color) { return _this.selectColor(color); });
        to('color:add', function () { return _this.addColor(); });
        to('color:arrange', function (argb) { return _this.arrangeColor(argb); });
        to('floater:select', function (color) { return _this.selectColorFromFloater(color); });
        to('floater:rise', function (e, mode) { return _this.riseFloater(e, mode); });
        to('canvas:mounted', function (canvas) { return _this.initializeStage(canvas); });
        to('canvas:draw', function (x, y) { return _this.draw(x, y); });
        to('canvas:draw:once', function (points) { return _this.drawOnce(points); });
        to('canvas:resize', function (canvasWidth, canvasHeight) { return _this.setState({ canvasWidth: canvasWidth, canvasHeight: canvasHeight }); });
        to('canvas:scale:plus', function (x, y) { return _this.scaleStep(+1, x, y); });
        to('canvas:scale:minus', function (x, y) { return _this.scaleStep(-1, x, y); });
        to('canvas:slide:start', function (x, y) { return _this.slide = _this.ie.startSlide(); });
        to('canvas:slide', function (x, y) { return _this.slide(x, y); });
        to('canvas:center', function () { return _this.center(); });
        to('canvas:grid:toggle', function () { return _this.toggleGrid(); });
        to('file:save', function () { return _this.save(); });
        to('file:open', function () { return _this.open(); });
        to('file:new', function () { return _this.create(); });
    };
    return EditorContext;
}(parcel_1.Parcel));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorContext;
//# sourceMappingURL=editor-context.js.map