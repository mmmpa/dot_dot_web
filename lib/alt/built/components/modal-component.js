"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var cell_component_1 = require("./cell-component");
var ModalComponent = (function (_super) {
    __extends(ModalComponent, _super);
    function ModalComponent() {
        _super.apply(this, arguments);
    }
    ModalComponent.prototype.componentWillReceiveProps = function (props) {
        props.modalProps && this.setState(props.modalProps);
    };
    ModalComponent.prototype.componentDidUpdate = function (prevProps, prevState) {
        if (!this.props.modalComponent) {
            return;
        }
        var _a = this.layoutStyle, width = _a.width, height = _a.height;
        var _b = this.window, clientWidth = _b.clientWidth, clientHeight = _b.clientHeight;
        this.window.style.top = (parseInt(height) - clientHeight) / 2 + 'px';
        this.window.style.left = (parseInt(width) - clientWidth) / 2 + 'px';
    };
    Object.defineProperty(ModalComponent.prototype, "window", {
        get: function () {
            return this.refs['window'];
        },
        enumerable: true,
        configurable: true
    });
    ModalComponent.prototype.render = function () {
        var _this = this;
        if (!this.props.modalComponent) {
            return null;
        }
        return React.createElement("div", {className: "modal", style: this.layoutStyle, onClick: function () { return _this.dispatch('modal:cancel'); }}, React.createElement("div", {className: "window", ref: "window"}, this.relay([this.props.modalComponent])));
    };
    return ModalComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ModalComponent;
//# sourceMappingURL=modal-component.js.map