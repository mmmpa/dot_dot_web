"use strict";
var action_history_1 = require("./action-history");
var ImageEditor = (function () {
    function ImageEditor(stage, _canvasElement, bitmapData) {
        this.stage = stage;
        this._canvasElement = _canvasElement;
        this.bitmapData = bitmapData;
        this._scale = 1;
        this._grid = false;
        this._gridElement = null;
        this._gridStore = [];
        this._gridColor = 0xff000000;
        this.stage.onPress = function (e) { return console.log(e); };
    }
    ImageEditor.prototype.once = function (callback) {
        var store = { historyGroup: [] };
        callback(this.writeHistory(history), this);
        this.update();
        return store.historyGroup;
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
    ImageEditor.prototype.switchGrid = function (bol) {
        if (this._grid === bol) {
            return;
        }
        this._grid = bol;
        this.drawGrid();
    };
    ImageEditor.prototype.drawGrid = function () {
        var _this = this;
        this.stage.removeChild(this._gridElement);
        if (!this._grid) {
            return;
        }
        var scale = this._scale;
        if (this._gridElement = this._gridStore[scale]) {
            this.stage.addChild(this._gridElement);
            this.stage.update();
            return;
        }
        var _a = this.bitmapData, width = _a.width, height = _a.height;
        var bitmapData = new createjs.BitmapData(null, width * scale, height * scale, 0x01000000);
        this._gridElement = new createjs.Bitmap(bitmapData.canvas);
        this._gridStore[scale] = this._gridElement;
        _.times(height, function (h) {
            _.times(width, function (w) {
                bitmapData.setPixel32(w * scale, h * scale, _this._gridColor);
            });
        });
        bitmapData.updateContext();
        this.stage.addChild(this._gridElement);
        this.stage.update();
    };
    ImageEditor.prototype.scale = function (n) {
        this._scale = n;
        if (this._scale < 1) {
            this._scale = 1;
        }
        var _a = this._canvasElement.image, width = _a.width, height = _a.height;
        this._canvasElement.scaleX = this._canvasElement.scaleY = this._scale;
        this.drawGrid();
        this.stage.update();
    };
    ImageEditor.prototype.update = function () {
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