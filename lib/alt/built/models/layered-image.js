"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var id_man_1 = require("../libs/id-man");
var data_url_generator_1 = require("./data-url-generator");
var gen = new data_url_generator_1.default();
var LayeredImage = (function (_super) {
    __extends(LayeredImage, _super);
    function LayeredImage(width, height, dataURLs, version) {
        if (version === void 0) { version = 0; }
        _super.call(this);
        this.width = width;
        this.height = height;
        this.dataURLs = dataURLs;
        this.version = version;
        this.locked = false;
        this.selectedIndex = 0;
    }
    LayeredImage.prototype.add = function (index) {
        var blank = gen.blankDataUrl(this.width, this.height);
        this.dataURLs.splice(index, 0, blank);
    };
    LayeredImage.prototype.remove = function (index) {
        if (this.dataURLs.length === 1) {
            return;
        }
        this.dataURLs.splice(index, 1);
    };
    LayeredImage.prototype.select = function (index) {
        this.selectedIndex = index;
        if (index === 0) {
            this.up = null;
        }
        else {
        }
        if (index === this.dataURLs.length - 1) {
            this.down = null;
        }
        else {
        }
        return this.raw(index);
    };
    LayeredImage.prototype.lock = function () {
        this.storedCombined = this.combine();
        this.locked = true;
    };
    LayeredImage.prototype.unlock = function () {
        this.storedCombined = null;
        this.locked = false;
    };
    LayeredImage.prototype.update = function (index, dataURL) {
        this.dataURLs[index] = dataURL;
        this.version++;
    };
    LayeredImage.prototype.scale = function (n) {
        if (n === void 0) { n = 4; }
        return {
            width: this.width * n,
            height: this.height * n
        };
    };
    Object.defineProperty(LayeredImage.prototype, "combined", {
        get: function () {
            if (this.locked) {
                return this.storedCombined;
            }
            return this.combine();
        },
        enumerable: true,
        configurable: true
    });
    LayeredImage.prototype.combine = function () {
        var _this = this;
        return gen.combineImages(this.dataURLs.map(function (dataURL) { return _this.genImage(dataURL); }), this.width, this.height);
    };
    LayeredImage.prototype.genImage = function (dataURL) {
        var element = document.createElement('img');
        element.setAttribute('src', dataURL);
        return element;
    };
    LayeredImage.prototype.image = function (index) {
        return this.genImage(this.raw(index));
    };
    LayeredImage.prototype.raw = function (index) {
        return this.dataURLs[index];
    };
    return LayeredImage;
}(id_man_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LayeredImage;
//# sourceMappingURL=layered-image.js.map