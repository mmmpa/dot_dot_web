"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var id_man_1 = require('../libs/id-man');
var mix_1 = require('../libs/mix');
var drawer_mixin_1 = require('./image-editor-mixins/drawer-mixin');
var selection_mixin_1 = require('./image-editor-mixins/selection-mixin');
var display_mixin_1 = require('./image-editor-mixins/display-mixin');
var editor_mixin_1 = require('./image-editor-mixins/editor-mixin');
var state_mixin_1 = require('./image-editor-mixins/state-mixin');
var clip_board_mixin_1 = require('./image-editor-mixins/clip-board-mixin');
var data_url_1 = require('./data-url');
var history_stack_1 = require('./history-stack');
(function (ImageEditorState) {
    ImageEditorState[ImageEditorState["Drawing"] = 0] = "Drawing";
    ImageEditorState[ImageEditorState["Selected"] = 1] = "Selected";
    ImageEditorState[ImageEditorState["Floating"] = 2] = "Floating";
})(exports.ImageEditorState || (exports.ImageEditorState = {}));
var ImageEditorState = exports.ImageEditorState;
var ImageEditor = (function (_super) {
    __extends(ImageEditor, _super);
    function ImageEditor(stage, dataURL, width, height, imageElement, overlayElement, underlayElement) {
        this.stage = stage;
        this.dataURL = dataURL;
        this.width = width;
        this.height = height;
        this.scaleNumber = 1;
        this.selectedCount = 0;
        this.isGridDisplay = false;
        this.gridStore = [];
        this.gridColor = 'rgba(0,0,0,0.1)';
        this.selectionColor = 0x4400ff00;
        this.container = new createjs.Container();
        this.canvasContainer = new createjs.Container();
        this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01000000).canvas);
        this.canvasBitmapData = new createjs.BitmapData(imageElement);
        this.overlay = overlayElement
            ? new createjs.Bitmap(new createjs.BitmapData(overlayElement).canvas)
            : null;
        this.underlay = underlayElement
            ? new createjs.Bitmap(new createjs.BitmapData(underlayElement).canvas)
            : null;
        this.selectionBitmapData = new createjs.BitmapData(null, this.width, this.height);
        this.selection = new createjs.Bitmap(this.selectionBitmapData.canvas);
        this.canvas = new createjs.Bitmap(this.canvasBitmapData.canvas);
        this.underlay && this.canvasContainer.addChild(this.underlay);
        this.canvasContainer.addChild(this.canvas);
        this.overlay && this.canvasContainer.addChild(this.overlay);
        this.canvasContainer.addChild(this.selection);
        this.container.addChild(this.canvasContainer);
        stage.addChild(this.bg);
        stage.addChild(this.container);
        this.update();
        this.stateDrawing();
    }
    ImageEditor.initialize = function () {
        this.history = new history_stack_1.default();
    };
    ImageEditor.undo = function (ie) {
        this.history.undo();
        ie && ie.update();
    };
    ImageEditor.redo = function (ie) {
        this.history.redo();
        ie && ie.update();
    };
    ImageEditor.prototype.close = function () {
        this.fixFloater();
        this.update();
        this.stage.clear();
        this.stage.removeAllChildren();
    };
    ImageEditor.prototype.exportPng = function () {
        return new data_url_1.default(this.canvasBitmapData.canvas.toDataURL('image/png'));
    };
    ImageEditor.prototype.update = function () {
        this.selectionBitmapData.updateContext();
        this.canvasBitmapData.updateContext();
        this.stage.update();
        this.dataURL.update(this.exportPng());
    };
    ImageEditor.prototype.normalizePixel = function (rawX, rawY) {
        var x = (rawX - this.container.x) / this.scaleNumber >> 0;
        var y = (rawY - this.container.y) / this.scaleNumber >> 0;
        return { x: x, y: y };
    };
    ImageEditor.prototype.stockPixels = function (updated) {
        var _this = this;
        if (!updated || updated.length === 0) {
            return;
        }
        ImageEditor.history.stock({
            up: function () {
                updated.forEach(function (_a) {
                    var x = _a.x, y = _a.y, color = _a.color;
                    return _this.setPixel(x, y, color, false, false);
                });
            },
            down: function () {
                updated.forEach(function (_a) {
                    var x = _a.x, y = _a.y, oldColor = _a.oldColor;
                    return _this.setPixel(x, y, oldColor, false, false);
                });
            },
        });
    };
    ImageEditor.pToP = function (x, y, endX, endY) {
        var points = [];
        var moveX = x - endX;
        var moveY = y - endY;
        var getSupport = function (n) {
            var minus = function (i) { return i - 1; };
            var plus = function (i) { return i + 1; };
            return n < 0 ? plus : minus;
        };
        if (moveX !== 0 || moveY !== 0) {
            var power = moveY / moveX;
            var xSupport = getSupport(moveX);
            for (var i = moveX; i; i = xSupport(i)) {
                points.push({ x: x - i, y: Math.round(y - i * power) });
            }
            var ySupport = getSupport(moveY);
            for (var i = moveY; i; i = ySupport(i)) {
                points.push({ x: Math.round(x - i / power), y: y - i });
            }
        }
        return points;
    };
    return ImageEditor;
}(mix_1.mix(id_man_1.default).mix(drawer_mixin_1.Drawing, selection_mixin_1.Selection, display_mixin_1.Display, editor_mixin_1.Editor, state_mixin_1.State, clip_board_mixin_1.ClipBoardMixin)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image-editor.js.map