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
        var props = this.props;
        var onClick = function (e) {
            console.log('new');
            props.onClick(e);
            e.target.blur();
        };
        return React.createElement("button", React.__spread({}, props, { onClick: onClick }), props.children);
    };
    return BlurButton;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = BlurButton;
//# sourceMappingURL=unfocus-button.js.map