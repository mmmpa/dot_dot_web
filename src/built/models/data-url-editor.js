"use strict";
var data_url_1 = require("./data-url");
var DataURLEditor = (function () {
    function DataURLEditor() {
    }
    Object.defineProperty(DataURLEditor, "img", {
        get: function () {
            if (!this._img) {
                this._img = document.createElement('img');
            }
            return this._img;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataURLEditor, "canvas", {
        get: function () {
            if (!this._canvas) {
                this._canvas = document.createElement('canvas');
            }
            return this._canvas;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DataURLEditor, "context", {
        get: function () {
            if (!this._context) {
                this._context = this.canvas.getContext("2d");
            }
            return this._context;
        },
        enumerable: true,
        configurable: true
    });
    DataURLEditor.blankDataUrl = function (w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.context.clearRect(0, 0, w, h);
        return new data_url_1.default(this.canvas.toDataURL());
    };
    DataURLEditor.imageToCanvas = function (image, w, h, top, left) {
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
    };
    DataURLEditor.fromImage = function (image, w, h, top, left) {
        if (top === void 0) { top = 0; }
        if (left === void 0) { left = 0; }
        return new data_url_1.default(this.imageToCanvas(image, w, h, top, left).toDataURL());
    };
    DataURLEditor.combineImages = function (images, w, h) {
        var _this = this;
        this.canvas.width = w;
        this.canvas.height = h;
        this.context.clearRect(0, 0, w, h);
        images.reverse().forEach(function (image) {
            _this.context.drawImage(image, 0, 0, w, h, 0, 0, w, h);
        });
        return new data_url_1.default(this.canvas.toDataURL());
    };
    DataURLEditor.combineDataURLs = function (dataURLs, w, h) {
        var _this = this;
        var images = dataURLs.map(function (d) { return _this.convertToImage(d); });
        return this.combineImages(images, w, h);
    };
    DataURLEditor.trimmer = function (image, baseWidth, baseHeight) {
        var _this = this;
        this.canvas.width = baseWidth;
        this.canvas.height = baseHeight;
        return function (offsetX, offsetY) {
            _this.context.clearRect(0, 0, baseWidth, baseHeight);
            _this.context.drawImage(image, offsetX, offsetY, baseWidth, baseHeight, 0, 0, baseWidth, baseHeight);
            return new data_url_1.default(_this.canvas.toDataURL());
        };
    };
    DataURLEditor.join = function (images, baseWidth, baseHeight) {
        var _this = this;
        var length = images.length;
        this.canvas.width = baseWidth * length;
        this.canvas.height = baseHeight;
        images.forEach(function (image, i) {
            _this.context.drawImage(image, 0, 0, baseWidth, baseHeight, baseWidth * i, 0, baseWidth, baseHeight);
        });
        return new data_url_1.default(this.canvas.toDataURL());
    };
    DataURLEditor.joinDataURLs = function (dataURLs, baseWidth, baseHeight, vertical) {
        var _this = this;
        if (vertical === void 0) { vertical = false; }
        var length = dataURLs.length;
        var images = dataURLs.map(function (d) { return _this.convertToImage(d); });
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
        return new data_url_1.default(this.canvas.toDataURL());
    };
    DataURLEditor.convertToImage = function (dataURL) {
        if (!dataURL) {
            return;
        }
        var element = document.createElement('img');
        element.setAttribute('src', dataURL.data);
        return element;
    };
    return DataURLEditor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataURLEditor;
//# sourceMappingURL=data-url-editor.js.map