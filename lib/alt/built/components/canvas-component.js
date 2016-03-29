"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var parcel_1 = require("../libs/parcel");
var React = require("react");
var CanvasComponent = (function (_super) {
    __extends(CanvasComponent, _super);
    function CanvasComponent() {
        _super.apply(this, arguments);
    }
    CanvasComponent.prototype.componentDidMount = function () {
        _super.prototype.componentDidMount.call(this);
    };
    CanvasComponent.prototype.bitmapData = function () {
    };
    CanvasComponent.prototype.render = function () {
        var _this = this;
        return React.createElement("canvas", {ref: "canvas", onClick: function () { return _this.setState({}); }}, "canvas");
    };
    return CanvasComponent;
}(parcel_1.Good));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CanvasComponent;
/*

// 読み込み
 new createjs.BitmapData(HTMLImageElement)

// 新規作成
new createjs.BitmapData(null, 100, 100, 0xffff0000)

* */ 
//# sourceMappingURL=canvas-component.js.map