"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var action_history_1 = require("../action-history");
var image_editor_1 = require("../image-editor");
exports.Drawing = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.draw = function (x, y, color, update) {
        this.fixFloater();
        if (this.isSelected) {
            if (!this.isCellSelected(x, y)) {
                return;
            }
        }
        var old = this.bitmapData.getPixel32(x, y);
        this.bitmapData.setPixel32(x, y, color);
        if (update) {
            this.update();
        }
        console.log(old, color);
        return new action_history_1.default('setPixel', { x: x, y: y, color: old }, { x: x, y: y, color: color });
    };
    class_1.prototype.fill = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var targetColor = this.bitmapData.getPixel32(x, y);
        if (targetColor === color) {
            return;
        }
        this.fillLine(x, y, targetColor, color);
        update && this.update();
    };
    class_1.prototype.fillLine = function (x, y, targetColor, color, from) {
        if (from === void 0) { from = 0; }
        this.bitmapData.setPixel32(x, y, color);
        for (var fx = x + 1; fx < this.width && this.bitmapData.getPixel32(fx, y) === targetColor; fx++) {
            this.bitmapData.setPixel32(fx, y, color);
            this.fillLineUpDown(fx, y, targetColor, color, from);
        }
        for (var fx = x - 1; fx >= 0 && this.bitmapData.getPixel32(fx, y) === targetColor; fx--) {
            this.bitmapData.setPixel32(fx, y, color);
            this.fillLineUpDown(fx, y, targetColor, color, from);
        }
    };
    class_1.prototype.fillLineUpDown = function (x, y, targetColor, color, from) {
        if (from === void 0) { from = 0; }
        if (from !== -1 && y - 1 >= 0 && this.bitmapData.getPixel32(x, y - 1) === targetColor) {
            this.fillLine(x, y - 1, targetColor, color, 0);
        }
        if (from !== 1 && y + 1 <= this.height && this.bitmapData.getPixel32(x, y + 1) === targetColor) {
            this.fillLine(x, y + 1, targetColor, color, 0);
        }
    };
    class_1.prototype.setPixel = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.draw(x, y, color, update);
    };
    class_1.prototype.setPixelToPixel = function (rawX, rawY, endRawX, endRawY, color, update) {
        var _this = this;
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var end = this.normalizePixel(endRawX, endRawY);
        var points = image_editor_1.default.pToP(x, y, end.x, end.y);
        var histories = points.map(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.draw(x, y, color);
        });
        update && this.update();
        return histories;
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=drawer-mixin.js.map