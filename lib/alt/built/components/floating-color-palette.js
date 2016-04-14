"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require("react");
var color_cell_set_1 = require("./color-cell-set");
var FloatingColorPaletteComponent = (function (_super) {
    __extends(FloatingColorPaletteComponent, _super);
    function FloatingColorPaletteComponent() {
        _super.apply(this, arguments);
    }
    FloatingColorPaletteComponent.prototype.componentWillMount = function () {
        this.setState({
            visible: this.detectVisibility(this.props)
        });
    };
    FloatingColorPaletteComponent.prototype.shouldComponentUpdate = function (props) {
        return props.floatingColorPaletteMode !== this.props.floatingColorPaletteMode;
    };
    FloatingColorPaletteComponent.prototype.componentWillReceiveProps = function (props) {
        this.setState({ visible: this.detectVisibility(props) });
    };
    FloatingColorPaletteComponent.prototype.detectVisibility = function (props) {
        console.log(props.floatingColorPaletteMode, !_.isNull(props.floatingColorPaletteMode));
        return !_.isNull(props.floatingColorPaletteMode);
    };
    FloatingColorPaletteComponent.prototype.render = function () {
        var _this = this;
        if (!this.state.visible) {
            return null;
        }
        var colorSet = this.props.colorSet;
        return React.createElement("div", {className: "floating-color-palette"}, React.createElement("section", {className: "cell-body"}, React.createElement(color_cell_set_1.default, React.__spread({}, { colorSet: colorSet, onClick: function (color) { return _this.dispatch('floater:select', color); } }))));
    };
    return FloatingColorPaletteComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FloatingColorPaletteComponent;
//# sourceMappingURL=floating-color-palette.js.map