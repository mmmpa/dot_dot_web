"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var cell_component_1 = require("./cell-component");
var argb_1 = require("../models/argb");
var _ = require('lodash');
var ColorControllerComponent = (function (_super) {
    __extends(ColorControllerComponent, _super);
    function ColorControllerComponent() {
        _super.apply(this, arguments);
    }
    ColorControllerComponent.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        this.setState(this.generateState());
    };
    ColorControllerComponent.prototype.generateState = function (state) {
        var base = state || {
            colors: [argb_1.default.number(0xff00ff00), argb_1.default.number(0xffff0000)],
            selectedColor: 0
        };
        var argb = base.colors[base.selectedColor].toJson();
        return _.assign(base, argb);
    };
    ColorControllerComponent.prototype.changeColor = function (_a) {
        var selectedColor = _a.selectedColor, a = _a.a, r = _a.r, g = _a.g, b = _a.b;
        if (_.isNumber(selectedColor)) {
            var argb_2 = this.state.colors[selectedColor].toJson();
            this.setState(_.assign({ selectedColor: selectedColor }, argb_2));
            return;
        }
        var colors = this.state.colors.concat();
        var color = colors[this.state.selectedColor];
        if (_.isNumber(a)) {
            color.a = a;
        }
        if (_.isNumber(r)) {
            color.r = r;
        }
        if (_.isNumber(g)) {
            color.g = g;
        }
        if (_.isNumber(b)) {
            color.b = b;
        }
        var argb = color.toJson();
        console.log(a, r, g, b, _.assign({ colors: colors }, argb));
        this.setState(_.assign({ colors: colors }, argb));
    };
    ColorControllerComponent.prototype.componentWillUpdate = function (nextProps, nextState) {
        _super.prototype.componentWillUpdate.call(this, nextProps, nextState);
    };
    ColorControllerComponent.prototype.render = function () {
        var _a = this.state, r = _a.r, g = _a.g, b = _a.b, a = _a.a, colors = _a.colors, selectedColor = _a.selectedColor;
        var that = this;
        return React.createElement("div", {className: "cell y color-controller", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, this.myName), React.createElement("section", {className: "cell-body"}, React.createElement("section", {className: "selected"}, React.createElement(SelectedColor, React.__spread({}, { colors: colors, selectedColor: selectedColor }, {onSelect: function (selectedColor) { return that.changeColor({ selectedColor: selectedColor }); }}))), React.createElement("section", {className: "slider"}, React.createElement(ColorSlider, {title: "R", value: r, onChange: function (e) { return that.changeColor({ r: +e.target.value }); }}), React.createElement(ColorSlider, {title: "G", value: g, onChange: function (e) { return that.changeColor({ g: +e.target.value }); }}), React.createElement(ColorSlider, {title: "B", value: b, onChange: function (e) { return that.changeColor({ b: +e.target.value }); }}), React.createElement(ColorSlider, {title: "A", value: a, onChange: function (e) { return that.changeColor({ a: +e.target.value }); }}))));
    };
    return ColorControllerComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorControllerComponent;
var SelectedColor = (function (_super) {
    __extends(SelectedColor, _super);
    function SelectedColor() {
        _super.apply(this, arguments);
    }
    SelectedColor.prototype.selectedStyle = function (n) {
        return n === this.props.selectedColor ? ' selected' : '';
    };
    SelectedColor.prototype.render = function () {
        var _a = this.props, onSelect = _a.onSelect, colors = _a.colors;
        var color1 = colors[0], color2 = colors[1];
        return React.createElement("div", {className: "selected-color"}, React.createElement("div", {className: "tip first" + this.selectedStyle(0)}, React.createElement("div", {className: "inner", style: { background: color1.hex }, onClick: function () { return onSelect(0); }}, color1.hex)), React.createElement("div", {className: "tip second" + this.selectedStyle(1)}, React.createElement("div", {className: "inner", style: { background: color2.hex }, onClick: function () { return onSelect(1); }}, color2.hex)));
    };
    return SelectedColor;
}(React.Component));
var ColorSlider = (function (_super) {
    __extends(ColorSlider, _super);
    function ColorSlider() {
        _super.apply(this, arguments);
    }
    ColorSlider.prototype.shouldComponentUpdate = function (nextProps, _) {
        return this.props.value !== nextProps.value;
    };
    ColorSlider.prototype.render = function () {
        var _a = this.props, title = _a.title, value = _a.value, onChange = _a.onChange;
        return React.createElement("div", {className: "color-slider"}, React.createElement("div", {className: "title"}, title), React.createElement("div", {className: "number"}, React.createElement("input", React.__spread({type: "number", min: "0", max: "255", step: "1"}, { value: value, onChange: onChange }))), React.createElement("div", {className: "slider"}, React.createElement("input", React.__spread({type: "range", min: "0", max: "255", step: "1"}, { value: value, onChange: onChange }))));
    };
    return ColorSlider;
}(React.Component));
//# sourceMappingURL=color-controller-component.js.map