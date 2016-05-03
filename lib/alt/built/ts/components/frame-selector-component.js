"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var fa_1 = require("../mods/fa");
var cell_component_1 = require("./cell-component");
var stepper_input_1 = require("./stepper-input");
var ReactAddons = require("react-addons");
var classSet = ReactAddons.classSet;
var FrameSelectorComponent = (function (_super) {
    __extends(FrameSelectorComponent, _super);
    function FrameSelectorComponent() {
        _super.apply(this, arguments);
    }
    FrameSelectorComponent.prototype.shouldComponentUpdate = function (props) {
        return !!props.frames;
    };
    FrameSelectorComponent.prototype.writeFrames = function () {
        var _this = this;
        var _a = this.props, selectedFrameNumber = _a.selectedFrameNumber, selectedLayerNumber = _a.selectedLayerNumber, framesScale = _a.framesScale, frames = _a.frames;
        var scale = framesScale;
        return frames.map(function (image, frameNumber) {
            var onClick = function (layerNumber) { return _this.dispatch('frame:select', frameNumber, layerNumber); };
            return React.createElement(FrameSelectorCellComponent, React.__spread({}, { scale: scale, image: image, onClick: onClick, selectedLayerNumber: selectedLayerNumber, selected: frameNumber === selectedFrameNumber }));
        });
    };
    FrameSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {className: "cell x frame-selector", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, this.myName), React.createElement("section", {className: "cell-body"}, React.createElement("div", {className: "controller"}, React.createElement("div", {className: "edit"}, React.createElement(stepper_input_1.default, {value: this.props.framesScale, onChange: function (v) { return _this.dispatch('frame:scale', v); }}), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:play', _this.props.frameRate); }}, React.createElement(fa_1.default, {icon: "play"}))), React.createElement("div", {className: "edit"}, React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:add'); }}, React.createElement(fa_1.default, {icon: "film"}), " ", React.createElement(fa_1.default, {icon: "plus-circle"})), React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('frame:delete'); }}, React.createElement(fa_1.default, {icon: "film"}), " ", React.createElement(fa_1.default, {icon: "trash"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('layer:add'); }}, React.createElement(fa_1.default, {icon: "copy"}), " ", React.createElement(fa_1.default, {icon: "plus-circle"})), React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('layer:remove'); }}, React.createElement(fa_1.default, {icon: "copy"}), " ", React.createElement(fa_1.default, {icon: "trash"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:move:backward'); }}, React.createElement(fa_1.default, {icon: "hand-o-left"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:move:forward'); }}, React.createElement(fa_1.default, {icon: "hand-o-right"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('layer:move:upward'); }}, React.createElement(fa_1.default, {icon: "hand-o-up"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('layer:move:downward'); }}, React.createElement(fa_1.default, {icon: "hand-o-down"})))), React.createElement("div", {className: "frames"}, this.writeFrames())));
    };
    return FrameSelectorComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FrameSelectorComponent;
var FrameSelectorCellComponent = (function (_super) {
    __extends(FrameSelectorCellComponent, _super);
    function FrameSelectorCellComponent() {
        _super.apply(this, arguments);
    }
    FrameSelectorCellComponent.prototype.componentWillMount = function () {
        this.componentWillReceiveProps(this.props);
    };
    FrameSelectorCellComponent.prototype.shouldComponentUpdate = function (props) {
        var image = props.image;
        var version = image.version;
        return true;
    };
    FrameSelectorCellComponent.prototype.componentWillReceiveProps = function (props) {
        this.setState({
            version: props.image.version,
            image: props.image
        });
    };
    Object.defineProperty(FrameSelectorCellComponent.prototype, "classes", {
        get: function () {
            return classSet({
                'frame-cell': true,
                'selected': this.props.selected
            });
        },
        enumerable: true,
        configurable: true
    });
    FrameSelectorCellComponent.prototype.writeLayers = function () {
        var _a = this.props, image = _a.image, onClick = _a.onClick, selectedLayerNumber = _a.selectedLayerNumber;
        var style = image.scale(this.props.scale);
        if (!image) {
            return;
        }
        return image.dataURLs.map(function (dataURL, layerNumber) {
            return React.createElement(LayerSelectorCellComponent, React.__spread({}, { style: style, dataURL: dataURL, onClick: onClick, layerNumber: layerNumber, selected: layerNumber === selectedLayerNumber }));
        });
    };
    FrameSelectorCellComponent.prototype.render = function () {
        var _a = this.props, image = _a.image, onClick = _a.onClick;
        var style = image.scale(this.props.scale);
        return React.createElement("div", {className: this.classes}, React.createElement("div", {className: "layer-cell first"}, React.createElement("img", {src: image.combined.data, style: style, onClick: function () { return onClick(); }})), this.writeLayers());
    };
    return FrameSelectorCellComponent;
}(React.Component));
var LayerSelectorCellComponent = (function (_super) {
    __extends(LayerSelectorCellComponent, _super);
    function LayerSelectorCellComponent() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(LayerSelectorCellComponent.prototype, "classes", {
        get: function () {
            return classSet({
                'layer-cell': true,
                'selected': this.props.selected
            });
        },
        enumerable: true,
        configurable: true
    });
    LayerSelectorCellComponent.prototype.render = function () {
        var _a = this.props, dataURL = _a.dataURL, onClick = _a.onClick, layerNumber = _a.layerNumber, style = _a.style;
        return React.createElement("div", {className: this.classes}, React.createElement("img", {src: dataURL.data, style: style, onClick: function () { return onClick(layerNumber); }}));
    };
    return LayerSelectorCellComponent;
}(React.Component));
//# sourceMappingURL=frame-selector-component.js.map