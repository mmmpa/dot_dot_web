"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var argb_1 = require("../models/argb");
var key_control_1 = require("../models/key-control");
var EditorContext = (function (_super) {
    __extends(EditorContext, _super);
    function EditorContext() {
        _super.apply(this, arguments);
    }
    EditorContext.prototype.componentWillMount = function () {
        var _this = this;
        _super.prototype.componentWillMount.call(this);
        this.setState({
            colors: [argb_1.default.number(0xff000000), argb_1.default.number(0xffffffff)],
            selectedColorNumber: 0,
            selectedColor: argb_1.default.number(0xff000000),
            scale: 4,
            grid: true,
            key: new key_control_1.default(function (mode) { return mode !== _this.state.mode && _this.setState({ mode: mode }); }),
            mode: null
        });
    };
    EditorContext.prototype.arrangeColor = function (_a) {
        var a = _a.a, r = _a.r, g = _a.g, b = _a.b;
        //console.log(argb)
        var selectedColorNumber = this.state.selectedColorNumber;
        var colors = this.state.colors.concat();
        var selectedColor = new argb_1.default(a, r, g, b);
        colors[selectedColorNumber] = selectedColor;
        this.setState({ colors: colors, selectedColor: selectedColor });
    };
    EditorContext.prototype.listen = function (to) {
        var _this = this;
        to('color:switch', function (selectedColorNumber) { return _this.setState({ selectedColorNumber: selectedColorNumber, selectedColor: _this.state.colors[selectedColorNumber] }); });
        to('color:arrange', function (argb) { return _this.arrangeColor(argb); });
        to('canvas:scale', function (scale) { return _this.setState({ scale: scale }); });
    };
    return EditorContext;
}(parcel_1.Parcel));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = EditorContext;
//# sourceMappingURL=editor-context.js.map