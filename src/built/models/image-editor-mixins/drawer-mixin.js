"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require('../image-editor');
exports.Drawing = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.fill = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var updated = this.canvasBitmapData.floodFill(x, y, color);
        this.stockPixels(updated);
        update && this.update();
    };
    class_1.prototype.getPixel = function (rawX, rawY) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.canvasBitmapData.getPixel32(x, y);
    };
    class_1.prototype.draw = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.setPixel(x, y, color, update);
    };
    class_1.prototype.drawPixelToPixel = function (rawX, rawY, endRawX, endRawY, setColor, update, stock) {
        var _this = this;
        if (update === void 0) { update = false; }
        if (stock === void 0) { stock = true; }
        var _a = this.normalizePixel(rawX, rawY), beginX = _a.x, beginY = _a.y;
        var _b = this.normalizePixel(endRawX, endRawY), endX = _b.x, endY = _b.y;
        var points = image_editor_1.default.pToP(beginX, beginY, endX, endY);
        var updated = points.map(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.setPixel(x, y, setColor, false, false);
        }).reverse();
        update && this.update();
        if (stock) {
            image_editor_1.default.history.stockPrevious({
                up: function () {
                    updated.forEach(function (_a) {
                        var x = _a.x, y = _a.y, color = _a.color;
                        return _this.setPixel(x, y, color, false, false);
                    });
                },
                down: function () {
                    updated.forEach(function (_a) {
                        var x = _a.x, y = _a.y, oldColor = _a.oldColor;
                        return _this.setPixel(x, y, oldColor, false, false);
                    });
                },
            });
        }
    };
    class_1.prototype.isDrawable = function (x, y) {
        return !this.isSelected || this.isCellSelected(x, y);
    };
    class_1.prototype.setPixel = function (x, y, color, update, stock, fix) {
        if (update === void 0) { update = false; }
        if (stock === void 0) { stock = true; }
        if (fix === void 0) { fix = true; }
        if (fix && this.fixFloater()) {
            return;
        }
        if (!this.isDrawable) {
            return;
        }
        var oldColor = this.canvasBitmapData.getPixel32(x, y);
        this.canvasBitmapData.setPixel32(x, y, color);
        var updated = { x: x, y: y, color: color, oldColor: oldColor };
        stock && this.stockPixels([updated]);
        update && this.update();
        return updated;
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=drawer-mixin.js.map