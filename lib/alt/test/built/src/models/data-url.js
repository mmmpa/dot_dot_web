"use strict";
var DataURL = (function () {
    function DataURL(data, version) {
        if (version === void 0) { version = 0; }
        this.data = data;
        this.version = version;
    }
    DataURL.prototype.update = function (dataURL) {
        this.data = dataURL.data;
        this.version++;
    };
    return DataURL;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataURL;
//# sourceMappingURL=data-url.js.map