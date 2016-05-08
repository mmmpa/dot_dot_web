"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var plate_1 = require("../libs/plate");
var argb_1 = require("../models/argb");
var color_set_1 = require("../models/color-set");
var gradation_color_1 = require("../models/gradation-color");
var _ = require('lodash');
var Configuration = (function (_super) {
    __extends(Configuration, _super);
    function Configuration(version, params) {
        if (version === void 0) { version = 0; }
        _super.call(this, 'dot-dot-configuration');
        this.version = version;
        this.saveTarget = _.map(params, function (v, k) { return k; });
        if (this.read('initialized') !== this.version) {
            this.write('initialized', this.version);
            this.writeOnce(params);
        }
    }
    Configuration.prototype.readInitial = function () {
        var _this = this;
        return _.reduce(this.saveTarget, function (a, key) {
            a[key] = _this.read(key);
            return a;
        }, {});
    };
    Configuration.prototype.saveFrom = function (params) {
        var picked = _.reduce(this.saveTarget, function (a, key) {
            a[key] = params[key];
            return a;
        }, {});
        this.writeOnce(picked);
    };
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
    Configuration.prototype.set_gradations = function (value) {
        this.writeRaw('gradations', value.map(function (_a) {
            var color1 = _a.color1, color2 = _a.color2;
            return ({ color1: color1.toJson(), color2: color2.toJson() });
        }));
    };
    Configuration.prototype.get_gradations = function () {
        return this.readRaw('gradations').map(function (_a) {
            var color1 = _a.color1, color2 = _a.color2;
            return new gradation_color_1.default(argb_1.default.fromJson(color1), argb_1.default.fromJson(color2));
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