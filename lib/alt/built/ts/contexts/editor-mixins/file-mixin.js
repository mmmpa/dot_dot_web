"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require("../../models/image-editor");
var file_information_1 = require("../../models/file-information");
var layered_image_1 = require("../../../test/src/models/layered-image");
exports.FileMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(class_1.prototype, "fileName", {
        get: function () {
            var _a = this.state, fileName = _a.fileName, layerCount = _a.layerCount, frameCount = _a.frameCount;
            return fileName + "_" + new Date().getTime() + "." + layerCount + "." + frameCount + ".png";
        },
        enumerable: true,
        configurable: true
    });
    class_1.prototype.parseFileName = function (fileName) {
        return file_information_1.default.parseFileName(fileName);
    };
    class_1.prototype.createBlankCanvas = function (width, height, backgroundColor) {
        return image_editor_1.default.create(this.stage, 50, 50);
    };
    class_1.prototype.createFromImageElement = function (imageElement) {
        return image_editor_1.default.create(this.stage, 0, 0, imageElement);
    };
    class_1.prototype.create = function (imageElement) {
        this.ie && this.ie.close();
        if (imageElement) {
            this.ie = image_editor_1.default.create(this.stage, 0, 0, imageElement);
        }
        else {
            this.ie = image_editor_1.default.create(this.stage, 50, 50);
        }
        this.scale();
        this.ie.switchGrid(this.state.grid);
        this.setState({ ie: this.ie });
    };
    class_1.prototype.save = function () {
        $('<a>')
            .attr("href", this.ie.exportPng())
            .attr("download", this.fileName)
            .trigger('click');
    };
    class_1.prototype.open = function () {
        var _this = this;
        var $fileListener = $('<input type="file"/>');
        $fileListener.on('change', function (e) {
            var file = e.path[0].files[0];
            var information = _this.parseFileName(file.name);
            var reader = new FileReader();
            reader.addEventListener('load', function (e) {
                var img = new Image();
                img.addEventListener('load', function (e) {
                    var _a = e.target, width = _a.width, height = _a.height;
                    var baseWidth = width / information.frameCount;
                    var baseHeight = height / information.layerCount;
                    var trimmer = _this.gen.trimmer(e.target, baseWidth, baseHeight);
                    var frames = _.times(information.frameCount, function (n) {
                        // レイヤー分割処理を入れる。
                        return new layered_image_1.default(baseWidth, baseHeight, [trimmer(baseWidth * n, 0)]);
                    });
                    _this.setState({ frames: frames }, function () { return _this.dispatch('frame:select', 0); });
                });
                img.src = e.target.result;
            });
            reader.readAsDataURL(file);
        });
        $fileListener.trigger('click');
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=file-mixin.js.map