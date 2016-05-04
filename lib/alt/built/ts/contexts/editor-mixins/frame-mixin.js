"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require("../../models/image-editor");
var data_url_generator_1 = require("../../models/data-url-generator");
var gen = new data_url_generator_1.default();
exports.FrameMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.replaceIeByLayeredImage = function (layeredImage) {
        this.ie && this.ie.close();
        this.ie = new image_editor_1.default(this.stage, layeredImage.selected, layeredImage.width, layeredImage.height, gen.convertToImage(layeredImage.selected), gen.convertToImage(layeredImage.overlay), gen.convertToImage(layeredImage.underlay));
        this.scale();
        this.ie.switchGrid(this.state.grid);
    };
    Object.defineProperty(class_1.prototype, "frameNow", {
        get: function () {
            return this.state.frames[this.state.selectedFrameNumber];
        },
        enumerable: true,
        configurable: true
    });
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
    class_1.prototype.updateFrame = function () {
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber, selectedLayerNumber = _a.selectedLayerNumber;
        this.setState({ frames: frames });
    };
    class_1.prototype.selectNextFrame = function () {
        var nextFrame = this.state.selectedFrameNumber + 1;
        if (!this.state.frames[nextFrame]) {
            nextFrame = 0;
        }
        this.dispatch('frame:select', nextFrame);
    };
    class_1.prototype.selectPreviousFrame = function () {
        var nextFrame = this.state.selectedFrameNumber - 1;
        if (!this.state.frames[nextFrame]) {
            nextFrame = this.state.frames.length - 1;
        }
        this.dispatch('frame:select', nextFrame);
    };
    class_1.prototype.scaleFrame = function (framesScale) {
        this.setState({ framesScale: framesScale });
    };
    class_1.prototype.setFrameRate = function (frameRate) {
        this.setState({ frameRate: frameRate });
    };
    class_1.prototype.playFrame = function (frameRate) {
        var _this = this;
        var id = setInterval(function () {
            _this.selectNextFrame();
        }, 1000 / frameRate);
        var stop = function (e) {
            e.preventDefault();
            clearInterval(id);
            $(window).unbind('mousedown', stop);
        };
        $(window).bind('mousedown', stop);
    };
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
    class_1.prototype.addFrame = function () {
        var _this = this;
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        var newFrame = frames[selectedFrameNumber].clone();
        frames.splice(selectedFrameNumber, 0, newFrame);
        this.setState({ frames: frames }, function () { return _this.dispatch('frame:select', selectedFrameNumber + 1); });
    };
    class_1.prototype.deleteFrame = function () {
        var _this = this;
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        if (frames.length === 1) {
            return;
        }
        var newFrames = frames.filter(function (f) { return f.id !== _this.frameNow.id; });
        var nextFrame = selectedFrameNumber === 0 ? 0 : selectedFrameNumber - 1;
        this.setState({ frames: newFrames }, function () { return _this.dispatch('frame:select', nextFrame); });
    };
    class_1.prototype.moveFrameBackward = function () {
        var _this = this;
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        var target = frames[selectedFrameNumber - 1];
        if (!target) {
            return;
        }
        var newFrames = frames.concat();
        newFrames[selectedFrameNumber] = target;
        newFrames[selectedFrameNumber - 1] = this.frameNow;
        this.setState({ frames: newFrames }, function () { return _this.dispatch('frame:select', selectedFrameNumber - 1); });
    };
    class_1.prototype.moveFrameForward = function () {
        var _this = this;
        var _a = this.state, frames = _a.frames, selectedFrameNumber = _a.selectedFrameNumber;
        var target = frames[selectedFrameNumber + 1];
        if (!target) {
            return;
        }
        var newFrames = frames.concat();
        newFrames[selectedFrameNumber] = target;
        newFrames[selectedFrameNumber + 1] = this.frameNow;
        this.setState({ frames: newFrames }, function () { return _this.dispatch('frame:select', selectedFrameNumber + 1); });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=frame-mixin.js.map