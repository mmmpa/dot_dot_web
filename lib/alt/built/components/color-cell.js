"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var ColorCell = (function (_super) {
    __extends(ColorCell, _super);
    function ColorCell() {
        _super.apply(this, arguments);
    }
    ColorCell.prototype.render = function () {
        var _a = this.props, color = _a.color, index = _a.index, onClick = _a.onClick;
        return React.createElement("li", {className: "color-cell", onClick: function () { return onClick(color, index); }}, React.createElement("em", {style: { background: color.css }}, color.hex));
    };
    return ColorCell;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorCell;
//# sourceMappingURL=color-cell.js.map