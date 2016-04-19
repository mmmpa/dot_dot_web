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
var file_information_1 = require("../models/file-information");
var configuration_1 = require("../records/configuration");
var layered_image_1 = require("../models/layered-image");
var data_url_generator_1 = require("../models/data-url-generator");
var gradation_color_1 = require("../models/gradation-color");
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
            frames: [new layered_image_1.default(10, 10, [this.gen.blankDataUrl(10, 10)])],
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
        this.dispatch('frame:select', 0);
    };
    EditorContext.prototype.componentWillUnmount = function () {
        _super.prototype.componentWillUnmount.call(this);
        this.intervals.forEach(function (id) { return clearInterval(id); });
    };
    EditorContext.prototype.componentDidUpdate = function (_, state) {
        if (!state.canvasWidth && this.state.canvasWidth) {
            this.center();
        }
        if (state.grid !== this.state.grid) {
            this.ie.switchGrid(this.state.grid);
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
    EditorContext.prototype.arrangeColor = function (_a) {
        var a = _a.a, r = _a.r, g = _a.g, b = _a.b;
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
    EditorContext.prototype.riseFloater = function (e, floatingCallback) {
        var floatingFrom = e.currentTarget;
        this.setState({ floatingCallback: floatingCallback, floatingFrom: floatingFrom });
    };
    EditorContext.prototype.selectColorFromFloater = function (callback) {
        callback();
        this.setState({ floatingCallback: null, floatingFrom: null });
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
    };
    EditorContext.prototype.draw = function (x, y) {
        this.ie.setPixel(x, y, this.state.selectedColor.number, true);
        this.updateFrame();
    };
    EditorContext.prototype.drawOnce = function (points) {
        var _this = this;
        points.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.ie.setPixel(x, y, _this.state.selectedColor.number);
        });
        this.ie.update();
        this.updateFrame();
    };
    EditorContext.prototype.updateFrame = function () {
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        frames[selectedFrameNumber].update(0, this.ie.exportPng());
        this.setState({});
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
    Object.defineProperty(EditorContext.prototype, "fileName", {
        get: function () {
            var _a = this.state, fileName = _a.fileName, layerCount = _a.layerCount, frameCount = _a.frameCount;
            return fileName + "_" + new Date().getTime() + "." + layerCount + "." + frameCount + ".png";
        },
        enumerable: true,
        configurable: true
    });
    EditorContext.prototype.center = function () {
        var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        return this.ie.center(parseInt(canvasWidth), parseInt(canvasHeight));
    };
    EditorContext.prototype.save = function () {
        $('<a>')
            .attr("href", this.ie.exportPng())
            .attr("download", this.fileName)
            .trigger('click');
    };
    EditorContext.prototype.open = function () {
        var _this = this;
        var $fileListener = $('<input type="file"/>');
        $fileListener.on('change', function (e) {
            var file = e.path[0].files[0];
            var information = _this.parseFileName(file.name);
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                var img = new Image();
                img.addEventListener('load', function (e) {
                    var _a = e.target, width = _a.width, height = _a.height;
                    var baseWidth = width / information.frameCount;
                    var baseHeight = height / information.layerCount;
                    var trimmer = _this.gen.trimmer(e.target, baseWidth, baseHeight);
                    var frames = _.times(information.frameCount, function (n) {
                        // レイヤー分割処理を入れる。
                        return new layered_image_1.default(baseWidth, baseHeight, [trimmer(baseWidth * n, 0)]);
                    });
                    _this.setState({ frames: frames }, function () { return _this.dispatch('frame:select', 0); });
                });
                img.src = e.target.result;
            });
            reader.readAsDataURL(file);
        });
        $fileListener.trigger('click');
    };
    EditorContext.prototype.parseFileName = function (fileName) {
        return file_information_1.default.parseFileName(fileName);
    };
    EditorContext.prototype.selectFrame = function (selectedFrameNumber) {
        this.create(this.state.frames[selectedFrameNumber].image(0));
        this.setState({ selectedFrameNumber: selectedFrameNumber });
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
    EditorContext.prototype.addGradation = function () {
        var _a = this.state.colors, color1 = _a[0], color2 = _a[1];
        this.state.gradations.push(new gradation_color_1.default(color1, color2));
        this.setState({});
    };
    EditorContext.prototype.listen = function (to) {
        var _this = this;
        to('edit', 'color:switch', function (selectedColorNumber) { return _this.setState({ selectedColorNumber: selectedColorNumber, selectedColor: _this.state.colors[selectedColorNumber] }); });
        to('edit', 'color:select', function (color) { return _this.selectColor(color); });
        to('edit', 'color:add', function () { return _this.addColor(); });
        to('edit', 'color:arrange', function (argb) { return _this.arrangeColor(argb); });
        to('edit', 'gradation:add', function () { return _this.addGradation(); });
        to('edit', 'floater:select', function (callback) { return _this.selectColorFromFloater(callback); });
        to('edit', 'floater:rise', function (e, floatingCallback) { return _this.riseFloater(e, floatingCallback); });
        to('edit', 'canvas:mounted', function (canvas) { return _this.initializeStage(canvas); });
        to('edit', 'canvas:draw', function (x, y) { return _this.draw(x, y); });
        to('edit', 'canvas:draw:once', function (points) { return _this.drawOnce(points); });
        to('edit', 'canvas:resize', function (canvasWidth, canvasHeight) { return _this.setState({ canvasWidth: canvasWidth, canvasHeight: canvasHeight }); });
        to('edit', 'canvas:scale:plus', function (x, y) { return _this.scaleStep(+1, x, y); });
        to('edit', 'canvas:scale:minus', function (x, y) { return _this.scaleStep(-1, x, y); });
        to('edit', 'canvas:slide:start', function (x, y) { return _this.slide = _this.ie.startSlide(); });
        to('edit', 'canvas:slide', function (x, y) { return _this.slide(x, y); });
        to('edit', 'canvas:center', function () { return _this.center(); });
        to('edit', 'canvas:grid:toggle', function () { return _this.toggleGrid(); });
        to('edit', 'frame:select', function (n) { return _this.selectFrame(n); });
        to('edit', 'file:save', function () { return _this.save(); });
        to('edit', 'file:open', function () { return _this.open(); });
        to('edit', 'file:new', function () { return _this.create(); });
    };
    return EditorContext;
}(parcel_1.Parcel));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorContext;
//# sourceMappingURL=editor-context.js.map