"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var id_man_1 = require("../libs/id-man");
var mix_1 = require("../libs/mix");
var drawer_mixin_1 = require("./image-editor-mixins/drawer-mixin");
var selection_mixin_1 = require("./image-editor-mixins/selection-mixin");
var display_mixin_1 = require("./image-editor-mixins/display-mixin");
var editor_mixin_1 = require("./image-editor-mixins/editor-mixin");
var state_mixin_1 = require("./image-editor-mixins/state-mixin");
var data_url_1 = require("./data-url");
var data_url_editor_1 = require("./data-url-editor");
var history_stack_1 = require("./history-stack");
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
    ImageEditor.find = function (id) {
        return this.store[id];
    };
    ImageEditor.clearClip = function () {
        this.floaterBitmapData && this.floaterBitmapData.dispose();
        this.floaterBitmapData = null;
    };
    ImageEditor.prepareClip = function (w, h) {
        this.floaterBitmapData && this.floaterBitmapData.dispose();
        this.floaterBitmapData = new createjs.BitmapData(null, w, h);
        return this.floaterBitmapData;
    };
    ImageEditor.prepareFloater = function () {
        if (!this.floaterBitmapData) {
            return null;
        }
        this.floaterBitmapData.updateContext();
        this.floater = new createjs.Bitmap(this.floaterBitmapData.canvas);
        this.floater.shadow = new createjs.Shadow("#ff0000", 2, 2, 0);
        return this.floater;
    };
    ImageEditor.setPixel = function (dataURL, x, y, color) {
        var image = data_url_editor_1.default.convertToImage(dataURL);
        var bitmapData = new createjs.BitmapData(image);
        bitmapData.setPixel32(x, y, color);
        bitmapData.updateContext();
        var updated = new data_url_1.default(bitmapData.canvas.toDataURL());
        dataURL.update(updated);
    };
    ImageEditor.initialize = function () {
        this.history = new history_stack_1.default();
    };
    ImageEditor.undo = function () {
        this.history.undo();
    };
    ImageEditor.redo = function () {
        this.history.redo();
    };
    ImageEditor.prototype.close = function () {
        this.fixFloater();
        this.update();
        this.stage.clear();
        this.stage.removeAllChildren();
    };
    ImageEditor.prototype.once = function (callback) {
        var store = { historyGroup: [] };
        callback(this.writeHistory(history), this);
        this.update();
        return store.historyGroup;
    };
    ImageEditor.prototype.exportPng = function () {
        return new data_url_1.default(this.canvasBitmapData.canvas.toDataURL("image/png"));
    };
    Object.defineProperty(ImageEditor.prototype, "position", {
        get: function () {
            return {
                x: this.container.x,
                y: this.container.y
            };
        },
        enumerable: true,
        configurable: true
    });
    ImageEditor.prototype.refresh = function () {
        this.canvasBitmapData.drawImage(data_url_editor_1.default.convertToImage(this.dataURL));
    };
    ImageEditor.prototype.writeHistory = function (store) {
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i - 0] = arguments[_i];
            }
            store.historyGroup = args;
        };
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
}(mix_1.mix(id_man_1.default).with(drawer_mixin_1.Drawing, selection_mixin_1.Selection, display_mixin_1.Display, editor_mixin_1.Editor, state_mixin_1.State)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image-editor.js.map