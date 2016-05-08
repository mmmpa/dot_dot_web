"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var layered_image_1 = require("../../models/layered-image");
var data_url_editor_1 = require('../../models/data-url-editor');
exports.CanvasMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.resizeCanvasFromModal = function (component) {
        var _this = this;
        var modalProps = {
            canvasWidth: this.state.canvasWidth,
            canvasHeight: this.state.canvasHeight,
            onComplete: function (top, right, bottom, left) {
                _this.dispatch('modal:hide');
                _this.dispatch('canvas:size:complete', top, right, bottom, left);
            },
            onCancel: function () {
                _this.dispatch('modal:hide');
            }
        };
        this.dispatch('modal:rise', component, modalProps);
    };
    class_1.prototype.resizeCanvas = function (top, right, bottom, left) {
        var _this = this;
        var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, frames = _a.frames;
        var width = canvasWidth + left + right;
        var height = canvasHeight + top + bottom;
        var newFrames = frames.map(function (frame) {
            return new layered_image_1.default(width, height, [data_url_editor_1.default.fromImage(frame.image(0), width, height, top, left)]);
        });
        this.setState({
            canvasWidth: width,
            canvasHeight: height
        }, function () { return _this.dispatch('frame:replace', newFrames); });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=canvas-mixin.js.map