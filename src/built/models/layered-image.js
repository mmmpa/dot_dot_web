"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var data_url_1 = require('./data-url');
var id_man_1 = require('../libs/id-man');
var data_url_editor_1 = require('./data-url-editor');
var gen = data_url_editor_1.default;
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
        this.select(0);
    }
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
    Object.defineProperty(LayeredImage.prototype, "joinedDataURL", {
        get: function () {
            return gen.joinDataURLs(this.dataURLs, this.width, this.height, true);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayeredImage.prototype, "layerCount", {
        get: function () {
            return this.dataURLs.length;
        },
        enumerable: true,
        configurable: true
    });
    LayeredImage.prototype.add = function (index) {
        var blank = gen.blankDataUrl(this.width, this.height);
        this.dataURLs.splice(index, 0, blank);
        this.select(index + 1);
    };
    LayeredImage.prototype.remove = function (index) {
        if (this.dataURLs.length === 1) {
            return;
        }
        this.dataURLs.splice(index, 1);
    };
    LayeredImage.prototype.moveUpward = function (index, callback) {
        if (index === 0) {
            return;
        }
        var target = this.raw(index);
        this.dataURLs.splice(index, 1);
        this.dataURLs.splice(index - 1, 0, target);
        callback && callback(index - 1);
    };
    LayeredImage.prototype.moveDownward = function (index, callback) {
        if (index === this.dataURLs.length - 1) {
            return;
        }
        var target = this.raw(index);
        this.dataURLs.splice(index, 1);
        this.dataURLs.splice(index + 1, 0, target);
        callback && callback(index + 1);
    };
    LayeredImage.prototype.select = function (index, force) {
        if (force === void 0) { force = false; }
        if (!force && this.selectedIndex === index) {
            return;
        }
        this.selectedIndex = index;
        if (index === 0) {
            this.overlay = null;
        }
        else {
            this.overlay = gen.combineDataURLs(this.dataURLs.slice(0, index), this.width, this.height);
        }
        if (index === this.dataURLs.length - 1) {
            this.underlay = null;
        }
        else {
            this.underlay = gen.combineDataURLs(this.dataURLs.slice(index + 1, this.dataURLs.length), this.width, this.height);
        }
        this.selected = this.raw(index);
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
        this.dataURLs[index].update(dataURL);
        this.version++;
    };
    LayeredImage.prototype.scale = function (n) {
        if (n === void 0) { n = 4; }
        return {
            width: this.width * n,
            height: this.height * n,
        };
    };
    LayeredImage.prototype.combine = function () {
        return gen.combineDataURLs(this.dataURLs, this.width, this.height);
    };
    LayeredImage.prototype.clone = function () {
        return new LayeredImage(this.width, this.height, this.dataURLs.map(function (d) { return new data_url_1.default(d.data); }));
    };
    LayeredImage.prototype.raw = function (index) {
        return this.dataURLs[index];
    };
    return LayeredImage;
}(id_man_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LayeredImage;
//# sourceMappingURL=layered-image.js.map