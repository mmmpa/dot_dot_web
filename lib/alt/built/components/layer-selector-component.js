"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var fa_1 = require("../mods/fa");
var cell_component_1 = require("./cell-component");
var LayerSelectorComponent = (function (_super) {
    __extends(LayerSelectorComponent, _super);
    function LayerSelectorComponent() {
        _super.apply(this, arguments);
    }
    LayerSelectorComponent.prototype.shouldComponentUpdate = function (props) {
        var _a = this.props, frames = _a.frames, selectedLayerNumber = _a.selectedLayerNumber;
        return !!props.frames;
    };
    LayerSelectorComponent.prototype.writeLayers = function () {
        var _this = this;
        var _a = this.props, frames = _a.frames, selectedLayerNumber = _a.selectedLayerNumber;
        var layeredImage = frames[selectedLayerNumber];
        if (!layeredImage) {
            return;
        }
        return layeredImage.dataURLs.map(function (dataURL, layerNumber) {
            var onClick = function () { return _this.dispatch('layer:select', layerNumber); };
            return React.createElement(LayerSelectorCellComponent, React.__spread({}, { dataURL: dataURL, onClick: onClick, selected: layerNumber === selectedLayerNumber }));
        });
    };
    LayerSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {className: "cell x layer-selector", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, this.myName), React.createElement("section", {className: "cell-body"}, React.createElement("div", {className: "layers"}, this.writeLayers()), React.createElement("div", {className: "controller"}, React.createElement("div", {className: "edit"}, React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('layer:remove'); }}, React.createElement(fa_1.default, {icon: "trash"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('layer:add'); }}, React.createElement(fa_1.default, {icon: "plus-circle"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('layer:move:upward'); }}, React.createElement(fa_1.default, {icon: "hand-o-up"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('layer:move:downward'); }}, React.createElement(fa_1.default, {icon: "hand-o-down"}))))));
    };
    return LayerSelectorComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LayerSelectorComponent;
var LayerSelectorCellComponent = (function (_super) {
    __extends(LayerSelectorCellComponent, _super);
    function LayerSelectorCellComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(LayerSelectorCellComponent.prototype, "detectedClassName", {
        get: function () {
            return "frame-cell" + (this.props.selected ? ' selected' : '');
        },
        enumerable: true,
        configurable: true
    });
    LayerSelectorCellComponent.prototype.render = function () {
        var _a = this.props, dataURL = _a.dataURL, onClick = _a.onClick;
        return React.createElement("div", {className: this.detectedClassName}, React.createElement("img", {src: dataURL, onClick: function () { return onClick(); }}));
    };
    return LayerSelectorCellComponent;
}(React.Component));
//# sourceMappingURL=layer-selector-component.js.map