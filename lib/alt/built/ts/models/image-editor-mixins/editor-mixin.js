"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require("../image-editor");
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
        var result = this.doSelected(function (x, y, color) { return _this.draw(x, y, 0); });
        this.clearSelection();
        this.update();
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
        var result = this.doSelected(function (x, y, color) {
            clip.setPixel32(x, y, color);
            return _this.draw(x, y, 0);
        });
        this.clearSelection();
        this.update();
    };
    class_1.prototype.fixFloater = function () {
        if (!this.isFloating) {
            return;
        }
        var raw = image_editor_1.default.floaterBitmapData.context.getImageData(0, 0, this.width, this.height).data;
        var offsetX = image_editor_1.default.floater.x;
        var offsetY = image_editor_1.default.floater.y;
        for (var i = raw.length - 1; i >= 0; i -= 4) {
            if (raw[i] !== 0) {
                var position = (i - 3) / 4;
                var x = (position % this.width);
                var y = position / this.width >> 0;
                var color = image_editor_1.default.floaterBitmapData.getPixel32(x, y);
                this.canvasBitmapData.setPixel32(x + offsetX, y + offsetY, color);
            }
        }
        this.stateDrawing();
        this.canvasContainer.removeChild(this.floater);
        this.floater = null;
        this.canvasBitmapData.updateContext();
    };
    class_1.prototype.move = function (t, r, b, l) {
        console.log(this.isFloating);
        if (!this.isFloating) {
            return;
        }
        if (t)
            return this.moveTop(t);
        if (r)
            return this.moveRight(r);
        if (b)
            return this.moveBottom(b);
        if (l)
            return this.moveLeft(l);
    };
    class_1.prototype.moveTop = function (n) {
        image_editor_1.default.floater.y -= 1;
        this.update();
    };
    class_1.prototype.moveRight = function (n) {
        image_editor_1.default.floater.x += 1;
        this.update();
    };
    class_1.prototype.moveBottom = function (n) {
        image_editor_1.default.floater.y += 1;
        this.update();
    };
    class_1.prototype.moveLeft = function (n) {
        image_editor_1.default.floater.x -= 1;
        this.update();
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=editor-mixin.js.map