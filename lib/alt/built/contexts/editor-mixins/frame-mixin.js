"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require("../../models/image-editor");
var data_url_editor_1 = require("../../models/data-url-editor");
var gen = data_url_editor_1.default;
exports.FrameMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(class_1.prototype, "frameNow", {
        get: function () {
            return this.state.frames[this.state.selectedFrameNumber];
        },
        enumerable: true,
        configurable: true
    });
    class_1.prototype.addFrame = function () {
        var _this = this;
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        var newFrame = frames[selectedFrameNumber].clone();
        frames.splice(selectedFrameNumber, 0, newFrame);
        this.setState({ frames: frames }, function () { return _this.dispatch('frame:select', selectedFrameNumber + 1); });
    };
    class_1.prototype.removeFrame = function () {
        var _this = this;
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        if (frames.length === 1) {
            return;
        }
        var newFrames = frames.filter(function (f) { return f.id !== _this.frameNow.id; });
        var nextFrame = selectedFrameNumber === 0 ? 0 : selectedFrameNumber - 1;
        this.setState({ frames: newFrames }, function () { return _this.dispatch('frame:select', nextFrame); });
    };
    class_1.prototype.moveFrameN = function (n) {
        var _this = this;
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        var target = frames[selectedFrameNumber + n];
        if (!target) {
            return;
        }
        var newFrames = frames.concat();
        newFrames[selectedFrameNumber] = target;
        newFrames[selectedFrameNumber + n] = this.frameNow;
        this.setState({ frames: newFrames }, function () { return _this.dispatch('frame:select', selectedFrameNumber + n); });
    };
    class_1.prototype.moveFrameBackward = function () {
        this.moveFrameN(-1);
    };
    class_1.prototype.moveFrameForward = function () {
        this.moveFrameN(+1);
    };
    class_1.prototype.selectFrame = function (selectedFrameNumber, selectedLayerNumber_) {
        if (selectedLayerNumber_ === void 0) { selectedLayerNumber_ = -1; }
        var frame = this.state.frames[selectedFrameNumber];
        var selectedLayerNumber = selectedLayerNumber_ !== -1 ? selectedLayerNumber_ : this.state.selectedLayerNumber;
        if (!frame) {
            return;
        }
        frame.select(selectedLayerNumber);
        var ie = this.replaceIeByLayeredImage(frame);
        this.setState({ ie: ie, selectedFrameNumber: selectedFrameNumber, selectedLayerNumber: selectedLayerNumber });
    };
    class_1.prototype.replaceFrames = function (frames) {
        var _this = this;
        var selectedFrameNumber = this.state.selectedFrameNumber;
        this.setState({ frames: frames }, function () { return _this.selectFrame(selectedFrameNumber); });
    };
    class_1.prototype.replaceIeByLayeredImage = function (layeredImage) {
        this.ie && this.ie.close();
        this.ie = new image_editor_1.default(this.stage, layeredImage.selected, layeredImage.width, layeredImage.height, gen.convertToImage(layeredImage.selected), gen.convertToImage(layeredImage.overlay), gen.convertToImage(layeredImage.underlay));
        this.scale();
        this.ie.switchGrid(this.state.grid);
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=frame-mixin.js.map