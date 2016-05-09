"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require('react');
var fa_1 = require('../mods/fa');
var cell_component_1 = require('./cell-component');
var color_cell_set_1 = require('./color-cell-set');
var blur_button_1 = require('./blur-button');
var ColorPaletteComponent = (function (_super) {
    __extends(ColorPaletteComponent, _super);
    function ColorPaletteComponent() {
        _super.apply(this, arguments);
    }
    ColorPaletteComponent.prototype.render = function () {
        var _this = this;
        var colorSet = this.props.colorSet;
        return React.createElement("div", {className: "cell y color-palette", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, "カラーパレット"), React.createElement("section", {className: "cell-body"}, React.createElement(color_cell_set_1.default, __assign({}, { colorSet: colorSet, onClick: function (color, index, isRight) { return _this.dispatch('color:select', color, isRight); } })), React.createElement("div", {className: "controller"}, React.createElement(blur_button_1.default, {className: "add icon-button", onClick: function () { return _this.dispatch('color:add', _this.props.selectedColor); }}, React.createElement(fa_1.default, {icon: "plus-circle"})), React.createElement(blur_button_1.default, {className: "delete icon-button", onClick: function (e) { return _this.dispatch('floater:rise', e, function (color) { return _this.dispatch('color:remove', color); }); }}, React.createElement(fa_1.default, {icon: "trash"})))));
    };
    return ColorPaletteComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorPaletteComponent;
//# sourceMappingURL=color-palette-component.js.map