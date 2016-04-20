"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require("../../models/image-editor");
exports.FrameMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.replaceIeByImageElement = function (imageElement) {
        this.ie && this.ie.close();
        this.ie = image_editor_1.default.create(this.stage, 0, 0, imageElement);
        this.scale();
        this.ie.switchGrid(this.state.grid);
    };
    class_1.prototype.selectFrame = function (selectedFrameNumber) {
        var ie = this.replaceIeByImageElement(this.state.frames[selectedFrameNumber].image(0));
        this.setState({ ie: ie, selectedFrameNumber: selectedFrameNumber });
    };
    class_1.prototype.updateFrame = function () {
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        frames[selectedFrameNumber].update(0, this.ie.exportPng());
        this.setState({});
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=frame-mixin.js.map