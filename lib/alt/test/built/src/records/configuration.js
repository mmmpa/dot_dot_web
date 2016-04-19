"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var plate_1 = require("../libs/plate");
var argb_1 = require("../models/argb");
var color_set_1 = require("../models/color-set");
var Configuration = (function (_super) {
    __extends(Configuration, _super);
    function Configuration() {
        _super.call(this, 'dot-dot-configuration');
    }
    Configuration.prototype.set_selectedColor = function (value) {
        this.writeRaw('selectedColor', value.toJson());
    };
    Configuration.prototype.get_selectedColor = function () {
        var _a = this.readRaw('selectedColor'), a = _a.a, r = _a.r, g = _a.g, b = _a.b;
        return new argb_1.default(a, r, g, b);
    };
    Configuration.prototype.set_colors = function (value) {
        this.writeRaw('colors', value.map(function (c) { return c.toJson(); }));
    };
    Configuration.prototype.get_colors = function () {
        return this.readRaw('colors').map(function (_a) {
            var a = _a.a, r = _a.r, g = _a.g, b = _a.b;
            return new argb_1.default(a, r, g, b);
        });
    };
    Configuration.prototype.set_colorSet = function (value) {
        this.writeRaw('colorSet', value.colors.map(function (c) { return c.toJson(); }));
    };
    Configuration.prototype.get_colorSet = function () {
        var colors = this.readRaw('colorSet').map(function (_a) {
            var a = _a.a, r = _a.r, g = _a.g, b = _a.b;
            return new argb_1.default(a, r, g, b);
        });
        return new color_set_1.default(colors);
    };
    return Configuration;
}(plate_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Configuration;
//# sourceMappingURL=configuration.js.map