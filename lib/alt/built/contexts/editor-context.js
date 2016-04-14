"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var argb_1 = require("../models/argb");
var key_control_1 = require("../models/key-control");
var color_set_1 = require("../models/color-set");
var constants_1 = require("../constants/constants");
var EditorContext = (function (_super) {
    __extends(EditorContext, _super);
    function EditorContext() {
        _super.apply(this, arguments);
    }
    EditorContext.prototype.componentWillMount = function () {
        var _this = this;
        _super.prototype.componentWillMount.call(this);
        this.setState({
            colors: [argb_1.default.number(0xff000000), argb_1.default.number(0xffffffff)],
            selectedColorNumber: 0,
            selectedColor: argb_1.default.number(0xff000000),
            scale: 1,
            grid: true,
            keyControl: new key_control_1.default(function (mode) { return mode !== _this.state.mode && _this.setState({ mode: mode }); }),
            mode: null,
            colorSet: new color_set_1.default([argb_1.default.number(0xffff0000), argb_1.default.number(0xff00ff00), argb_1.default.number(0xff0000ff)]),
            floatingColorPaletteMode: null
        });
    };
    EditorContext.prototype.arrangeColor = function (_a) {
        var a = _a.a, r = _a.r, g = _a.g, b = _a.b;
        //console.log(argb)
        var selectedColorNumber = this.state.selectedColorNumber;
        var colors = this.state.colors.concat();
        var selectedColor = new argb_1.default(a, r, g, b);
        colors[selectedColorNumber] = selectedColor;
        this.setState({ colors: colors, selectedColor: selectedColor });
    };
    EditorContext.prototype.selectColor = function (selectedColor) {
        var _a = this.state, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber;
        colors = colors.concat();
        colors[selectedColorNumber] = selectedColor;
        this.setState({ colors: colors, selectedColor: selectedColor });
    };
    EditorContext.prototype.riseFloater = function (e, floatingColorPaletteMode) {
        this.setState({ floatingColorPaletteMode: floatingColorPaletteMode });
    };
    EditorContext.prototype.selectColorFromFloater = function (selectedColor, index) {
        this.detectFloatingAction()(selectedColor, index);
        this.setState({ floatingColorPaletteMode: null });
    };
    EditorContext.prototype.detectFloatingAction = function () {
        switch (this.state.floatingColorPaletteMode) {
            case constants_1.FloatingColorPaletteMode.Delete:
                return this.deleteColor.bind(this);
        }
    };
    EditorContext.prototype.addColor = function () {
        var _a = this.state, colorSet = _a.colorSet, selectedColor = _a.selectedColor;
        colorSet.add(selectedColor);
        this.setState({ colorSet: colorSet });
    };
    EditorContext.prototype.deleteColor = function (color) {
        var colorSet = this.state.colorSet;
        colorSet.remove(color);
        this.setState({ colorSet: colorSet });
    };
    EditorContext.prototype.listen = function (to) {
        var _this = this;
        to('color:switch', function (selectedColorNumber) { return _this.setState({ selectedColorNumber: selectedColorNumber, selectedColor: _this.state.colors[selectedColorNumber] }); });
        to('color:select', function (color) { return _this.selectColor(color); });
        to('color:add', function () { return _this.addColor(); });
        to('color:arrange', function (argb) { return _this.arrangeColor(argb); });
        to('floater:select', function (color) { return _this.selectColorFromFloater(color); });
        to('floater:rise', function (e, mode) { return _this.riseFloater(e, mode); });
        to('canvas:scale', function (scale) { return _this.setState({ scale: scale }); });
        to('image:save', function (dataUrl) {
            var name = 'test';
            $('<a>')
                .attr("href", dataUrl)
                .attr("download", "file-" + name)
                .trigger('click');
        });
    };
    return EditorContext;
}(parcel_1.Parcel));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorContext;
//# sourceMappingURL=editor-context.js.map