"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var data_url_editor_1 = require("../../models/data-url-editor");
var gen = data_url_editor_1.default;
exports.LayerMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.addLayer = function () {
        var _a = this.state, frames = _a.frames, selectedLayerNumber = _a.selectedLayerNumber, selectedFrameNumber = _a.selectedFrameNumber;
        frames.forEach(function (layeredImage) { return layeredImage.add(selectedLayerNumber); });
        this.dispatch('frame:select', selectedFrameNumber, selectedLayerNumber);
    };
    class_1.prototype.removeLayer = function () {
        var _a = this.state, frames = _a.frames, selectedLayerNumber = _a.selectedLayerNumber, selectedFrameNumber = _a.selectedFrameNumber;
        frames.forEach(function (layeredImage) { return layeredImage.remove(selectedLayerNumber); });
        this.dispatch('frame:select', selectedFrameNumber, selectedLayerNumber);
    };
    class_1.prototype.moveLayerUpward = function () {
        var _this = this;
        var _a = this.state, selectedLayerNumber = _a.selectedLayerNumber, selectedFrameNumber = _a.selectedFrameNumber;
        this.frameNow.moveUpward(selectedLayerNumber, function (movedLayerNumber) {
            _this.dispatch('frame:select', selectedFrameNumber, movedLayerNumber);
        });
    };
    class_1.prototype.moveLayerDownward = function () {
        var _this = this;
        var _a = this.state, selectedLayerNumber = _a.selectedLayerNumber, selectedFrameNumber = _a.selectedFrameNumber;
        this.frameNow.moveDownward(selectedLayerNumber, function (movedLayerNumber) {
            _this.dispatch('frame:select', selectedFrameNumber, movedLayerNumber);
        });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=layer-mixin.js.map