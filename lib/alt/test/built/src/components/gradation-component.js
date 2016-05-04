"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var fa_1 = require("../mods/fa");
var cell_component_1 = require("./cell-component");
var color_cell_set_1 = require("./color-cell-set");
var blur_button_1 = require("./blur-button");
var GradationSelectorComponent = (function (_super) {
    __extends(GradationSelectorComponent, _super);
    function GradationSelectorComponent() {
        _super.apply(this, arguments);
    }
    GradationSelectorComponent.prototype.writeGradations = function () {
        var _this = this;
        var onClick = function (color) { return _this.dispatch('color:select', color); };
        return this.props.gradations.map(function (colorSet) {
            return React.createElement("div", {className: "gradation-line", key: colorSet.id}, React.createElement("div", {className: "button-container"}, React.createElement(blur_button_1.default, {className: "change icon-button", onClick: function (e) { return _this.dispatch('floater:rise', e, function (color) { return _this.dispatch('gradation:change:color1', colorSet, color); }); }}, React.createElement(fa_1.default, {icon: "eyedropper"}))), React.createElement("div", {className: "color-container"}, React.createElement(color_cell_set_1.default, React.__spread({}, { colorSet: colorSet, onClick: onClick }))), React.createElement("div", {className: "button-container"}, React.createElement(blur_button_1.default, {className: "change icon-button", onClick: function (e) { return _this.dispatch('floater:rise', e, function (color) { return _this.dispatch('gradation:change:color2', colorSet, color); }); }}, React.createElement(fa_1.default, {icon: "eyedropper"})), React.createElement(blur_button_1.default, {className: "delete icon-button", onClick: function (e) { return _this.dispatch('gradation:delete', colorSet); }}, React.createElement(fa_1.default, {icon: "trash"}))));
        });
    };
    GradationSelectorComponent.prototype.render = function () {
        var _this = this;
        var _a = this.props.colors, color1 = _a[0], color2 = _a[1];
        return React.createElement("div", {className: "cell y color-palette", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, this.myName), React.createElement("section", {className: "cell-body"}, this.writeGradations(), React.createElement("div", {className: "controller"}, React.createElement(blur_button_1.default, {className: "add icon-button", onClick: function () { return _this.dispatch('gradation:add', color1, color2); }}, React.createElement(fa_1.default, {icon: "plus-circle"})))));
    };
    return GradationSelectorComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GradationSelectorComponent;
//# sourceMappingURL=gradation-component.js.map