"use strict";
var DataUrlGenerator = (function () {
    function DataUrlGenerator() {
        this.img = document.createElement('img');
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
    }
    DataUrlGenerator.prototype.blankDataUrl = function (w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.context.clearRect(0, 0, w, h);
        return this.canvas.toDataURL();
    };
    DataUrlGenerator.prototype.trimmer = function (image, baseWidth, baseHeight) {
        var _this = this;
        this.canvas.width = baseWidth;
        this.canvas.height = baseHeight;
        return function (offsetX, offsetY) {
            _this.context.drawImage(image, offsetX, offsetY, baseWidth, baseHeight, 0, 0, baseWidth, baseHeight);
            return _this.canvas.toDataURL();
        };
    };
    return DataUrlGenerator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataUrlGenerator;
//# sourceMappingURL=data-url-generator.js.map