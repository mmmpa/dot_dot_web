"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var Cell = (function (_super) {
    __extends(Cell, _super);
    function Cell() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(Cell.prototype, "layoutStyle", {
        get: function () {
            return this.pickLayout(this.props);
        },
        enumerable: true,
        configurable: true
    });
    Cell.prototype.pickLayout = function (props) {
        return props.layout[this.props.name] || {};
    };
    return Cell;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Cell;
//# sourceMappingURL=cell-component.js.map