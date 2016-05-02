"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var cell_component_1 = require("./cell-component");
var CanvasComponent = (function (_super) {
    __extends(CanvasComponent, _super);
    function CanvasComponent() {
        _super.apply(this, arguments);
    }
    CanvasComponent.prototype.componentWillMount = function () {
        var _a = this.layoutStyle, width = _a.width, height = _a.height;
        this.setState({ width: width, height: height });
    };
    CanvasComponent.prototype.componentDidMount = function () {
        var _this = this;
        _super.prototype.componentDidMount.call(this);
        var _a = this.layoutStyle, width = _a.width, height = _a.height;
        this.dispatch('component:canvas:resize', parseInt(width), parseInt(height));
        this.dispatch('component:canvas:mounted', this.refs['canvas']);
        this.initializeCommand();
        this.refs['container'].addEventListener('mousewheel', this.onMouseWheel.bind(this));
        $(this.refs['container']).on('dblclick', function (e) { return _this.call('onDoubleClick')(e); });
    };
    CanvasComponent.prototype.initializeCommand = function () {
        var _this = this;
        this.commands['onMouseDownRight'] = function (x, y) { return _this.onPressRight(x, y); };
        this.commands['onMouseDown'] = function (x, y) { return _this.onPress(x, y); };
        this.commands['onMouseWheel'] = function (x, y, deltaX, deltaY) { return _this.onWheel(x, y, deltaY); };
        this.commands['onDoubleClick'] = function (x, y) { return _this.onPressDouble(x, y); };
    };
    CanvasComponent.prototype.componentWillReceiveProps = function (props) {
        var _a = this.pickLayout(props), width = _a.width, height = _a.height;
        if (this.state.width !== width || this.state.height !== height) {
            this.setState({ width: width, height: height });
            this.dispatch('component:canvas:resize', parseInt(width), parseInt(height));
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
    Object.defineProperty(CanvasComponent.prototype, "canvas", {
        get: function () {
            return this.refs['canvas'];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasComponent.prototype, "commands", {
        get: function () {
            return this.props.commands;
        },
        enumerable: true,
        configurable: true
    });
    CanvasComponent.prototype.onMouseWheel = function (e) {
        e.preventDefault();
        var _a = this.mousePosition(e), x = _a.x, y = _a.y;
        this.call('onMouseWheel')(x, y, e.deltaX, e.deltaY);
    };
    CanvasComponent.prototype.onMouseDown = function (e, isRight) {
        if (isRight === void 0) { isRight = false; }
        e.preventDefault();
        var _a = this.mousePosition(e), x = _a.x, y = _a.y;
        isRight ? this.call('onMouseDownRight')(x, y) : this.call('onMouseDown')(x, y);
    };
    CanvasComponent.prototype.onPress = function (x, y) {
        this.dispatch('canvas:press', x, y);
        this.startDragCanvas(x, y);
    };
    CanvasComponent.prototype.onPressRight = function (x, y) {
        this.dispatch('canvas:press:right', x, y);
        this.startDragCanvas(x, y, true);
    };
    CanvasComponent.prototype.onPressDouble = function (x, y) {
        this.dispatch('canvas:press:double', x, y);
    };
    CanvasComponent.prototype.startDragCanvas = function (startX, startY, isRight) {
        var _this = this;
        if (isRight === void 0) { isRight = false; }
        var pre = { x: startX, y: startY };
        var move = function (e) {
            var _a = _this.mousePosition(e), x = _a.x, y = _a.y;
            if (isRight) {
                _this.dispatch('canvas:drag:right', startX, startY, pre.x, pre.y, x, y);
            }
            else {
                _this.dispatch('canvas:drag', startX, startY, pre.x, pre.y, x, y);
            }
            pre = { x: x, y: y };
        };
        $(window).on('mousemove', move);
        $(window).on('mouseup', function () {
            $(window).off('mousemove', move);
        });
    };
    CanvasComponent.prototype.mousePosition = function (e) {
        var x = e.pageX - this.canvas.offsetLeft;
        var y = e.pageY - this.canvas.offsetTop;
        return { x: x, y: y };
    };
    CanvasComponent.prototype.onWheel = function (x, y, direction) {
        if (direction < 0) {
            this.dispatch('canvas:wheel:up', x, y);
        }
        else {
            this.dispatch('canvas:wheel:down', x, y);
        }
    };
    CanvasComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {style: this.layoutStyle, className: "cell canvas", ref: "container"}, React.createElement("canvas", {width: "2000", height: "2000", ref: "canvas", onMouseDown: function (e) { return _this.onMouseDown(e); }, onContextMenu: function (e) { return _this.onMouseDown(e, true); }}, "canvas"), React.createElement("div", {className: "controller"}, React.createElement("div", {className: "scale"}, this.props.scale * 100 + '%'), React.createElement("div", {className: "selection"}, React.createElement("label", null, React.createElement("input", {type: "checkbox", checked: this.props.selectionHidden, onChange: function (e) { return _this.dispatch('canvas:select:hidden', e.target.checked); }}), "選択範囲を非表示にする")), React.createElement("div", {className: "message"}, this.props.message)));
    };
    return CanvasComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasComponent;
//# sourceMappingURL=canvas-component.js.map