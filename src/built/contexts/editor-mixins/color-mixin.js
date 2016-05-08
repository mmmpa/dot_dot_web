"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var argb_1 = require("../../models/argb");
exports.ColorMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(class_1.prototype, "leftColor", {
        get: function () {
            var _a = this.state, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber;
            return colors[selectedColorNumber];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "rightColor", {
        get: function () {
            var _a = this.state, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber;
            return colors[selectedColorNumber ^ 1];
        },
        enumerable: true,
        configurable: true
    });
    class_1.prototype.selectFromTip = function (i) {
        this.setState({ selectedColorNumber: i, selectedColor: this.state.colors[i] });
    };
    class_1.prototype.arrangeColor = function (_a) {
        var a = _a.a, r = _a.r, g = _a.g, b = _a.b;
        var selectedColorNumber = this.state.selectedColorNumber;
        var colors = this.state.colors.concat();
        var selectedColor = new argb_1.default(a, r, g, b);
        colors[selectedColorNumber] = selectedColor;
        this.setState({ colors: colors, selectedColor: selectedColor });
    };
    class_1.prototype.selectColor = function (selectedColor, isRight) {
        if (isRight === void 0) { isRight = false; }
        var _a = this.state, colors = _a.colors, selectedColorNumber = _a.selectedColorNumber;
        isRight && (selectedColorNumber = selectedColorNumber ^ 1);
        colors = colors.concat();
        colors[selectedColorNumber] = selectedColor;
        this.setState({ colors: colors, selectedColor: selectedColor });
    };
    class_1.prototype.addColor = function (color) {
        var colorSet = this.state.colorSet;
        colorSet.add(color);
        this.setState({ colorSet: colorSet });
    };
    class_1.prototype.removeColor = function (color) {
        var colorSet = this.state.colorSet;
        colorSet.remove(color);
        this.setState({ colorSet: colorSet });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=color-mixin.js.map