"use strict";
var LayeredAnimationFrame = (function () {
    function LayeredAnimationFrame(frames, selectedIndex, selectedLayerIndex) {
        if (frames === void 0) { frames = []; }
        if (selectedIndex === void 0) { selectedIndex = 0; }
        if (selectedLayerIndex === void 0) { selectedLayerIndex = 0; }
        this.frames = frames;
        this.selectedIndex = selectedIndex;
        this.selectedLayerIndex = selectedLayerIndex;
    }
    Object.defineProperty(LayeredAnimationFrame.prototype, "length", {
        get: function () {
            return this.frames.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayeredAnimationFrame.prototype, "selected", {
        get: function () {
            return this.frames[this.selectedIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayeredAnimationFrame.prototype, "selectedLayer", {
        get: function () {
            return this.frames[this.selectedIndex][this.selectedLayerIndex];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayeredAnimationFrame.prototype, "layerCount", {
        get: function () {
            return this.frames[0].layerCount;
        },
        enumerable: true,
        configurable: true
    });
    LayeredAnimationFrame.prototype.select = function (index) {
        if (!this.frames[index]) {
            return;
        }
        this.selectedIndex = index;
    };
    LayeredAnimationFrame.prototype.selectNext = function () {
        this.select(this.selectedIndex + 1);
    };
    LayeredAnimationFrame.prototype.selectLayer = function (index) {
        this.selected.select(index);
        this.selectedLayerIndex = this.selected.selectedIndex;
    };
    LayeredAnimationFrame.prototype.move = function (n) {
        var target = this.frames[this.selectedIndex + n];
        var replace = this.frames[this.selectedIndex];
        if (!target) {
            return;
        }
        this.frames[this.selectedIndex] = target;
        this.frames[this.selectedIndex + n] = replace;
        this.select(this.selectedIndex + n);
    };
    LayeredAnimationFrame.prototype.addLayer = function () {
        var _this = this;
        this.frames.map(function (layeredImage) { return layeredImage.add(_this.selectedLayerIndex); });
    };
    LayeredAnimationFrame.prototype.removeLayer = function () {
        var _this = this;
        this.frames.map(function (layeredImage) { return layeredImage.remove(_this.selectedLayerIndex); });
    };
    LayeredAnimationFrame.prototype.moveLayerUpward = function () {
        var _this = this;
        this.selected.moveUpward(this.selectedLayerIndex, function (movedLayerNumber) {
            _this.selectedLayerIndex = movedLayerNumber;
        });
    };
    LayeredAnimationFrame.prototype.moveLayerDownward = function () {
        var _this = this;
        this.selected.moveDownward(this.selectedLayerIndex, function (movedLayerNumber) {
            _this.selectedLayerIndex = movedLayerNumber;
        });
    };
    LayeredAnimationFrame.prototype.cloneSelectedFrame = function () {
        this.frames.splice(this.selectedIndex, 0, this.selected.clone());
        this.selectNext();
    };
    LayeredAnimationFrame.prototype.removeSelectedFrame = function () {
        if (this.frames.length === 1) {
            return;
        }
        this.frames.splice(this.selectedIndex, 1);
    };
    return LayeredAnimationFrame;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = LayeredAnimationFrame;
//# sourceMappingURL=layered-animation.js.map