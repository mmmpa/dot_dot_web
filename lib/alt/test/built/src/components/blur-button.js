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
        var onMouseDown = function (e) {
            _this.props.onMouseDown && _this.props.onMouseDown(e);
            var button = e.currentTarget;
            var up = function (e) {
                button.blur();
                window.removeEventListener('mouseup', up);
            };
            window.addEventListener('mouseup', up);
        };
        return React.createElement("button", React.__spread({}, this.props, { onMouseDown: onMouseDown }), this.props.children);
    };
    return BlurButton;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlurButton;
//# sourceMappingURL=blur-button.js.map