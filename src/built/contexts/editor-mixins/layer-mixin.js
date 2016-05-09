"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
exports.LayerMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.addLayer = function () {
        this.state.frames.addLayer();
        this.dispatch('frame:select');
    };
    class_1.prototype.removeLayer = function () {
        this.state.frames.removeLayer();
        this.dispatch('frame:select', null);
    };
    class_1.prototype.moveLayerUpward = function () {
        this.state.frames.moveLayerUpward();
        this.dispatch('frame:select');
    };
    class_1.prototype.moveLayerDownward = function () {
        this.state.frames.moveLayerDownward();
        this.dispatch('frame:select');
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=layer-mixin.js.map