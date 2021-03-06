"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var argb_1 = require('../../models/argb');
var constants_1 = require('../../constants/constants');
exports.DrawingMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.pressCanvas = function (x, y, isRight) {
        if (isRight === void 0) { isRight = false; }
        this.detectPressAction(isRight)(x, y);
    };
    class_1.prototype.dragCanvas = function (startX, startY, x, y, endX, endY, isRight) {
        if (isRight === void 0) { isRight = false; }
        this.detectDragAction(isRight)(startX, startY, x, y, endX, endY);
    };
    class_1.prototype.spuitCanvas = function (x, y, isRight) {
        if (isRight === void 0) { isRight = false; }
        var color = argb_1.default.fromNumber(this.ie.getPixel(x, y));
        this.dispatch('color:select', color, isRight);
    };
    class_1.prototype.copyCanvas = function () {
        this.ie.copy();
        this.dispatch('frame:update');
    };
    class_1.prototype.cutCanvas = function () {
        this.ie.cut();
        this.dispatch('frame:update');
    };
    class_1.prototype.pasteCanvas = function () {
        this.ie.paste();
        this.dispatch('frame:update');
    };
    class_1.prototype.delSelection = function () {
        this.ie.del();
        this.dispatch('frame:update');
    };
    class_1.prototype.moveCanvas = function (t, r, b, l) {
        this.ie.move(t, r, b, l);
    };
    class_1.prototype.detectPressAction = function (isRight) {
        var _this = this;
        if (isRight === void 0) { isRight = false; }
        this.isAlternative() && (isRight = !isRight);
        switch (true) {
            case this.isSlideMode():
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return null;
                };
            case this.isSelectRectangleMode():
                return function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    return null;
                };
            case this.isSelectMode():
                return function (x, y) { return _this.select(x, y, !isRight); };
            case this.isSpuitMode():
                return function (x, y) { return _this.spuitCanvas(x, y, isRight); };
            case this.isFillMode():
                return isRight
                    ? function (x, y) { return _this.fill(x, y, _this.rightColor); }
                    : function (x, y) { return _this.fill(x, y, _this.leftColor); };
            default:
                return isRight
                    ? function (x, y) { return _this.draw(x, y, _this.rightColor); }
                    : function (x, y) { return _this.draw(x, y, _this.leftColor); };
        }
    };
    class_1.prototype.detectDragAction = function (isRight) {
        var _this = this;
        if (isRight === void 0) { isRight = false; }
        this.isAlternative() && (isRight = !isRight);
        switch (true) {
            case this.isSlideMode():
                return function (startX, startY, x, y, endX, endY) { return _this.slide(x, y, endX, endY); };
            case this.isSelectRectangleMode():
                return isRight
                    ? function (startX, startY, x, y, endX, endY) { return _this.selectRectangle(startX, startY, endX, endY, false); }
                    : function (startX, startY, x, y, endX, endY) { return _this.selectRectangle(startX, startY, endX, endY); };
            case this.isSelectMode():
                return isRight
                    ? function (startX, startY, x, y, endX, endY) { return _this.selectLine(x, y, endX, endY, false); }
                    : function (startX, startY, x, y, endX, endY) { return _this.selectLine(x, y, endX, endY); };
            default:
                return isRight
                    ? function (startX, startY, x, y, endX, endY) { return _this.drawLine(x, y, endX, endY, _this.rightColor); }
                    : function (startX, startY, x, y, endX, endY) { return _this.drawLine(x, y, endX, endY, _this.leftColor); };
        }
    };
    class_1.prototype.isAlternative = function () {
        return this.state.keyControl.isDown('Alt');
    };
    class_1.prototype.isFillMode = function () {
        return this.state.keyControl.isDown('KeyF');
    };
    class_1.prototype.isSlideMode = function () {
        return this.state.keyControl.isDown('Space');
    };
    class_1.prototype.isSelectMode = function () {
        return this.state.keyControl.isDown('Shift');
    };
    class_1.prototype.isSpuitMode = function () {
        return this.state.keyControl.isDown('Control');
    };
    class_1.prototype.isSelectRectangleMode = function () {
        return this.state.keyControl.isDown('Shift') && this.state.keyControl.isDown('Control');
    };
    class_1.prototype.select = function (x, y, add) {
        if (add === void 0) { add = true; }
        this.ie.setSelection(x, y, add, true);
    };
    class_1.prototype.fill = function (x, y, color) {
        this.ie.fill(x, y, color.number, true);
        this.dispatch('frame:update');
    };
    class_1.prototype.selectLine = function (x, y, endX, endY, add) {
        if (add === void 0) { add = true; }
        this.ie.setSelectionPixelToPixel(x, y, endX, endY, add, true);
    };
    class_1.prototype.selectRectangle = function (x, y, endX, endY, add) {
        if (add === void 0) { add = true; }
        this.ie.setRectangleSelection(x, y, endX, endY, add, true);
    };
    class_1.prototype.draw = function (x, y, color) {
        this.ie.draw(x, y, color.number, true);
        this.dispatch('frame:update');
    };
    class_1.prototype.drawLine = function (x, y, endX, endY, color) {
        this.ie.drawPixelToPixel(x, y, endX, endY, color.number, true);
        this.dispatch('frame:update');
    };
    class_1.prototype.hideSelection = function (selectionHidden) {
        selectionHidden ? this.ie.hideSelection() : this.ie.showSelection();
        this.setState({ selectionHidden: selectionHidden });
    };
    class_1.prototype.slide = function (x, y, endX, endY) {
        this.ie.slide(endX - x, endY - y, true);
    };
    class_1.prototype.scaleStep = function (direction, x, y) {
        var scale = this.state.scale;
        scale += direction;
        if (scale < 0) {
            scale = 0;
        }
        else if (scale >= constants_1.presetScale.length) {
            scale = constants_1.presetScale.length - 1;
        }
        this.scale(scale, x, y);
        this.setState({ scale: scale });
    };
    class_1.prototype.scale = function (scale, x, y) {
        this.ie.scale(constants_1.presetScale[scale || this.state.scale], x, y);
        if (!x && !y) {
            this.center();
        }
    };
    class_1.prototype.center = function () {
        var _a = this.state, canvasComponentWidth = _a.canvasComponentWidth, canvasComponentHeight = _a.canvasComponentHeight;
        return this.ie.center(parseInt(canvasComponentWidth, 10), parseInt(canvasComponentHeight, 10));
    };
    class_1.prototype.toggleGrid = function () {
        this.ie.switchGrid(!this.state.grid);
        this.setState({ grid: !this.state.grid });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=drawing-mixin.js.map