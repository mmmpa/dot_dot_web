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
        this.scaleNumbers = [1, 2, 4, 8, 16, 32, 64];
        this.commands = {};
    }
    CanvasComponent.prototype.componentWillMount = function () {
        var _this = this;
        this.setState({
            src: this.props.src || null,
            width: 1000,
            height: 1000
        });
        $(window).on('mousemove', function (e) { return _this.recordPosition(e); });
    };
    CanvasComponent.prototype.recordPosition = function (e) {
        var _a = this.mousePosition(e), x = _a.x, y = _a.y;
        this.nowX = x;
        this.nowY = y;
    };
    CanvasComponent.prototype.componentDidMount = function () {
        var _this = this;
        _super.prototype.componentDidMount.call(this);
        this.initializeCanvas();
        this.initializeCommand();
        this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));
        $(this.refs['container']).on('dblclick', function (e) { return _this.call('onDoubleClick')(e); });
        if (!this.state.src) {
            this.ie = image_editor_1.default.create(this.stage, 100, 100);
        }
        this.refreshCanvas(this.props);
    };
    CanvasComponent.prototype.componentWillReceiveProps = function (props) {
        this.refreshCanvas(props, this.props);
    };
    CanvasComponent.prototype.refreshCanvas = function (props, oldProps) {
        var scale = props.scale, grid = props.grid;
        if (!oldProps || oldProps.scale !== scale) {
            this.ie.scale(this.scaleNumbers[scale], this.nowX, this.nowY);
        }
        if (!oldProps || oldProps.grid !== grid) {
            this.ie.switchGrid(grid);
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
        this.commands['onDoubleClick'] = this.drawDouble.bind(this);
    };
    CanvasComponent.prototype.bitmapData = function () {
    };
    CanvasComponent.prototype.draw = function (x, y) {
        switch (this.props.mode) {
            case 'slide':
                return this.startSlide(x, y);
            default:
                return this.ie.setPixel(x, y, this.props.selectedColor.number, true);
        }
    };
    CanvasComponent.prototype.drawDouble = function (x, y) {
        switch (this.props.mode) {
            case 'slide':
                var _a = this.layoutStyle, width = _a.width, height = _a.height;
                return this.ie.center(parseInt(width), parseInt(height));
            default:
                return null;
        }
    };
    CanvasComponent.prototype.startSlide = function (startX, startY) {
        var _this = this;
        var slide = this.ie.startSlide();
        var move = function (e) {
            var _a = _this.mousePosition(e), x = _a.x, y = _a.y;
            slide(x - startX, y - startY);
        };
        $(window).on('mousemove', move);
        $(window).on('mouseup', function () {
            $(window).off('mousemove', move);
        });
    };
    CanvasComponent.prototype.scaleStep = function (direction) {
        var scale = this.props.scale;
        scale += direction;
        if (scale < 0) {
            scale = 0;
        }
        else if (scale >= this.scaleNumbers.length) {
            scale = this.scaleNumbers.length - 1;
        }
        this.dispatch('canvas:scale', scale);
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
        var _a = this.mousePosition(e), x = _a.x, y = _a.y;
        this.call('onMouseWheel')(e.deltaX, e.deltaY);
    };
    CanvasComponent.prototype.onMouseDown = function (e) {
        e.preventDefault();
        var _a = this.mousePosition(e), x = _a.x, y = _a.y;
        this.call('onMouseDown')(x, y);
    };
    CanvasComponent.prototype.mousePosition = function (e) {
        var x = e.pageX - this.refs['canvas'].offsetLeft;
        var y = e.pageY - this.refs['canvas'].offsetTop;
        return { x: x, y: y };
    };
    CanvasComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {style: this.layoutStyle, className: "cell canvas", ref: "container"}, React.createElement("canvas", {width: "2000", height: "2000", ref: "canvas", onMouseDown: function (e) { return _this.onMouseDown(e); }}, "canvas"));
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