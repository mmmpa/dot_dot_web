"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var fa_1 = require("../mods/fa");
var cell_component_1 = require("./cell-component");
var constants_1 = require("../constants/constants");
var FrameSelectorComponent = (function (_super) {
    __extends(FrameSelectorComponent, _super);
    function FrameSelectorComponent() {
        _super.apply(this, arguments);
    }
    FrameSelectorComponent.prototype.componentWillMount = function () {
    };
    FrameSelectorComponent.prototype.detectPosition = function (props) {
    };
    FrameSelectorComponent.prototype.shouldComponentUpdate = function (props) {
        return !!props.frames;
    };
    FrameSelectorComponent.prototype.componentWillReceiveProps = function (props) {
    };
    FrameSelectorComponent.prototype.writeFrames = function () {
        var _this = this;
        return this.props.frames.map(function (image, frameNumber) {
            var onClick = function () { return _this.dispatch('frame:select', frameNumber); };
            return React.createElement(FrameSelectorCellComponent, React.__spread({}, { image: image, onClick: onClick }));
        });
    };
    FrameSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {className: "cell x frame-selector", style: this.layoutStyle}, React.createElement("header", {className: "cell-header"}, this.myName), React.createElement("section", {className: "cell-body"}, React.createElement("div", {className: "frames"}, this.writeFrames()), React.createElement("div", {className: "controller"}, React.createElement("div", {className: "edit"}, React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('floater:rise', e, constants_1.FloatingColorPaletteMode.Delete); }}, React.createElement(fa_1.default, {icon: "backward"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('color:add'); }}, React.createElement(fa_1.default, {icon: "play"})), React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('floater:rise', e, constants_1.FloatingColorPaletteMode.Delete); }}, React.createElement(fa_1.default, {icon: "forward"}))), React.createElement("div", {className: "edit"}, React.createElement("button", {className: "delete icon-button", onClick: function (e) { return _this.dispatch('floater:rise', e, constants_1.FloatingColorPaletteMode.Delete); }}, React.createElement(fa_1.default, {icon: "trash"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('color:add'); }}, React.createElement(fa_1.default, {icon: "plus-circle"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('color:add'); }}, React.createElement(fa_1.default, {icon: "hand-o-left"})), React.createElement("button", {className: "add icon-button", onClick: function () { return _this.dispatch('color:add'); }}, React.createElement(fa_1.default, {icon: "hand-o-right"}))))));
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
        this.setState({
            version: this.props.image.version
        });
    };
    FrameSelectorCellComponent.prototype.shouldComponentUpdate = function (props) {
        var version = props.image.version;
        return version === 0 || version !== this.state.version;
    };
    FrameSelectorCellComponent.prototype.componentWillReceiveProps = function (props) {
        var version = props.image.version;
        this.setState({ version: version });
    };
    FrameSelectorCellComponent.prototype.render = function () {
        var _a = this.props, image = _a.image, onClick = _a.onClick;
        return React.createElement("div", {className: "frame-cell"}, React.createElement("img", {src: image.raw(0), style: image.scale(2), onClick: function () { return onClick(); }}));
    };
    return FrameSelectorCellComponent;
}(React.Component));
//# sourceMappingURL=frame-selector-component.js.map