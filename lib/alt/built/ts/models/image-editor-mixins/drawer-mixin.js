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
        var old = this.canvasBitmapData.getPixel32(x, y);
        this.canvasBitmapData.setPixel32(x, y, color);
        if (update) {
            this.update();
        }
        return new action_history_1.default('setPixel', { x: x, y: y, color: old }, { x: x, y: y, color: color });
    };
    class_1.prototype.fill = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        this.canvasBitmapData.floodFill(x, y, color);
        update && this.update();
    };
    class_1.prototype.getPixel = function (rawX, rawY) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.canvasBitmapData.getPixel32(x, y);
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