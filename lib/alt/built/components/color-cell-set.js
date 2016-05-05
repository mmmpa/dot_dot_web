"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var color_cell_1 = require("./color-cell");
var ColorCellSet = (function (_super) {
    __extends(ColorCellSet, _super);
    function ColorCellSet() {
        _super.apply(this, arguments);
    }
    ColorCellSet.prototype.componentWillMount = function () {
        this.setState({
            version: this.props.colorSet.version
        });
    };
    ColorCellSet.prototype.shouldComponentUpdate = function (props) {
        return props.colorSet.version !== this.state.version;
    };
    ColorCellSet.prototype.componentWillReceiveProps = function (props) {
        this.setState({ version: props.colorSet.version });
    };
    ColorCellSet.prototype.writeCells = function () {
        var onClick = this.props.onClick;
        var colors = this.props.colorSet.colors;
        return colors.map(function (color, key) {
            return React.createElement(color_cell_1.default, React.__spread({}, { key: key, color: color, onClick: onClick }));
        });
    };
    ColorCellSet.prototype.render = function () {
        return React.createElement("ul", {className: "colors"}, this.writeCells());
    };
    return ColorCellSet;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ColorCellSet;
//# sourceMappingURL=color-cell-set.js.map