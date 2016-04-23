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
        this.selectedCount = 0;
        this.selectionColor = 0x2200ff00;
        this.id = ImageEditor.genId();
        this.container = new createjs.Container();
        this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01000000).canvas);
        if (imageElement) {
            this.bitmapData = new createjs.BitmapData(imageElement);
        }
        else {
            this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
        }
        this.width = this.bitmapData.width;
        this.height = this.bitmapData.height;
        this.selectionBitmap = new createjs.BitmapData(null, this.width, this.height);
        this.selection = new createjs.Bitmap(this.selectionBitmap.canvas);
        this.canvas = new createjs.Bitmap(this.bitmapData.canvas);
        this.container.addChild(this.canvas);
        this.container.addChild(this.selection);
        stage.addChild(this.bg);
        stage.addChild(this.container);
        this.update();
    }
    ImageEditor.genId = function () {
        return this.id++;
    };
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
    ImageEditor.prototype.slide = function (x, y, update) {
        this.container.x += x;
        this.container.y += y;
        update && this.update();
    };
    ImageEditor.prototype.posit = function (_a) {
        var x = _a.x, y = _a.y;
        this.container.x = x;
        this.container.y = y;
    };
    Object.defineProperty(ImageEditor.prototype, "position", {
        get: function () {
            return {
                x: this.container.x,
                y: this.container.y
            };
        },
        enumerable: true,
        configurable: true
    });
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
        this.container.x = (displayWidth - width) / 2;
        this.container.y = (displayHeight - height) / 2;
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
        this.selection.scaleX = this.selection.scaleY = this._scale;
        this.drawGrid();
        this.stage.update();
    };
    ImageEditor.prototype.update = function () {
        this.selectionBitmap.updateContext();
        this.bitmapData.updateContext();
        this.stage.update();
    };
    ImageEditor.prototype.normalizePixel = function (rawX, rawY) {
        var x = (rawX - this.container.x) / this._scale >> 0;
        var y = (rawY - this.container.y) / this._scale >> 0;
        return { x: x, y: y };
    };
    ImageEditor.prototype.isCellSelected = function (x, y) {
        return this.selectionBitmap.getPixel32(x, y) !== 0;
    };
    ImageEditor.prototype.isSelected = function () {
        return this.selectedCount !== 0;
    };
    ImageEditor.prototype.addSelection = function (x, y, add, update) {
        if (add === void 0) { add = true; }
        if (add) {
            if (!this.isCellSelected(x, y)) {
                this.selectedCount++;
                this.selectionBitmap.setPixel32(x, y, 0x5500ff00);
            }
        }
        else {
            if (this.isCellSelected(x, y)) {
                this.selectedCount--;
                this.selectionBitmap.setPixel32(x, y, 0);
            }
        }
        if (update) {
            this.update();
        }
    };
    ImageEditor.prototype.draw = function (x, y, color, update) {
        if (this.isSelected()) {
            if (!this.isCellSelected(x, y)) {
                return;
            }
        }
        var old = this.bitmapData.getPixel32(x, y);
        this.bitmapData.setPixel32(x, y, color);
        if (update) {
            this.update();
        }
        return new action_history_1.default('setPixel', { x: x, y: y, color: old }, { x: x, y: y, color: color });
    };
    ImageEditor.prototype.showSelection = function () {
        this.selection.visible = true;
        this.update();
    };
    ImageEditor.prototype.hideSelection = function () {
        this.selection.visible = false;
        this.update();
    };
    ImageEditor.prototype.setSelection = function (rawX, rawY, add, update) {
        if (add === void 0) { add = true; }
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.addSelection(x, y, add, update);
    };
    ImageEditor.prototype.setSelectionPixelToPixel = function (rawX, rawY, endRawX, endRawY, add, update) {
        var _this = this;
        if (add === void 0) { add = true; }
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var end = this.normalizePixel(endRawX, endRawY);
        ImageEditor.pToP(x, y, end.x, end.y).map(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.addSelection(x, y, add);
        });
        update && this.update();
    };
    ImageEditor.prototype.setPixel = function (rawX, rawY, color, update) {
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        return this.draw(x, y, color, update);
    };
    ImageEditor.prototype.setPixelToPixel = function (rawX, rawY, endRawX, endRawY, color, update) {
        var _this = this;
        var _a = this.normalizePixel(rawX, rawY), x = _a.x, y = _a.y;
        var end = this.normalizePixel(endRawX, endRawY);
        var points = ImageEditor.pToP(x, y, end.x, end.y);
        var histories = points.map(function (_a) {
            var x = _a.x, y = _a.y;
            return _this.draw(x, y, color);
        });
        update && this.update();
        return histories;
    };
    ImageEditor.create = function (stage, w, h, imageElement) {
        return new ImageEditor(stage, w, h, imageElement);
    };
    ImageEditor.pToP = function (x, y, endX, endY) {
        var points = [];
        var moveX = x - endX;
        var moveY = y - endY;
        var getSupport = function (n) {
            var minus = function (i) { return i - 1; };
            var plus = function (i) { return i + 1; };
            return n < 0 ? plus : minus;
        };
        if (moveX !== 0 || moveY !== 0) {
            var power = moveY / moveX;
            var xSupport = getSupport(moveX);
            for (var i = moveX; i; i = xSupport(i)) {
                points.push({ x: x - i, y: Math.round(y - i * power) });
            }
            var ySupport = getSupport(moveY);
            for (var i = moveY; i; i = ySupport(i)) {
                points.push({ x: Math.round(x - i / power), y: y - i });
            }
        }
        return points;
    };
    ImageEditor.id = 0;
    return ImageEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image-editor.js.map