"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var image_editor_1 = require("../models/image-editor");
var cell_component_1 = require("./cell-component");
var CanvasState;
(function (CanvasState) {
    CanvasState[CanvasState["Starting"] = 0] = "Starting";
    CanvasState[CanvasState["Started"] = 1] = "Started";
})(CanvasState || (CanvasState = {}));
var CanvasComponent = (function (_super) {
    __extends(CanvasComponent, _super);
    function CanvasComponent() {
        _super.apply(this, arguments);
        this.commands = {};
    }
    CanvasComponent.prototype.componentWillMount = function () {
        this.setState({
            src: this.props.src || null
        });
    };
    CanvasComponent.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.initializeCanvas();
        this.initializeCommand();
        this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));
        if (!this.state.src) {
            this.ie = image_editor_1.default.create(this.stage, 1000, 1000);
            this.ie.once(function (wrapper, s) {
                wrapper(s.setPixel(1, 1, 0xff0000ff), s.setPixel(2, 1, 0xff0000ff), s.setPixel(1, 2, 0xff0000ff), s.setPixel(2, 2, 0xff0000ff));
            });
        }
    };
    CanvasComponent.prototype.initializeCanvas = function () {
        var canvas = this.refs['canvas'];
        var context = canvas.getContext('2d');
        [
            'imageSmoothingEnabled',
            'mozImageSmoothingEnabled',
            'oImageSmoothingEnabled',
            'msImageSmoothingEnabled'
        ].forEach(function (n) { return context[n] = false; });
        this.stage = new createjs.Stage(canvas);
    };
    CanvasComponent.prototype.initializeCommand = function () {
        var _this = this;
        this.commands['onMouseDown'] = this.draw.bind(this);
        this.commands['onMouseWheel'] = function (x, y) { return y > 0 ? _this.scaleStep(-1) : _this.scaleStep(1); };
    };
    CanvasComponent.prototype.bitmapData = function () {
    };
    CanvasComponent.prototype.draw = function (x, y) {
        this.ie.setPixel(x, y, 0xff0000ff, true);
    };
    CanvasComponent.prototype.scaleStep = function (direction) {
        this.ie.scaleStep(direction);
    };
    CanvasComponent.prototype.call = function (name) {
        return this.commands[name] || (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return console.log.apply(console, ['未設定'].concat(args));
        });
    };
    CanvasComponent.prototype.onMouseWheel = function (e) {
        e.preventDefault();
        this.call('onMouseWheel')(e.deltaX, e.deltaY);
    };
    CanvasComponent.prototype.onMouseDown = function (e) {
        e.preventDefault();
        var x = e.pageX - this.refs['canvas'].offsetLeft;
        var y = e.pageY - this.refs['canvas'].offsetTop;
        this.call('onMouseDown')(x, y);
    };
    CanvasComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {style: this.layoutStyle, className: "cell canvas", ref: "container"}, React.createElement("canvas", {height: "1000", width: "1000", ref: "canvas", onMouseDown: function (e) { return _this.onMouseDown(e); }}, "canvas"));
    };
    return CanvasComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasComponent;
/*

 // 読み込み
 new createjs.BitmapData(HTMLImageElement)

 // 新規作成
 new createjs.BitmapData(null, 100, 100, 0xffff0000)

 * */ 
//# sourceMappingURL=canvas-component.js.map