"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
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
        var _a = this.layoutStyle, width = _a.width, height = _a.height;
        this.dispatch('canvas:resize', parseInt(width), parseInt(height));
        this.dispatch('canvas:mounted', this.refs['canvas']);
        this.initializeCommand();
        this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));
        $(this.refs['container']).on('dblclick', function (e) { return _this.call('onDoubleClick')(e); });
    };
    CanvasComponent.prototype.initializeCommand = function () {
        var _this = this;
        this.commands['onMouseDown'] = this.draw.bind(this);
        this.commands['onMouseWheel'] = function (x, y) { return y > 0 ? _this.scaleStep(-1) : _this.scaleStep(1); };
        this.commands['onDoubleClick'] = this.drawDouble.bind(this);
    };
    Object.defineProperty(CanvasComponent.prototype, "commands", {
        get: function () {
            return this.props.commands;
        },
        enumerable: true,
        configurable: true
    });
    CanvasComponent.prototype.draw = function (x, y) {
        switch (this.props.mode) {
            case 'slide':
                return this.startSlide(x, y);
            default:
                return this.startDraw(x, y);
        }
    };
    CanvasComponent.prototype.drawDouble = function (x, y) {
        switch (this.props.mode) {
            case 'slide':
                return this.dispatch('canvas:center');
            default:
                return null;
        }
    };
    CanvasComponent.prototype.startDraw = function (startX, startY) {
        var _this = this;
        //this.dispatch('canvas:draw', startX, startY);
        this.props.draw(startX, startY);
        //let pre = {x: startX, y: startY};
        var move = function (e) {
            var _a = _this.mousePosition(e), x = _a.x, y = _a.y;
            _this.props.draw(x, y);
            /*
             let {x, y} = this.mousePosition(e);
             this.dispatch('canvas:draw', x, y);
             let {x, y} = this.mousePosition(e);
             let points = [{x, y}];
             if (Math.abs(x - pre.x) > 1 || Math.abs(y - pre.y) > 1) {
             let moveX = x - pre.x;
             let moveY = y - pre.y;
             let power = moveY / moveX;
             if (moveX > 0) {
             for (let i = moveX; i--;) {
             points.push({x: x - i, y: y - i * power});
             }
             } else {
             for (let i = moveX; i++;) {
             points.push({x: x - i, y: y - i * power});
             }
             }
             }
             this.dispatch('canvas:draw:once', points);
             pre = {x, y}
             */
        };
        $(window).on('mousemove', move);
        $(window).on('mouseup', function () {
            $(window).off('mousemove', move);
        });
    };
    CanvasComponent.prototype.startSlide = function (startX, startY) {
        var _this = this;
        this.dispatch('canvas:slide:start', startX, startY);
        var move = function (e) {
            var _a = _this.mousePosition(e), x = _a.x, y = _a.y;
            _this.dispatch('canvas:slide', x - startX, y - startY);
        };
        $(window).on('mousemove', move);
        $(window).on('mouseup', function () {
            $(window).off('mousemove', move);
        });
    };
    CanvasComponent.prototype.scaleStep = function (direction) {
        if (direction > 0) {
            this.dispatch('canvas:scale:plus', this.nowX, this.nowY);
        }
        else {
            this.dispatch('canvas:scale:minus', this.nowX, this.nowY);
        }
    };
    CanvasComponent.prototype.call = function (name) {
        return this.commands[name] || (function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            return null;
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
    Object.defineProperty(CanvasComponent.prototype, "canvas", {
        get: function () {
            return this.refs['canvas'];
        },
        enumerable: true,
        configurable: true
    });
    CanvasComponent.prototype.mousePosition = function (e) {
        var x = e.pageX - this.canvas.offsetLeft;
        var y = e.pageY - this.canvas.offsetTop;
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