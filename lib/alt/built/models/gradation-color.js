"use strict";
var _ = require('lodash');
var argb_1 = require("./argb");
var GradationColor = (function () {
    function GradationColor(_color1, _color2, length, version) {
        if (_color1 === void 0) { _color1 = new argb_1.default(255, 0, 0, 0); }
        if (_color2 === void 0) { _color2 = new argb_1.default(255, 255, 255, 255); }
        if (length === void 0) { length = 17; }
        if (version === void 0) { version = 0; }
        this._color1 = _color1;
        this._color2 = _color2;
        this.length = length;
        this.version = version;
        this.id = GradationColor.genId();
        this.compute();
    }
    GradationColor.genId = function () {
        return this.id++;
    };
    Object.defineProperty(GradationColor.prototype, "color1", {
        get: function () {
            return this._color1;
        },
        set: function (v) {
            this._color1 = v;
            this.compute();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(GradationColor.prototype, "color2", {
        get: function () {
            return this._color2;
        },
        set: function (v) {
            this._color2 = v;
            this.compute();
        },
        enumerable: true,
        configurable: true
    });
    GradationColor.prototype.compute = function () {
        var _this = this;
        var steps = _.reduce(['a', 'r', 'g', 'b'], function (a, argb) {
            a[argb] = (_this._color2[argb] - _this._color1[argb]) / (_this.length - 1);
            return a;
        }, {});
        this.colors = _.times(this.length - 1, function (n) {
            var _a = _.reduce(['a', 'r', 'g', 'b'], function (a, argb) {
                a[argb] = Math.round(_this._color1[argb] + steps[argb] * n);
                return a;
            }, {}), a = _a.a, r = _a.r, g = _a.g, b = _a.b;
            return new argb_1.default(a, r, g, b);
        });
        var last = this._color2.clone();
        this.colors.push(last);
        this.version++;
    };
    GradationColor.id = 0;
    return GradationColor;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = GradationColor;
//# sourceMappingURL=gradation-color.js.map