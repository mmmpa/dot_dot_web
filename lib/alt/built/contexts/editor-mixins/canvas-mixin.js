"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
exports.CanvasMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.draw = function (x, y) {
        this.ie.setPixel(x, y, this.state.selectedColor.number, true);
        this.updateFrame();
    };
    class_1.prototype.drawOnce = function (points) {
        var _this = this;
        points.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.ie.setPixel(x, y, _this.state.selectedColor.number);
        });
        this.ie.update();
        this.updateFrame();
    };
    class_1.prototype.scaleStep = function (direction, x, y) {
        var scale = this.state.scale;
        scale += direction;
        if (scale < 0) {
            scale = 0;
        }
        else if (scale >= this.scaleNumbers.length) {
            scale = this.scaleNumbers.length - 1;
        }
        this.scale(scale, x, y);
        this.setState({ scale: scale });
    };
    class_1.prototype.scale = function (scale, x, y) {
        this.ie.scale(this.scaleNumbers[scale || this.state.scale], x, y);
        if (!x && !y) {
            this.center();
        }
    };
    class_1.prototype.center = function () {
        var _a = this.state, canvasComponentWidth = _a.canvasComponentWidth, canvasComponentHeight = _a.canvasComponentHeight;
        return this.ie.center(parseInt(canvasComponentWidth), parseInt(canvasComponentHeight));
    };
    class_1.prototype.toggleGrid = function () {
        this.setState({ grid: !this.state.grid });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=canvas-mixin.js.map