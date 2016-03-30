"use strict";
var ARGB = (function () {
    function ARGB(a, r, g, b) {
        this.a = a;
        this.r = r;
        this.g = g;
        this.b = b;
    }
    ARGB.prototype.hexSupport = function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
    };
    ARGB.number = function (argb) {
        var a = (argb >>> 24) & 0xff;
        var r = (argb >>> 16) & 0xff;
        var g = (argb >>> 8) & 0xff;
        var b = (argb >>> 0) & 0xff;
        return new ARGB(a, r, g, b);
    };
    Object.defineProperty(ARGB.prototype, "number", {
        get: function () {
            return (this.a << 24) + (this.b << 16) + (this.g << 8) + this.r;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ARGB.prototype, "hex", {
        get: function () {
            return "#" + this.hexSupport(this.r) + this.hexSupport(this.g) + this.hexSupport(this.b);
        },
        enumerable: true,
        configurable: true
    });
    ARGB.prototype.toJson = function () {
        var _a = this, r = _a.r, b = _a.b, g = _a.g, a = _a.a;
        return { r: r, g: g, b: b, a: a };
    };
    ARGB.prototype.clone = function () {
        return ARGB.fromJson(this.toJson());
    };
    ARGB.fromJson = function (json) {
        var r = json.r, b = json.b, g = json.g, a = json.a;
        return new ARGB(r, g, b, a);
    };
    return ARGB;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ARGB;
//# sourceMappingURL=argb.js.map