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
        var _a = this.props, width = _a.width, height = _a.height, bg = _a.bg;
        this.setState({ width: width, height: height, bg: bg });
    };
    CanvasSettingComponent.prototype.render = function () {
        var _this = this;
        var _a = this.state, width = _a.width, height = _a.height, bg = _a.bg;
        var onComplete = this.props.onComplete;
        ;
        return React.createElement("div", {className: "canvas-setting"}, React.createElement("h1", null, "width"), React.createElement("input", {type: "text", value: width, onChange: function (e) { return _this.setState({ width: +e.target.value }); }}), React.createElement("h1", null, "height"), React.createElement("input", {type: "text", value: height, onChange: function (e) { return _this.setState({ height: +e.target.value }); }}), React.createElement("button", {onClick: function () { return onComplete(width, height, bg); }}, "作成"));
    };
    return CanvasSettingComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasSettingComponent;
//# sourceMappingURL=canvas-setting-component.js.map