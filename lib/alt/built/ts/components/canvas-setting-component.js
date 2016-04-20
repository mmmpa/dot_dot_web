"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require("react");
var CanvasSettingComponent = (function (_super) {
    __extends(CanvasSettingComponent, _super);
    function CanvasSettingComponent() {
        _super.apply(this, arguments);
    }
    CanvasSettingComponent.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        var _a = this.props, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, canvasBackgroundColor = _a.canvasBackgroundColor;
        this.setState({ canvasWidth: canvasWidth, canvasHeight: canvasHeight, canvasBackgroundColor: canvasBackgroundColor });
    };
    CanvasSettingComponent.prototype.render = function () {
        var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, canvasBackgroundColor = _a.canvasBackgroundColor;
        return React.createElement("div", {className: "canvas-setting"}, React.createElement("h1", null, "width"), React.createElement("input", {type: "text", value: canvasWidth}), React.createElement("h1", null, "height"), React.createElement("input", {type: "text", value: canvasHeight}));
    };
    return CanvasSettingComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasSettingComponent;
//# sourceMappingURL=canvas-setting-component.js.map