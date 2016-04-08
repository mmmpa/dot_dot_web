"use strict";
var action_history_1 = require("./action-history");
var ImageEditor = (function () {
    function ImageEditor(stage, width, height) {
        this.stage = stage;
        this.width = width;
        this.height = height;
        this._scale = 1;
        this._grid = false;
        this._gridElement = null;
        this._gridStore = [];
        this._gridColor = 0xff000000;
        this.container = new createjs.Container();
        this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0xffeeeeee).canvas);
        this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
        this.canvas = new createjs.Bitmap(this.bitmapData.canvas);
        this.container.addChild(this.canvas);
        stage.addChild(this.bg);
        stage.addChild(this.container);
    }
    ImageEditor.prototype.once = function (callback) {
        var store = { historyGroup: [] };
        callback(this.writeHistory(history), this);
        this.update();
        return store.historyGroup;
    };
    ImageEditor.prototype.startSlide = function () {
        var _this = this;
        var startX = this.container.x;
        var startY = this.container.y;
        return function (xRange, yRange) {
            _this.container.x = startX + xRange;
            _this.container.y = startY + yRange;
            _this.update();
        };
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
        this.container.removeChild(this._gridElement);
        if (!this._grid) {
            return;
        }
        var scale = this._scale;
        if (scale <= 2) {
            return;
        }
        if (this._gridElement = this._gridStore[scale]) {
            this.container.addChild(this._gridElement);
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
        this.container.addChild(this._gridElement);
        this.stage.update();
    };
    ImageEditor.prototype.scale = function (n) {
        this._scale = n;
        if (this._scale < 1) {
            this._scale = 1;
        }
        var _a = this.canvas.image, width = _a.width, height = _a.height;
        this.canvas.scaleX = this.canvas.scaleY = this._scale;
        this.drawGrid();
        this.stage.update();
    };
    ImageEditor.prototype.update = function () {
        this.bitmapData.updateContext();
        this.stage.update();
    };
    ImageEditor.prototype.normalizePixel = function (rawX, rawY) {
        var x = (rawX - this.container.x) / this._scale >> 0;
        var y = (rawY - this.container.y) / this._scale >> 0;
        return { x: x, y: y };
    };
    ImageEditor.prototype.setPixel = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var old = this.bitmapData.getPixel32(x, y);
        this.bitmapData.setPixel32(x, y, color);
        if (update) {
            this.update();
        }
        return new action_history_1.default('setPixel', { x: x, y: y, color: old }, { x: x, y: y, color: color });
    };
    ImageEditor.create = function (stage, w, h) {
        return new ImageEditor(stage, w, h);
    };
    return ImageEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image-editor.js.map