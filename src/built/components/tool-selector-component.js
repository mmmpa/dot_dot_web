"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var cell_component_1 = require("./cell-component");
var blur_button_1 = require("./blur-button");
var ToolSelectorComponent = (function (_super) {
    __extends(ToolSelectorComponent, _super);
    function ToolSelectorComponent() {
        _super.apply(this, arguments);
    }
    ToolSelectorComponent.prototype.writeButton = function (name) {
        var _this = this;
        var key = name.replace(/\s/ig, '-');
        return React.createElement("li", null, React.createElement(blur_button_1.default, {key: key, className: key, onClick: function (e) { return _this.fire(e, key); }}, name));
    };
    ToolSelectorComponent.prototype.fire = function (e, key) {
        //e.target.blur();
        switch (key) {
            case 'save':
                return this.dispatch('file:save');
            case 'new':
                return this.dispatch('file:new');
            case 'open':
                return this.dispatch('file:open');
            case 'grid':
                return this.dispatch('canvas:grid:toggle');
            case 'centering':
                return this.dispatch('canvas:center');
            case 'scale-plus':
                return this.dispatch('canvas:scale:plus');
            case 'scale-minus':
                return this.dispatch('canvas:scale:minus');
            case 'resize':
                return this.dispatch('canvas:size');
            default:
                this.dispatch(key);
        }
    };
    ToolSelectorComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("div", {className: "cell y tool-selector", style: this.layoutStyle}, React.createElement("section", null, React.createElement("h1", null, "file name"), React.createElement("input", {type: "text", value: this.props.fileName, onChange: function (e) { return _this.dispatch('file:name', e.target.value); }})), React.createElement("ul", {className: "tool-list"}), React.createElement("ul", {className: "command-list file"}, ['new', 'open', 'save', 'resize'].map(function (name) { return _this.writeButton(name); })), React.createElement("ul", {className: "command-list file"}, ['grid', 'centering', 'scale plus', 'scale minus'].map(function (name) { return _this.writeButton(name); })));
    };
    return ToolSelectorComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolSelectorComponent;
//# sourceMappingURL=tool-selector-component.js.map