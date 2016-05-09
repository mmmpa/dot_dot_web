"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var id_man_1 = require('../libs/id-man');
var DataURL = (function (_super) {
    __extends(DataURL, _super);
    function DataURL(data, version) {
        if (version === void 0) { version = 0; }
        _super.call(this);
        this.data = data;
        this.version = version;
    }
    DataURL.prototype.update = function (dataURL) {
        this.data = dataURL.data;
        this.version++;
    };
    return DataURL;
}(id_man_1.default));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DataURL;
//# sourceMappingURL=data-url.js.map