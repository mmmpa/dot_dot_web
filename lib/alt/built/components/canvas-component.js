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
        this.commands['onMouseDownRight'] = this.drawRight.bind(this);
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
    Object.defineProperty(CanvasComponent.prototype, "leftColor", {
        get: function () {
            var _a = this.props, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber;
            return colors[selectedColorNumber];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasComponent.prototype, "rightColor", {
        get: function () {
            var _a = this.props, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber;
            return colors[selectedColorNumber ^ 1];
        },
        enumerable: true,
        configurable: true
    });
    CanvasComponent.prototype.draw = function (x, y) {
        switch (this.props.mode) {
            case 'slide':
                return this.startSlide(x, y);
            default:
                return this.startDraw(x, y, this.leftColor);
        }
    };
    CanvasComponent.prototype.drawRight = function (x, y) {
        this.startDraw(x, y, this.rightColor);
    };
    CanvasComponent.prototype.drawDouble = function (x, y) {
        switch (this.props.mode) {
            case 'slide':
                return this.dispatch('canvas:center');
            default:
                return null;
        }
    };
    CanvasComponent.prototype.startDraw = function (startX, startY, color) {
        var _this = this;
        //this.dispatch('canvas:draw', startX, startY);
        this.props.draw(startX, startY, color);
        var pre = { x: startX, y: startY };
        var move = function (e) {
            //let {x, y} = this.mousePosition(e);
            //this.props.draw(x, y, color);
            var _a = _this.mousePosition(e), x = _a.x, y = _a.y;
            var points = [{ x: x, y: y }];
            if (Math.abs(x - pre.x) > 1 || Math.abs(y - pre.y) > 1) {
                var moveX = x - pre.x;
                var moveY = y - pre.y;
                var power = moveY / moveX;
                if (moveX > 0) {
                    for (var i = moveX; i--;) {
                        points.push({ x: x - i, y: y - i * power });
                    }
                }
                else if (moveX < 0) {
                    for (var i = moveX; i++;) {
                        points.push({ x: x - i, y: y - i * power });
                    }
                }
                if (moveY > 0) {
                    for (var i = moveY; i--;) {
                        points.push({ x: x - i / power, y: y - i });
                    }
                }
                else if (moveY < 0) {
                    for (var i = moveY; i++;) {
                        points.push({ x: x - i / power, y: y - i });
                    }
                }
            }
            _this.dispatch('canvas:draw:once', points, color);
            pre = { x: x, y: y };
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
    CanvasComponent.prototype.onMouseDown = function (e, isRight) {
        if (isRight === void 0) { isRight = false; }
        e.preventDefault();
        var _a = this.mousePosition(e), x = _a.x, y = _a.y;
        console.log(e, isRight);
        isRight ? this.call('onMouseDownRight')(x, y) : this.call('onMouseDown')(x, y);
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
        return React.createElement("div", {style: this.layoutStyle, className: "cell canvas", ref: "container"}, React.createElement("canvas", {width: "2000", height: "2000", ref: "canvas", onMouseDown: function (e) { return _this.onMouseDown(e); }, onContextMenu: function (e) { return _this.onMouseDown(e, true); }}, "canvas"));
    };
    return CanvasComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasComponent;
//# sourceMappingURL=canvas-component.js.map