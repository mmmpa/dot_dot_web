"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
exports.Display = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.center = function (displayWidth, displayHeight) {
        var _a = this, width = _a.width, height = _a.height;
        width *= this._scale;
        height *= this._scale;
        this.container.x = (displayWidth - width) / 2;
        this.container.y = (displayHeight - height) / 2;
        this.update();
    };
    class_1.prototype.scale = function (n, baseX, baseY) {
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
        this.canvasContainer.scaleX = this.canvasContainer.scaleY = this._scale;
        this.selection.scaleX = this.selection.scaleY = this._scale;
        this.drawGrid();
        this.stage.update();
    };
    class_1.prototype.drawGrid = function () {
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
    class_1.prototype.switchGrid = function (bol) {
        if (this._grid === bol) {
            return;
        }
        this._grid = bol;
        this.drawGrid();
        this.stage.update();
    };
    class_1.prototype.slide = function (x, y, update) {
        this.container.x += x;
        this.container.y += y;
        update && this.update();
    };
    class_1.prototype.posit = function (_a) {
        var x = _a.x, y = _a.y;
        this.container.x = x;
        this.container.y = y;
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=display-mixin.js.map