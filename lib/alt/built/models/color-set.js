"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var _ = require('lodash');
var id_man_1 = require('../libs/id-man');
var ColorSet = (function (_super) {
    __extends(ColorSet, _super);
    function ColorSet(colors, version) {
        if (colors === void 0) { colors = []; }
        if (version === void 0) { version = 0; }
        _super.call(this);
        this.colors = colors;
        this.version = version;
    }
    ColorSet.prototype.add = function (color) {
        this.colors.push(color.clone());
        this.version++;
    };
    ColorSet.prototype.remove = function (color) {
        _.remove(this.colors, function (c) { return c === color; });
        this.version++;
    };
    return ColorSet;
}(id_man_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorSet;
//# sourceMappingURL=color-set.js.map