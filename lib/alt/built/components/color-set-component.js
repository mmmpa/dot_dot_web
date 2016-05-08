"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var cell_component_1 = require("./cell-component");
var color_cell_set_1 = require("./color-cell-set");
var constants_1 = require("../constants/constants");
var _ = require('lodash');
var ColorSetComponent = (function (_super) {
    __extends(ColorSetComponent, _super);
    function ColorSetComponent() {
        _super.apply(this, arguments);
    }
    ColorSetComponent.prototype.componentWillMount = function () {
        this.setState({
            colorSetName: 'sfc'
        });
    };
    ColorSetComponent.prototype.writeOption = function () {
        return _.map(constants_1.colorPreset, function (v, k) {
            return React.createElement("option", {value: k}, v.title);
        });
    };
    ColorSetComponent.prototype.writeSelector = function () {
        var _this = this;
        return React.createElement("select", {value: this.state.colorSetName, onChange: function (e) { return _this.setState({ colorSetName: e.target.value }); }}, this.writeOption());
    };
    ColorSetComponent.prototype.render = function () {
        var _this = this;
        var colorSet = constants_1.colorPreset[this.state.colorSetName].colorSet;
        return React.createElement("div", {className: "cell y color-palette", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, "カラーセット"), this.writeSelector(), React.createElement("section", {className: "cell-body"}, React.createElement(color_cell_set_1.default, React.__spread({}, { colorSet: colorSet, onClick: function (color, index, isRight) { return _this.dispatch('color:select', color, isRight); } }))));
    };
    return ColorSetComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorSetComponent;
//# sourceMappingURL=color-set-component.js.map