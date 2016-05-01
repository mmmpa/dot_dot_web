"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require("../image-editor");
exports.Selection = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.doSelected = function (callback) {
        if (!this.isSelected) {
            return;
        }
        var result = [];
        var raw = this.selectionBitmap.context.getImageData(0, 0, this.width, this.height).data;
        for (var i = raw.length - 1; i >= 0; i -= 4) {
            if (raw[i] !== 0) {
                var position = (i - 3) / 4;
                var x = (position % this.width);
                var y = position / this.width >> 0;
                var color = this.bitmapData.getPixel32(x, y);
                result.push(callback(x, y, color));
            }
        }
        return result;
    };
    class_1.prototype.clearSelection = function (nextStateCallback) {
        this.selectedCount = 0;
        this.selectionBitmap.clearRect(0, 0, this.width, this.height);
        this.selectionBitmap.setPixel(0, 0, 0);
        nextStateCallback ? nextStateCallback() : this.stateDrawing();
    };
    class_1.prototype.addSelection = function (x, y, add, update) {
        if (add === void 0) { add = true; }
        this.fixFloater();
        if (add) {
            if (!this.isCellSelected(x, y)) {
                this.selectedCount++;
                this.selectionBitmap.setPixel32(x, y, this.selectionColor);
            }
        }
        else {
            if (this.isCellSelected(x, y)) {
                this.selectedCount--;
                this.selectionBitmap.setPixel32(x, y, 0);
            }
        }
        this.checkSelected();
        if (update) {
            this.update();
        }
    };
    class_1.prototype.isCellSelected = function (x, y) {
        return this.selectionBitmap.getPixel32(x, y) !== 0;
    };
    class_1.prototype.checkSelected = function () {
        if (this.selectedCount !== 0) {
            this.stateSelected();
        }
        else {
            this.stateDrawing();
        }
    };
    class_1.prototype.showSelection = function () {
        this.selection.visible = true;
        this.update();
    };
    class_1.prototype.hideSelection = function () {
        this.selection.visible = false;
        this.update();
    };
    class_1.prototype.normalizeStart = function (start, end) {
        if (start < end) {
            return { start: start, end: end };
        }
        else {
            return { start: end, end: start };
        }
    };
    class_1.prototype.setRectangleSelection = function (startX, startY, endX, endY) {
        this.clearSelection();
        var start = this.normalizePixel(startX, startY);
        var end = this.normalizePixel(endX, endY);
        var x = this.normalizeStart(start.x, end.x);
        var y = this.normalizeStart(start.y, end.y);
        for (var i = x.end; i >= x.start; i--) {
            for (var ii = y.end; ii >= y.start; ii--) {
                this.addSelection(i, ii, true);
            }
        }
        this.update();
    };
    class_1.prototype.setSelection = function (rawX, rawY, add, update) {
        if (add === void 0) { add = true; }
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.addSelection(x, y, add, update);
    };
    class_1.prototype.setSelectionPixelToPixel = function (rawX, rawY, endRawX, endRawY, add, update) {
        var _this = this;
        if (add === void 0) { add = true; }
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var end = this.normalizePixel(endRawX, endRawY);
        image_editor_1.default.pToP(x, y, end.x, end.y).map(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.addSelection(x, y, add);
        });
        update && this.update();
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=selection-mixin.js.map