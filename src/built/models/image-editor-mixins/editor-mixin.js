"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require('../image-editor');
exports.Editor = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.del = function () {
        var _this = this;
        if (!this.isSelected) {
            return;
        }
        var updated = this.doSelected(function (x, y, color) { return _this.setPixel(x, y, 0, false, false); });
        this.clearSelection();
        this.update();
        this.stockPixels(updated);
    };
    class_1.prototype.copy = function () {
        if (!this.isSelected) {
            return;
        }
        var clip = image_editor_1.default.prepareClip(this.width, this.height);
        this.doSelected(function (x, y, color) { return clip.setPixel32(x, y, color); });
        this.update();
    };
    class_1.prototype.paste = function () {
        this.clearSelection(function () { return null; });
        this.fixFloater();
        this.floater = image_editor_1.default.prepareFloater();
        if (!this.floater) {
            return;
        }
        this.canvasContainer.addChild(this.floater);
        this.stateFloating();
        this.update();
    };
    class_1.prototype.cut = function () {
        var _this = this;
        if (!this.isSelected) {
            return;
        }
        var clip = image_editor_1.default.prepareClip(this.width, this.height);
        var updated = this.doSelected(function (x, y, color) {
            clip.setPixel32(x, y, color);
            return _this.setPixel(x, y, 0, false, false);
        });
        this.clearSelection();
        this.update();
        this.stockPixels(updated);
    };
    class_1.prototype.fixFloater = function () {
        if (!this.isFloating) {
            return false;
        }
        var raw = image_editor_1.default.floaterBitmapData.context.getImageData(0, 0, this.width, this.height).data;
        var offsetX = image_editor_1.default.floater.x;
        var offsetY = image_editor_1.default.floater.y;
        var updated = [];
        for (var i = raw.length - 1; i >= 0; i -= 4) {
            if (raw[i] !== 0) {
                var position = (i - 3) / 4;
                var x = (position % this.width);
                var y = position / this.width >> 0;
                var color = image_editor_1.default.floaterBitmapData.getPixel32(x, y);
                updated.push(this.setPixel(x + offsetX, y + offsetY, color, false, false, false));
            }
        }
        this.stateDrawing();
        this.canvasContainer.removeChild(this.floater);
        this.floater = null;
        this.stockPixels(updated);
        this.update();
        return true;
    };
    class_1.prototype.move = function (t, r, b, l) {
        if (!this.isFloating) {
            return;
        }
        switch (true) {
            case t !== 0:
                return this.moveTop(t);
            case r !== 0:
                return this.moveRight(r);
            case b !== 0:
                return this.moveBottom(b);
            case l !== 0:
                return this.moveLeft(l);
            default:
                return;
        }
    };
    class_1.prototype.moveTop = function (n) {
        image_editor_1.default.floater.y += n;
        this.update();
    };
    class_1.prototype.moveRight = function (n) {
        image_editor_1.default.floater.x += n;
        this.update();
    };
    class_1.prototype.moveBottom = function (n) {
        image_editor_1.default.floater.y += n;
        this.update();
    };
    class_1.prototype.moveLeft = function (n) {
        image_editor_1.default.floater.x += n;
        this.update();
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=editor-mixin.js.map