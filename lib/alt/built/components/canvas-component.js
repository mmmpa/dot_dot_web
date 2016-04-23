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
        this.commands['onMouseDownRight'] = function (x, y) { return _this.onPressRight(x, y); };
        this.commands['onMouseDown'] = function (x, y) { return _this.onPress(x, y); };
        this.commands['onMouseWheel'] = function (x, y) { return y > 0 ? _this.scaleStep(-1) : _this.scaleStep(1); };
        this.commands['onDoubleClick'] = function (x, y) { return _this.onPressDouble(x, y); };
    };
    Object.defineProperty(CanvasComponent.prototype, "commands", {
        get: function () {
            return this.props.commands;
        },
        enumerable: true,
        configurable: true
    });
    CanvasComponent.prototype.onPress = function (x, y) {
        this.dispatch('canvas:press', this.canvas, x, y);
    };
    CanvasComponent.prototype.onPressRight = function (x, y) {
        this.dispatch('canvas:press:right', this.canvas, x, y);
    };
    CanvasComponent.prototype.onPressDouble = function (x, y) {
        this.dispatch('canvas:press:double', this.canvas, x, y);
    };
    CanvasComponent.prototype.draw = function (x, y) {
        switch (this.props.mode) {
            case 'slide':
                return this.startSlide(x, y);
            case 'select':
                return this.startSelect(x, y);
            default:
                return this.startDraw(x, y, this.leftColor);
        }
    };
    CanvasComponent.prototype.drawRight = function (x, y) {
        this.startDraw(x, y, this.rightColor);
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
    CanvasComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {style: this.layoutStyle, className: "cell canvas", ref: "container"}, React.createElement("canvas", {width: "2000", height: "2000", ref: "canvas", onMouseDown: function (e) { return _this.onMouseDown(e); }, onContextMenu: function (e) { return _this.onMouseDown(e, true); }}, "canvas"), React.createElement("div", {className: "controller"}, React.createElement("div", {className: "scale"}, this.props.scale * 100 + '%'), React.createElement("div", {className: "selection"}, React.createElement("label", null, React.createElement("input", {type: "checkbox", checked: this.props.selectionHidden, onChange: function (e) { return _this.dispatch('canvas:select:hidden', e.target.checked); }}), "選択範囲を非表示にする")), React.createElement("div", {className: "message"}, this.props.message)));
    };
    return CanvasComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasComponent;
//# sourceMappingURL=canvas-component.js.map