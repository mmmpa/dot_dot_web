"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var file_information_1 = require("../../models/file-information");
var layered_image_1 = require("../../models/layered-image");
var image_editor_1 = require("../../models/image-editor");
exports.FileMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(class_1.prototype, "fileName", {
        get: function () {
            var _a = this.state, fileName = _a.fileName, layerCount = _a.layerCount, frames = _a.frames;
            return fileName + "_" + new Date().getTime() + "." + frames[0].layerCount + "." + frames.length + ".png";
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "dataURL", {
        get: function () {
            var _a = this.state, canvasWidth = _a.canvasWidth, canvasHeight = _a.canvasHeight, frames = _a.frames;
            var joinedDataURLs = frames.map(function (frame) { return frame.joinedDataURL; });
            return this.gen.joinDataURLs(joinedDataURLs, canvasWidth, canvasHeight * frames[0].layerCount).data;
        },
        enumerable: true,
        configurable: true
    });
    class_1.prototype.parseFileName = function (fileName) {
        return file_information_1.default.parseFileName(fileName);
    };
    class_1.prototype.createBlankCanvas = function (width, height, backgroundColor) {
        var _this = this;
        var frames = [new layered_image_1.default(width, height, [this.gen.blankDataUrl(width, height)])];
        this.setState({
            frames: frames,
            canvasWidth: width,
            canvasHeight: height,
            selectedFrameNumber: 0,
            fileName: ''
        }, function () { return _this.dispatch('file:start'); });
    };
    class_1.prototype.createBlankCanvasFromModal = function (component) {
        var _this = this;
        var modalProps = {
            width: this.state.canvasWidth,
            height: this.state.canvasHeight,
            onComplete: function (w, h, bg) {
                _this.dispatch('modal:hide');
                _this.dispatch('file:new:complete', w, h, bg);
            },
            onCancel: function () {
                _this.dispatch('modal:hide');
            }
        };
        this.dispatch('modal:rise', component, modalProps);
    };
    class_1.prototype.start = function () {
        image_editor_1.default.initialize();
        this.dispatch('frame:select', 0);
    };
    class_1.prototype.save = function () {
        $('<a>')
            .attr("href", this.dataURL)
            .attr("download", this.fileName)
            .trigger('click');
    };
    class_1.prototype.open = function () {
        var $fileListener = $('<input type="file"/>');
        $fileListener.on('change', this.forOpenOnChange());
        $fileListener.trigger('click');
    };
    class_1.prototype.forOpenOnChange = function () {
        var _this = this;
        return function (e) {
            var file = e.path[0].files[0];
            var information = _this.parseFileName(file.name);
            var reader = new FileReader();
            reader.addEventListener('load', _this.forOpenOnRead(information));
            reader.readAsDataURL(file);
        };
    };
    class_1.prototype.forOpenOnRead = function (information) {
        var _this = this;
        return function (e) {
            var img = new Image();
            img.addEventListener('load', _this.forOpenOnLoaded(information));
            img.src = e.target.result;
        };
    };
    class_1.prototype.forOpenOnLoaded = function (information) {
        var _this = this;
        return function (e) {
            var _a = e.target, width = _a.width, height = _a.height;
            var baseWidth = width / information.frameCount;
            var baseHeight = height / information.layerCount;
            var trimmer = _this.gen.trimmer(e.target, baseWidth, baseHeight);
            var frames = _.times(information.frameCount, function (n) {
                return new layered_image_1.default(baseWidth, baseHeight, _.times(information.layerCount, function (nn) { return trimmer(baseWidth * n, baseHeight * nn); }));
            });
            _this.setState({
                frames: frames,
                canvasWidth: baseWidth,
                canvasHeight: baseHeight,
                selectedFrameNumber: 0,
                fileName: information.name
            }, function () { return _this.dispatch('file:start'); });
        };
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=file-mixin.js.map