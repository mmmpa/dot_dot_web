"use strict";
var FileInformation = (function () {
    function FileInformation(name, layerCount, frameCount) {
        if (layerCount === void 0) { layerCount = 1; }
        if (frameCount === void 0) { frameCount = 1; }
        this.name = name;
        this.layerCount = layerCount;
        this.frameCount = frameCount;
    }
    FileInformation.parseFileName = function (fileName) {
        var splat = fileName.split('.');
        if (splat.length !== 4) {
            return new FileInformation(splat[0]);
        }
        else {
            return new FileInformation(splat[0].split('_').shift(), +splat[1], +splat[2]);
        }
    };
    return FileInformation;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FileInformation;
//# sourceMappingURL=file-information.js.map