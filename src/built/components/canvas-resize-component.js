"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require('../libs/parcel');
var React = require('react');
var CanvasSettingComponent = (function (_super) {
    __extends(CanvasSettingComponent, _super);
    function CanvasSettingComponent() {
        _super.apply(this, arguments);
    }
    CanvasSettingComponent.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        var _a = this.props, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight;
        this.setState({
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            canvasWidth: canvasWidth,
            canvasHeight: canvasHeight,
            message: '',
        });
    };
    CanvasSettingComponent.prototype.check = function () {
        var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
        if (canvasWidth + left + right < 1 || canvasHeight + top + bottom < 1) {
            return this.setState({ message: 'invalid' });
        }
        this.props.onComplete(top, right, bottom, left);
    };
    CanvasSettingComponent.prototype.writeMessage = function () {
        var message = this.state.message;
        if (message.length === 0) {
            return null;
        }
        return React.createElement("p", {className: "message"}, message);
    };
    CanvasSettingComponent.prototype.render = function () {
        var _this = this;
        var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, top = _a.top, left = _a.left, right = _a.right, bottom = _a.bottom;
        var _b = this.props, onComplete = _b.onComplete, onCancel = _b.onCancel;
        return React.createElement("div", {className: "canvas-resize modal-window"}, React.createElement("header", {className: "modal-header"}, "New"), React.createElement("section", {className: "params"}, React.createElement("h1", null, "Top"), React.createElement("div", null, React.createElement("input", {type: "number", step: "1", value: top, onChange: function (e) { return _this.setState({ top: +e.target.value }); }}))), React.createElement("section", {className: "params side"}, React.createElement("h1", null, "Left"), React.createElement("div", null, React.createElement("input", {type: "number", step: "1", value: left, onChange: function (e) { return _this.setState({ left: +e.target.value }); }}))), React.createElement("section", {className: "params side"}, React.createElement("div", null, React.createElement("input", {type: "number", step: "1", value: right, onChange: function (e) { return _this.setState({ right: +e.target.value }); }})), React.createElement("h1", null, "Right")), React.createElement("section", {className: "params"}, React.createElement("div", null, React.createElement("input", {type: "number", step: "1", value: bottom, onChange: function (e) { return _this.setState({ bottom: +e.target.value }); }})), React.createElement("h1", null, "Bottom")), React.createElement("div", {className: "result"}, React.createElement("section", null, React.createElement("h1", null, "Width : Height"), React.createElement("div", null, canvasWidth + left + right, "px : ", canvasHeight + top + bottom, "px"), this.writeMessage())), React.createElement("div", {className: "buttons"}, React.createElement("button", {className: "complete-button", onClick: function () { return _this.check(); }}, "Resize"), React.createElement("button", {className: "cancel-button", onClick: function () { return onCancel(); }}, "Cancel")));
    };
    return CanvasSettingComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasSettingComponent;
//# sourceMappingURL=canvas-resize-component.js.map