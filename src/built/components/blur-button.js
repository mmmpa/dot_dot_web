"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require('react');
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
            var up = function () {
                button.blur();
                window.removeEventListener('mouseup', up);
            };
            window.addEventListener('mouseup', up);
        };
        return React.createElement("button", __assign({}, this.props, { onMouseDown: onMouseDown }), this.props.children);
    };
    return BlurButton;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlurButton;
//# sourceMappingURL=blur-button.js.map