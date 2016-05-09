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
var parcel_1 = require('../libs/parcel');
var React = require('react');
var color_cell_set_1 = require('./color-cell-set');
require('zepto/zepto.min');
var FloatingColorPaletteComponent = (function (_super) {
    __extends(FloatingColorPaletteComponent, _super);
    function FloatingColorPaletteComponent() {
        _super.apply(this, arguments);
    }
    FloatingColorPaletteComponent.prototype.componentWillMount = function () {
        this.setState({
            visible: this.detectVisibility(this.props),
            position: this.detectPosition(this.props),
        });
    };
    FloatingColorPaletteComponent.prototype.detectPosition = function (props) {
        if (!props.floatingFrom) {
            return { top: 0, left: 0 };
        }
        var $from = $(props.floatingFrom);
        var _a = $from.offset(), top = _a.top, left = _a.left;
        top += $from.height();
        return { top: top, left: left };
    };
    FloatingColorPaletteComponent.prototype.shouldComponentUpdate = function (props) {
        return props.floatingCallback !== this.props.floatingCallback;
    };
    FloatingColorPaletteComponent.prototype.componentWillReceiveProps = function (props) {
        this.setState({
            visible: this.detectVisibility(props),
            position: this.detectPosition(props),
        });
    };
    FloatingColorPaletteComponent.prototype.detectVisibility = function (props) {
        return !_.isNull(props.floatingCallback);
    };
    FloatingColorPaletteComponent.prototype.render = function () {
        var _this = this;
        if (!this.state.visible) {
            return null;
        }
        var _a = this.state.position, top = _a.top, left = _a.left;
        var _b = this.props, colorSet = _b.colorSet, floatingCallback = _b.floatingCallback;
        return React.createElement("div", {className: "floating-color-palette", style: { top: top, left: left }}, React.createElement(color_cell_set_1.default, __assign({}, { colorSet: colorSet, onClick: function (color) { return _this.dispatch('floater:select', function () { return floatingCallback(color); }); } })));
    };
    return FloatingColorPaletteComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FloatingColorPaletteComponent;
//# sourceMappingURL=floating-color-palette.js.map