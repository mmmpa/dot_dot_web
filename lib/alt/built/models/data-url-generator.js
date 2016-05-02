"use strict";
var DataURLGenerator = (function () {
    function DataURLGenerator() {
        this.img = document.createElement('img');
        this.canvas = document.createElement('canvas');
        this.context = this.canvas.getContext("2d");
    }
    DataURLGenerator.prototype.blankDataUrl = function (w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.context.clearRect(0, 0, w, h);
        return this.canvas.toDataURL();
    };
    DataURLGenerator.prototype.fromImage = function (image, w, h, top, left) {
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        var trimX = 0;
        var trimY = 0;
        var offsetX = left;
        var offsetY = top;
        if (offsetX < 0) {
            trimX = -offsetX;
            offsetX = 0;
        }
        if (offsetY < 0) {
            trimY = -offsetY;
            offsetY = 0;
        }
        this.canvas.width = w;
        this.canvas.height = h;
        this.context.clearRect(0, 0, w, h);
        this.context.drawImage(image, trimX, trimY, w, h, offsetX, offsetY, w, h);
        return this.canvas.toDataURL();
    };
    DataURLGenerator.prototype.combineImages = function (images, w, h) {
        var _this = this;
        this.canvas.width = w;
        this.canvas.height = h;
        this.context.clearRect(0, 0, w, h);
        images.reverse().forEach(function (image) {
            _this.context.drawImage(image, 0, 0, w, h, 0, 0, w, h);
        });
        return this.canvas.toDataURL();
    };
    DataURLGenerator.prototype.trimmer = function (image, baseWidth, baseHeight) {
        var _this = this;
        this.canvas.width = baseWidth;
        this.canvas.height = baseHeight;
        return function (offsetX, offsetY) {
            _this.context.clearRect(0, 0, baseWidth, baseHeight);
            _this.context.drawImage(image, offsetX, offsetY, baseWidth, baseHeight, 0, 0, baseWidth, baseHeight);
            return _this.canvas.toDataURL();
        };
    };
    DataURLGenerator.prototype.join = function (images, baseWidth, baseHeight) {
        var _this = this;
        var length = images.length;
        this.canvas.width = baseWidth * length;
        this.canvas.height = baseHeight;
        images.forEach(function (image, i) {
            _this.context.drawImage(image, 0, 0, baseWidth, baseHeight, baseWidth * i, 0, baseWidth, baseHeight);
        });
        return this.canvas.toDataURL();
    };
    DataURLGenerator.prototype.joinFromImageElements = function (images, baseWidth, baseHeight, vertical) {
        var _this = this;
        if (vertical === void 0) { vertical = false; }
        var length = images.length;
        if (vertical) {
            this.canvas.width = baseWidth;
            this.canvas.height = baseHeight * length;
            images.forEach(function (image, i) {
                _this.context.drawImage(image, 0, 0, baseWidth, baseHeight, 0, baseHeight * i, baseWidth, baseHeight);
            });
        }
        else {
            this.canvas.width = baseWidth * length;
            this.canvas.height = baseHeight;
            images.forEach(function (image, i) {
                _this.context.drawImage(image, 0, 0, baseWidth, baseHeight, baseWidth * i, 0, baseWidth, baseHeight);
            });
        }
        return this.canvas.toDataURL();
    };
    return DataURLGenerator;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataURLGenerator;
//# sourceMappingURL=data-url-generator.js.map