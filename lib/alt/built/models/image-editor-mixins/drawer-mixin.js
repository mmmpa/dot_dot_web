"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require("../image-editor");
exports.Drawing = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.draw = function (x, y, color, update, stock) {
        var _this = this;
        if (update === void 0) { update = false; }
        if (stock === void 0) { stock = true; }
        this.fixFloater();
        if (this.isSelected) {
            if (!this.isCellSelected(x, y)) {
                return;
            }
        }
        var oldColor = this.canvasBitmapData.getPixel32(x, y);
        this.canvasBitmapData.setPixel32(x, y, color);
        if (update) {
            this.update();
        }
        if (stock) {
            image_editor_1.default.history.stock({
                up: function () {
                    _this.draw(x, y, color, true, false);
                },
                down: function () {
                    _this.draw(x, y, oldColor, true, false);
                }
            });
        }
        return { x: x, y: y, color: color, oldColor: oldColor };
    };
    class_1.prototype.fill = function (rawX, rawY, color, update) {
        var _this = this;
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var old = this.canvasBitmapData.getPixel32(x, y);
        var updated = this.canvasBitmapData.floodFill(x, y, color);
        if (!!updated && updated.length > 0) {
            update && this.update();
            image_editor_1.default.history.stock({
                up: function () {
                    updated.forEach(function (_a) {
                        var x = _a.x, y = _a.y;
                        return _this.draw(x, y, color, false, false);
                    });
                    _this.update();
                },
                down: function () {
                    updated.forEach(function (_a) {
                        var x = _a.x, y = _a.y;
                        return _this.draw(x, y, old, false, false);
                    });
                    _this.update();
                }
            });
        }
    };
    class_1.prototype.getPixel = function (rawX, rawY) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.canvasBitmapData.getPixel32(x, y);
    };
    class_1.prototype.setPixel = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.draw(x, y, color, update);
    };
    class_1.prototype.setPixelToPixel = function (rawX, rawY, endRawX, endRawY, color, update, stock) {
        var _this = this;
        if (update === void 0) { update = false; }
        if (stock === void 0) { stock = true; }
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var end = this.normalizePixel(endRawX, endRawY);
        var points = image_editor_1.default.pToP(x, y, end.x, end.y);
        var histories = points.map(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.draw(x, y, color, false, false);
        }).reverse();
        update && this.update();
        if (stock) {
            image_editor_1.default.history.stockPrevious({
                up: function () {
                    histories.forEach(function (_a) {
                        var x = _a.x, y = _a.y, color = _a.color;
                        return _this.draw(x, y, color, false, false);
                    });
                    _this.update();
                },
                down: function () {
                    histories.forEach(function (_a) {
                        var x = _a.x, y = _a.y, oldColor = _a.oldColor;
                        return _this.draw(x, y, oldColor, false, false);
                    });
                    _this.update();
                }
            });
        }
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=drawer-mixin.js.map