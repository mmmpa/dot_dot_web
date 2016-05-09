"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require('../../models/image-editor');
var data_url_editor_1 = require('../../models/data-url-editor');
var gen = data_url_editor_1.default;
exports.FrameMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(class_1.prototype, "frameNow", {
        get: function () {
            return this.state.frames.selected;
        },
        enumerable: true,
        configurable: true
    });
    class_1.prototype.addFrame = function () {
        this.state.frames.cloneSelectedFrame();
        this.dispatch('frame:select');
    };
    class_1.prototype.removeFrame = function () {
        this.state.frames.removeSelectedFrame();
        this.dispatch('frame:select');
    };
    class_1.prototype.moveFrameN = function (n) {
        this.state.frames.move(n);
        this.dispatch('frame:select');
    };
    class_1.prototype.moveFrameBackward = function () {
        this.moveFrameN(-1);
    };
    class_1.prototype.moveFrameForward = function () {
        this.moveFrameN(+1);
    };
    class_1.prototype.selectFrame = function (selectedFrameNumber_, selectedLayerNumber_) {
        if (selectedFrameNumber_ === void 0) { selectedFrameNumber_ = -1; }
        if (selectedLayerNumber_ === void 0) { selectedLayerNumber_ = -1; }
        var frames = this.state.frames;
        var selectedFrameNumber = selectedFrameNumber_ === -1 ? frames.selectedIndex : selectedFrameNumber_;
        var selectedLayerNumber = selectedLayerNumber_ === -1 ? frames.selectedLayerIndex : selectedLayerNumber_;
        frames.select(selectedFrameNumber);
        frames.selectLayer(selectedLayerNumber);
        var ie = this.replaceIeByLayeredImage(frames.selected);
        this.setState({ ie: ie });
    };
    class_1.prototype.replaceFrames = function (frames) {
        var _this = this;
        this.setState({ frames: frames }, function () { return _this.dispatch('frame:select'); });
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