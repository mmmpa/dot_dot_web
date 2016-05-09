"use strict";
var style_stylist_1 = require('./style-stylist');
var ComponentSize = (function () {
    function ComponentSize(_a) {
        var toolWidth = _a.toolWidth, frameSelectorHeight = _a.frameSelectorHeight;
        this.version = 0;
        this.toolWidth = toolWidth || 406;
        this.frameSelectorHeight = frameSelectorHeight || 200;
    }
    ComponentSize.prototype.update = function (_a) {
        var toolWidth = _a.toolWidth, frameSelectorHeight = _a.frameSelectorHeight;
        toolWidth && (this.toolWidth = toolWidth);
        frameSelectorHeight && (this.frameSelectorHeight = frameSelectorHeight);
        this.version++;
    };
    ComponentSize.prototype.compute = function (windowWidth, windowHeight) {
        var _a = this, toolWidth = _a.toolWidth, frameSelectorHeight = _a.frameSelectorHeight;
        var canvasWidth = windowWidth - toolWidth;
        var canvasHeight = windowHeight - frameSelectorHeight;
        var toolX = canvasWidth;
        var split = (windowHeight - 200) / 4;
        return {
            // left column
            canvas: new style_stylist_1.default(0, 0, canvasWidth, canvasHeight).css,
            frameSelector: new style_stylist_1.default(0, canvasHeight, canvasWidth, frameSelectorHeight).css,
            // right column
            colorController: new style_stylist_1.default(toolX, split * 4, toolWidth, 200).css,
            colorPalette: new style_stylist_1.default(toolX, split * 2, toolWidth, split).css,
            colorSet: new style_stylist_1.default(toolX, split, toolWidth, split).css,
            gradationSelector: new style_stylist_1.default(toolX, split * 3, toolWidth, split).css,
            toolSelector: new style_stylist_1.default(toolX, 0, toolWidth, split).css,
            // modal
            modal: new style_stylist_1.default(0, 0, windowWidth, windowHeight).css,
        };
    };
    return ComponentSize;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ComponentSize;
//# sourceMappingURL=component-size.js.map