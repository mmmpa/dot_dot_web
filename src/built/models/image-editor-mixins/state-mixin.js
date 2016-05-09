"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require('../image-editor');
exports.State = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.stateFloating = function () {
        this.state = image_editor_1.ImageEditorState.Floating;
    };
    class_1.prototype.stateDrawing = function () {
        this.state = image_editor_1.ImageEditorState.Drawing;
    };
    class_1.prototype.stateSelected = function () {
        this.state = image_editor_1.ImageEditorState.Selected;
    };
    Object.defineProperty(class_1.prototype, "isFloating", {
        get: function () {
            return this.state === image_editor_1.ImageEditorState.Floating;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "isDrawing", {
        get: function () {
            return this.state === image_editor_1.ImageEditorState.Drawing;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(class_1.prototype, "isSelected", {
        get: function () {
            return this.state === image_editor_1.ImageEditorState.Selected;
        },
        enumerable: true,
        configurable: true
    });
    return class_1;
}(superclass)); };
//# sourceMappingURL=state-mixin.js.map