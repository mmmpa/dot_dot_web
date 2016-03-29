"use strict";
var ImageEditor = (function () {
    function ImageEditor(data) {
        this.data = data;
    }
    ImageEditor.create = function (stage, w, h) {
        var data = new createjs.BitmapData(null, 100, 100, 0xffffffff);
        var bmp = new createjs.Bitmap(data.canvas);
        stage.addChild(bmp);
        return new ImageEditor(data);
    };
    return ImageEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image.js.map