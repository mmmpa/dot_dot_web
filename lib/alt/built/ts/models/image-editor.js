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
var data_url_1 = require("../../test/src/models/data-url");
(function (ImageEditorState) {
    ImageEditorState[ImageEditorState["Drawing"] = 0] = "Drawing";
    ImageEditorState[ImageEditorState["Selected"] = 1] = "Selected";
    ImageEditorState[ImageEditorState["Floating"] = 2] = "Floating";
})(exports.ImageEditorState || (exports.ImageEditorState = {}));
var ImageEditorState = exports.ImageEditorState;
var ImageEditor = (function (_super) {
    __extends(ImageEditor, _super);
    function ImageEditor(stage, width, height, imageElement, overlayElement, underlayElement) {
        this.stage = stage;
        this.width = width;
        this.height = height;
        this._scale = 1;
        this._grid = false;
        this._gridElement = null;
        this._gridStore = [];
        this._gridColor = 0xff000000;
        this.selectedCount = 0;
        this.selectionColor = 0x4400ff00;
        this.container = new createjs.Container();
        this.canvasContainer = new createjs.Container();
        this.bg = new createjs.Bitmap(new createjs.BitmapData(null, stage.canvas.width, stage.canvas.height, 0x01000000).canvas);
        if (imageElement) {
            this.bitmapData = new createjs.BitmapData(imageElement);
        }
        else {
            this.bitmapData = new createjs.BitmapData(null, width, height, 0xffffffff);
        }
        var overlay = overlayElement ? new createjs.Bitmap(new createjs.BitmapData(overlayElement).canvas) : null;
        var underlay = underlayElement ? new createjs.Bitmap(new createjs.BitmapData(underlayElement).canvas) : null;
        this.width = this.bitmapData.width;
        this.height = this.bitmapData.height;
        this.selectionBitmap = new createjs.BitmapData(null, this.width, this.height);
        this.selection = new createjs.Bitmap(this.selectionBitmap.canvas);
        this.canvas = new createjs.Bitmap(this.bitmapData.canvas);
        underlay && this.canvasContainer.addChild(underlay);
        this.canvasContainer.addChild(this.canvas);
        overlay && this.canvasContainer.addChild(overlay);
        this.container.addChild(this.canvasContainer);
        this.container.addChild(this.selection);
        stage.addChild(this.bg);
        stage.addChild(this.container);
        this.update();
        this.stateDrawing();
    }
    ImageEditor.find = function (id) {
        return this.store[id];
    };
    ImageEditor.prototype.close = function () {
        this.fixFloater();
        this.onChange && this.onChange(this);
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
        return new data_url_1.default(this.bitmapData.canvas.toDataURL("image/png"));
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
        this.selectionBitmap.updateContext();
        this.bitmapData.updateContext();
        this.stage.update();
        this.onChange && this.onChange(this);
    };
    ImageEditor.prototype.normalizePixel = function (rawX, rawY) {
        var x = (rawX - this.container.x) / this._scale >> 0;
        var y = (rawY - this.container.y) / this._scale >> 0;
        return { x: x, y: y };
    };
    ImageEditor.clearClip = function () {
        this.floaterBitmap && this.floaterBitmap.dispose();
        this.floaterBitmap = null;
    };
    ImageEditor.prepareClip = function (w, h) {
        this.floaterBitmap && this.floaterBitmap.dispose();
        this.floaterBitmap = new createjs.BitmapData(null, w, h);
        return this.floaterBitmap;
    };
    ImageEditor.prepareFloater = function () {
        if (!this.floaterBitmap) {
            return null;
        }
        this.floaterBitmap.updateContext();
        this.floater = new createjs.Bitmap(this.floaterBitmap.canvas);
        this.floater.shadow = new createjs.Shadow("#ff0000", 2, 2, 0);
        return this.floater;
    };
    ImageEditor.create = function (stage, w, h, imageElement, overlayElement, underlayElement) {
        return new ImageEditor(stage, w, h, imageElement, overlayElement, underlayElement);
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
    ImageEditor.id = 0;
    ImageEditor.store = [];
    return ImageEditor;
}(mix_1.mix(id_man_1.default).with(drawer_mixin_1.Drawing, selection_mixin_1.Selection, display_mixin_1.Display, editor_mixin_1.Editor, state_mixin_1.State)));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ImageEditor;
//# sourceMappingURL=image-editor.js.map