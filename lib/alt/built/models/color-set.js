"use strict";
var _ = require('lodash');
var ColorSet = (function () {
    function ColorSet(colors, version) {
        if (colors === void 0) { colors = []; }
        if (version === void 0) { version = 0; }
        this.colors = colors;
        this.version = version;
    }
    ColorSet.prototype.add = function (color) {
        console.log(color.clone());
        this.colors.push(color.clone());
        this.version++;
    };
    ColorSet.prototype.remove = function (color) {
        _.remove(this.colors, function (c) { return c === color; });
        this.version++;
    };
    return ColorSet;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorSet;
//# sourceMappingURL=color-set.js.map