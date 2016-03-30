"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require("react");
var canvas_component_1 = require("./canvas-component");
var tool_selector_component_1 = require("./tool-selector-component");
var tool_contoroller_component_1 = require("./tool-contoroller-component");
var color_palette_component_1 = require("./color-palette-component");
var selected_color_component_1 = require("./selected-color-component");
var style_stylist_1 = require("../models/style-stylist");
var color_controller_component_1 = require("./color-controller-component");
require("zepto/zepto.min");
var EditorComponent = (function (_super) {
    __extends(EditorComponent, _super);
    function EditorComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(EditorComponent.prototype, "components", {
        get: function () {
            return [
                React.createElement(canvas_component_1.default, {name: "canvas"}),
                React.createElement(tool_selector_component_1.default, {name: "toolSelector"}),
                React.createElement(tool_contoroller_component_1.default, {name: "toolController"}),
                React.createElement(color_palette_component_1.default, {name: "colorPalette"}),
                React.createElement(selected_color_component_1.default, {name: "selectedColor"}),
                React.createElement(color_controller_component_1.default, {name: "colorController"})
            ];
        },
        enumerable: true,
        configurable: true
    });
    EditorComponent.prototype.componentWillMount = function () {
        this.setState({
            layout: {}
        });
    };
    EditorComponent.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.addEvent();
        this.onWindowResize();
    };
    EditorComponent.prototype.onWindowResize = function (e) {
        var w = $(window).width();
        var h = $(window).height();
        var left = w * 0.7 >> 0;
        var right = w - left;
        var split = h / 5;
        this.setState({
            layout: {
                canvas: new style_stylist_1.default(0, 0, left, h).css,
                toolSelector: new style_stylist_1.default(left, 0, right, split).css,
                toolController: new style_stylist_1.default(left, split, right, split).css,
                colorPalette: new style_stylist_1.default(left, split * 2, right, split).css,
                selectedColor: new style_stylist_1.default(left, split * 3, right, split).css,
                colorController: new style_stylist_1.default(left, split * 4, right, h - split * 4).css
            }
        });
    };
    EditorComponent.prototype.addEvent = function () {
        this.addEventSafety(window, 'resize', this.onWindowResize.bind(this));
    };
    EditorComponent.prototype.render = function () {
        return React.createElement("article", {className: "editor-area"}, this.relay(this.components));
    };
    return EditorComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorComponent;
//# sourceMappingURL=editor-component.js.map