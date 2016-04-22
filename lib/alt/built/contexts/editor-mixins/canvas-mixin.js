"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layered_image_1 = require("../../models/layered-image");
exports.CanvasMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.draw = function (x, y, color) {
        console.log('draw', x, y, color);
        this.ie.setPixel(x, y, color.number, true);
        this.updateFrame();
    };
    class_1.prototype.drawOnce = function (points, color) {
        var _this = this;
        points.forEach(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.ie.setPixel(x, y, color.number);
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
        this.ie.switchGrid(!this.state.grid);
        this.setState({ grid: !this.state.grid });
    };
    class_1.prototype.resizeCanvasFromModal = function (component) {
        var _this = this;
        var modalProps = {
            canvasWidth: this.state.canvasWidth,
            canvasHeight: this.state.canvasHeight,
            onComplete: function (top, right, bottom, left) {
                _this.dispatch('modal:hide');
                _this.dispatch('canvas:size:complete', top, right, bottom, left);
            },
            onCancel: function () {
                _this.dispatch('modal:hide');
            }
        };
        this.dispatch('modal:rise', component, modalProps);
    };
    class_1.prototype.resizeCanvas = function (top, right, bottom, left) {
        var _this = this;
        var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, frames = _a.frames;
        var width = canvasWidth + left + right;
        var height = canvasHeight + top + bottom;
        var newFrames = frames.map(function (frame) {
            return new layered_image_1.default(width, height, [_this.gen.fromImage(frame.image(0), width, height, top, left)]);
        });
        this.setState({
            canvasWidth: width,
            canvasHeight: height
        }, function () { return _this.dispatch('frame:replace', newFrames); });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=canvas-mixin.js.map