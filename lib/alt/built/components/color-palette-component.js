"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var fa_1 = require("../mods/fa");
var cell_component_1 = require("./cell-component");
var ColorPaletteComponent = (function (_super) {
    __extends(ColorPaletteComponent, _super);
    function ColorPaletteComponent() {
        _super.apply(this, arguments);
    }
    ColorPaletteComponent.prototype.componentWillMount = function () {
        this.setState({
            version: this.props.colorSet.version
        });
    };
    ColorPaletteComponent.prototype.shouldComponentUpdate = function (props) {
        return props.colorSet.version !== this.state.version;
    };
    ColorPaletteComponent.prototype.componentWillReceiveProps = function (props) {
        this.setState({ version: props.colorSet.version });
    };
    ColorPaletteComponent.prototype.writeCells = function () {
        var _this = this;
        var colors = this.props.colorSet.colors;
        return colors.map(function (color, key) {
            var onClick = function () { return _this.dispatch('color:select', color); };
            return React.createElement(ColorCell, React.__spread({}, { key: key, color: color, onClick: onClick }));
        });
    };
    ColorPaletteComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {className: "cell y color-pallet", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, this.myName), React.createElement("section", {className: "cell-body"}, React.createElement("ul", {className: "colors"}, this.writeCells()), React.createElement("div", {className: "controller"}, React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('color:add'); }}, React.createElement(fa_1.default, {icon: "plus-circle"})), React.createElement("button", {className: "delete icon-button", onClick: function () { return _this.dispatch('color:delete'); }}, React.createElement(fa_1.default, {icon: "trash"})))));
    };
    return ColorPaletteComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorPaletteComponent;
var ColorCell = (function (_super) {
    __extends(ColorCell, _super);
    function ColorCell() {
        _super.apply(this, arguments);
    }
    ColorCell.prototype.render = function () {
        var _a = this.props, color = _a.color, onClick = _a.onClick;
        return React.createElement("li", {className: "color-cell", style: { background: color.hex }, onClick: onClick}, color.hex);
    };
    return ColorCell;
}(React.Component));
//# sourceMappingURL=color-palette-component.js.map