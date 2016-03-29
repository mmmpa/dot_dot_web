"use strict";
var action_history_1 = require("./action-history");
var ImageEditor = (function () {
    function ImageEditor(stage, bitmap, bitmapData) {
        this.stage = stage;
        this.bitmap = bitmap;
        this.bitmapData = bitmapData;
        this._scale = 1;
        this.stage.onPress = function (e) { return console.log(e); };
    }
    ImageEditor.prototype.once = function (callback) {
        var store = { historyGroup: [] };
        callback(this.writeHistory(history), this);
        this.update();
        return store.historyGroup;
    };
    ImageEditor.prototype.scaleStep = function (n) {
        this.scale(this._scale + n);
    };
    ImageEditor.prototype.writeHistory = function (store) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            store.historyGroup = args;
        };
    };
    ImageEditor.prototype.scale = function (n) {
        this._scale = n;
        if (this._scale < 1) {
            this._scale = 1;
        }
        this.bitmap.scaleX = this.bitmap.scaleY = this._scale;
        this.stage.update();
    };
    ImageEditor.prototype.update = function () {
        console.log('update');
        this.bitmapData.updateContext();
        this.stage.update();
    };
    ImageEditor.prototype.setPixel = function (rawX, rawY, color, update) {
        var x = rawX / this._scale >> 0;
        var y = rawY / this._scale >> 0;
        var old = this.bitmapData.getPixel32(x, y);
        this.bitmapData.setPixel32(x, y, color);
        if (update) {
            this.update();
        }
        return new action_history_1.default('setPixel', { x: x, y: y, color: old }, { x: x, y: y, color: color });
    };
    ImageEditor.create = function (stage, w, h) {
        var bitmapData = new createjs.BitmapData(null, w, h, 0xffffffff);
        var bitmap = new createjs.Bitmap(bitmapData.canvas);
        stage.addChild(bitmap);
        return new ImageEditor(stage, bitmap, bitmapData);
    };
    return ImageEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image-editor.js.map