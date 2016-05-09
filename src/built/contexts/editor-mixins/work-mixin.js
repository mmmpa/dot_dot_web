"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var image_editor_1 = require('../../models/image-editor');
exports.WorkMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.undo = function () {
        image_editor_1.default.undo(this.ie);
        this.dispatch('frame:update');
    };
    class_1.prototype.redo = function () {
        image_editor_1.default.redo(this.ie);
        this.dispatch('frame:update');
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=work-mixin.js.map