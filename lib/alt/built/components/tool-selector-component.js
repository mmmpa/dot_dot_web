"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var React = require("react");
var cell_component_1 = require("./cell-component");
var ToolSelectorComponent = (function (_super) {
    __extends(ToolSelectorComponent, _super);
    function ToolSelectorComponent() {
        _super.apply(this, arguments);
    }
    ToolSelectorComponent.prototype.render = function () {
        return React.createElement("div", {className: "cell y", style: this.layoutStyle}, this.myName);
    };
    return ToolSelectorComponent;
}(cell_component_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ToolSelectorComponent;
//# sourceMappingURL=tool-selector-component.js.map