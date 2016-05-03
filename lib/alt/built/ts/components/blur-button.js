"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var BlurButton = (function (_super) {
    __extends(BlurButton, _super);
    function BlurButton() {
        _super.apply(this, arguments);
    }
    BlurButton.prototype.render = function () {
        var _this = this;
        var onMouseUp = function (e) {
            _this.props.onMouseUp && _this.props.onMouseUp(e);
            e.currentTarget.blur();
        };
        var onClick = function (e) {
            _this.props.onClick && _this.props.onClick(e);
            e.currentTarget.blur();
        };
        return React.createElement("button", React.__spread({}, this.props, { onMouseUp: onMouseUp, onClick: onClick }), this.props.children);
    };
    return BlurButton;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlurButton;
//# sourceMappingURL=blur-button.js.map