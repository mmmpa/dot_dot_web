"use strict";
var ColorSet = (function () {
    function ColorSet(colors, version) {
        if (colors === void 0) { colors = []; }
        if (version === void 0) { version = 0; }
        this.colors = colors;
        this.version = version;
    }
    ColorSet.prototype.add = function (color) {
        this.colors.push(color);
        this.version++;
    };
    return ColorSet;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorSet;
//# sourceMappingURL=color-set.js.map