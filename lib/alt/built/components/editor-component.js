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
var color_palette_component_1 = require("./color-palette-component");
var color_controller_component_1 = require("./color-controller-component");
var floating_color_palette_1 = require("./floating-color-palette");
var frame_selector_component_1 = require("./frame-selector-component");
var gradation_component_1 = require("./gradation-component");
var modal_component_1 = require("./modal-component");
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
                React.createElement(frame_selector_component_1.default, {name: "frameSelector"}),
                React.createElement(tool_selector_component_1.default, {name: "toolSelector"}),
                React.createElement(color_palette_component_1.default, {name: "colorPalette"}),
                React.createElement(gradation_component_1.default, {name: "gradationSelector"}),
                React.createElement(color_controller_component_1.default, {name: "colorController"}),
                React.createElement(floating_color_palette_1.default, {name: "floaterColorPalette"}),
                React.createElement(modal_component_1.default, {name: "modal"})
            ];
        },
        enumerable: true,
        configurable: true
    });
    EditorComponent.prototype.componentWillMount = function () {
        _super.prototype.componentWillMount.call(this);
        this.onWindowResize();
        this.setState({
            componentSizeVersion: this.props.componentSize.version
        });
    };
    EditorComponent.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
        this.addEvent();
    };
    EditorComponent.prototype.componentWillReceiveProps = function (props) {
        if (props.componentSize.version !== this.state.componentSizeVersion) {
            this.setState({
                layout: props.componentSize.compute($(window).width(), $(window).height())
            });
        }
    };
    EditorComponent.prototype.onWindowResize = function (e) {
        this.setState({
            layout: this.props.componentSize.compute($(window).width(), $(window).height())
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