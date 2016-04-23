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
    class_1.prototype.pressCanvas = function (canvas, mouseX, mouseY, isRight) {
        if (isRight === void 0) { isRight = false; }
        var _a = this.mousePosition(canvas, mouseX, mouseY), x = _a.x, y = _a.y;
        this.detectMouseAction(isRight)(x, y);
        this.dragCanvas(canvas, x, y);
    };
    class_1.prototype.dragCanvas = function (canvas, startX, startY, props) {
        var _this = this;
        this.draw(startX, startY, props);
        var pre = { x: startX, y: startY };
        var move = function (e) {
            var _a = _this.mousePosition(canvas, e), x = _a.x, y = _a.y;
            _this.drawLine(pre.x, pre.y, x, y, props);
            pre = { x: x, y: y };
        };
        $(window).on('mousemove', move);
        $(window).on('mouseup', function () {
            $(window).off('mousemove', move);
        });
    };
    class_1.prototype.detectMouseAction = function (isRight) {
        var _this = this;
        if (isRight === void 0) { isRight = false; }
        switch (this.state.mode) {
            case 'slide':
                return this.startSlide(x, y);
            case 'select':
                return this.select.bind(this);
            default:
                return isRight
                    ? function (x, y) { return _this.draw(x, y, _this.rightColor); }
                    : function (x, y) { return _this.draw(x, y, _this.leftColor); };
        }
    };
    class_1.prototype.mousePosition = function (canvas, mouseX, mouseY) {
        var x = mouseX - canvas.offsetLeft;
        var y = mouseY - canvas.offsetTop;
        return { x: x, y: y };
    };
    class_1.prototype.select = function (x, y) {
        this.ie.setSelection(x, y, true);
    };
    class_1.prototype.selectLine = function (x, y, endX, endY) {
        this.ie.setSelectionPixelToPixel(x, y, endX, endY, true);
    };
    class_1.prototype.draw = function (x, y, color) {
        this.ie.setPixel(x, y, color.number, true);
        this.dispatch('frame:update');
    };
    class_1.prototype.drawLine = function (x, y, endX, endY, color) {
        this.ie.setPixelToPixel(x, y, endX, endY, color.number, true);
        this.dispatch('frame:update');
    };
    class_1.prototype.hideSelection = function (selectionHidden) {
        selectionHidden ? this.ie.hideSelection() : this.ie.showSelection();
        this.setState({ selectionHidden: selectionHidden });
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