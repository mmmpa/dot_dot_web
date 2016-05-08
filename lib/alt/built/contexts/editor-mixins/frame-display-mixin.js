"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var data_url_editor_1 = require("../../models/data-url-editor");
var gen = data_url_editor_1.default;
exports.FrameDisplayMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.updateFrame = function () {
        var frames = this.state.frames;
        this.setState({ frames: frames });
    };
    class_1.prototype.scaleFrame = function (framesScale) {
        this.setState({ framesScale: framesScale });
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
    return class_1;
}(superclass)); };
//# sourceMappingURL=frame-display-mixin.js.map