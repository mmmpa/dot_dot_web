"use strict";
var action_history_1 = require("./action-history");
var ImageEditor = (function () {
    function ImageEditor(stage, width, height, imageElement) {
        this.stage = stage;
        this.width = width;
        this.height = height;
        this._scale = 1;
        this._grid = false;
        this._gridElement = null;
        this._gridStore = [];
        this._gridColor = 0xff000000;
        this.container = new createjs.Container();
        this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01ffffff).canvas);
        if (imageElement) {
            this.bitmapData = new createjs.BitmapData(imageElement);
        }
        else {
            this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
        }
        this.canvas = new createjs.Bitmap(this.bitmapData.canvas);
        this.container.addChild(this.canvas);
        stage.addChild(this.bg);
        stage.addChild(this.container);
    }
    ImageEditor.prototype.close = function () {
        this.stage.clear();
        this.stage.removeAllChildren();
    };
    ImageEditor.prototype.once = function (callback) {
        var store = { historyGroup: [] };
        callback(this.writeHistory(history), this);
        this.update();
        return store.historyGroup;
    };
    ImageEditor.prototype.exportPng = function () {
        return this.bitmapData.canvas.toDataURL("image/png");
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
        this.stage.update();
    };
    ImageEditor.prototype.drawGrid = function () {
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
        this._gridElement = new createjs.Shape();
        var g = this._gridElement.graphics;
        g.setStrokeStyle(0);
        g.beginStroke('rgba(0,0,0,0.1)');
        this._gridStore[scale] = this._gridElement;
        _.times(height + 1, function (h) {
            var y = h * scale - 0.5;
            g.moveTo(-0.5, y);
            g.lineTo(width * scale - 0.5, y);
        });
        _.times(width + 1, function (w) {
            var x = w * scale - 0.5;
            g.moveTo(x, -0.5);
            g.lineTo(x, height * scale - 0.5);
        });
        this.container.addChild(this._gridElement);
        this.stage.update();
    };
    ImageEditor.prototype.center = function (displayWidth, displayHeight) {
        var _a = this, width = _a.width, height = _a.height;
        width *= this._scale;
        height *= this._scale;
        this.container.x = (displayWidth - width) / 2 >> 0;
        this.container.y = (displayHeight - height) / 2 >> 0;
        this.update();
    };
    ImageEditor.prototype.scale = function (n, baseX, baseY) {
        if (baseX && baseY) {
            var prePosition = this.normalizePixel(baseX, baseY);
            this._scale = n;
            var nextPosition = this.normalizePixel(baseX, baseY);
            var x = prePosition.x - nextPosition.x;
            var y = prePosition.y - nextPosition.y;
            this.container.x -= x * this._scale;
            this.container.y -= y * this._scale;
        }
        else {
            this._scale = n;
        }
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
    ImageEditor.create = function (stage, w, h, imageElement) {
        return new ImageEditor(stage, w, h, imageElement);
    };
    return ImageEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image-editor.js.map