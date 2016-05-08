"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
exports.ClipBoardMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.clearClip = function () {
        this.floaterBitmapData && this.floaterBitmapData.dispose();
        this.floaterBitmapData = null;
    };
    class_1.prepareClip = function (w, h) {
        this.floaterBitmapData && this.floaterBitmapData.dispose();
        this.floaterBitmapData = new createjs.BitmapData(null, w, h);
        return this.floaterBitmapData;
    };
    class_1.prepareFloater = function () {
        if (!this.floaterBitmapData) {
            return null;
        }
        this.floaterBitmapData.updateContext();
        this.floater = new createjs.Bitmap(this.floaterBitmapData.canvas);
        this.floater.shadow = new createjs.Shadow("#ff0000", 2, 2, 0);
        return this.floater;
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=clip-board-mixin.js.map