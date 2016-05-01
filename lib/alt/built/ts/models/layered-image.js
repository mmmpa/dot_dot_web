"use strict";
var LayeredImage = (function () {
    function LayeredImage(width, height, images, version) {
        if (version === void 0) { version = 0; }
        this.width = width;
        this.height = height;
        this.images = images;
        this.version = version;
        this.id = LayeredImage.genId();
    }
    LayeredImage.genId = function () {
        return this.id++;
    };
    LayeredImage.prototype.update = function (index, dataUrl) {
        this.images[index] = dataUrl;
        this.version++;
    };
    LayeredImage.prototype.scale = function (n) {
        if (n === void 0) { n = 4; }
        return {
            width: this.width * n,
            height: this.height * n
        };
    };
    LayeredImage.prototype.image = function (index) {
        var element = document.createElement('img');
        element.setAttribute('src', this.raw(index));
        return element;
    };
    LayeredImage.prototype.raw = function (index) {
        return this.images[index];
    };
    LayeredImage.id = 0;
    return LayeredImage;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LayeredImage;
//# sourceMappingURL=layered-image.js.map