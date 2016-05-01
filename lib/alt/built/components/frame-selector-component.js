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
        var _a = this.props, selectedFrameNumber = _a.selectedFrameNumber, framesScale = _a.framesScale, frames = _a.frames;
        var scale = framesScale;
        return frames.map(function (image, frameNumber) {
            var onClick = function (layerNumber) { return _this.dispatch('frame:select', frameNumber, layerNumber); };
            return React.createElement(FrameSelectorCellComponent, React.__spread({}, { scale: scale, image: image, onClick: onClick, selected: frameNumber === selectedFrameNumber }));
        });
    };
    FrameSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {className: "cell x frame-selector", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, this.myName), React.createElement("section", {className: "cell-body"}, React.createElement("div", {className: "frames"}, this.writeFrames()), React.createElement("div", {className: "controller"}, React.createElement("div", {className: "edit"}, React.createElement(stepper_input_1.default, {value: this.props.frameRate, onChange: function (v) { return _this.dispatch('frame:rate', v); }}), React.createElement(stepper_input_1.default, {value: this.props.framesScale, onChange: function (v) { return _this.dispatch('frame:scale', v); }}), React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('frame:previous'); }}, React.createElement(fa_1.default, {icon: "backward"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:play', _this.props.frameRate); }}, React.createElement(fa_1.default, {icon: "play"})), React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('frame:next'); }}, React.createElement(fa_1.default, {icon: "forward"}))), React.createElement("div", {className: "edit"}, React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('frame:delete'); }}, React.createElement(fa_1.default, {icon: "trash"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:add'); }}, React.createElement(fa_1.default, {icon: "plus-circle"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:move:backward'); }}, React.createElement(fa_1.default, {icon: "hand-o-left"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('frame:move:forward'); }}, React.createElement(fa_1.default, {icon: "hand-o-right"}))))));
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
    Object.defineProperty(FrameSelectorCellComponent.prototype, "detectedClassName", {
        get: function () {
            return "frame-cell" + (this.props.selected ? ' selected' : '');
        },
        enumerable: true,
        configurable: true
    });
    FrameSelectorCellComponent.prototype.writeLayers = function () {
        var _a = this.props, image = _a.image, onClick = _a.onClick;
        if (!image) {
            return;
        }
        return image.dataURLs.map(function (dataURL, layerNumber) {
            return React.createElement(LayerSelectorCellComponent, React.__spread({}, { dataURL: dataURL, onClick: onClick, selected: layerNumber === selectedLayerNumber }));
        });
    };
    FrameSelectorCellComponent.prototype.render = function () {
        var _a = this.props, image = _a.image, onClick = _a.onClick;
        return React.createElement("div", {className: this.detectedClassName}, React.createElement("img", {src: image.combined, style: image.scale(this.props.scale), onClick: function () { return onClick(); }}), this.writeLayers());
    };
    return FrameSelectorCellComponent;
}(React.Component));
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
//# sourceMappingURL=frame-selector-component.js.map