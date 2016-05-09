"use strict";
var _ = require('lodash');
var Plate = (function () {
    function Plate(name_) {
        this.name_ = name_;
        this._initialize();
    }
    Plate.prototype._initialize = function () {
        var raw = window.localStorage.getItem(this.name_);
        this.raw_ = raw ? JSON.parse(raw) : {};
    };
    Plate.prototype.reload = function () {
        this._initialize();
    };
    Plate.prototype.save = function () {
        window.localStorage.setItem(this.name_, JSON.stringify(this.raw_));
    };
    Plate.prototype.read = function (key) {
        if (this['get_' + key]) {
            return this['get_' + key]();
        }
        else {
            return this.readRaw(key);
        }
    };
    Plate.prototype.readRaw = function (key) {
        return this.raw_[key];
    };
    Plate.prototype.write = function (key, value, save) {
        if (save === void 0) { save = true; }
        if (this['set_' + key]) {
            this['set_' + key](value);
        }
        else {
            this.writeRaw(key, value, save);
        }
    };
    Plate.prototype.writeRaw = function (key, value, save) {
        if (save === void 0) { save = true; }
        this.raw_[key] = value;
        save && this.save();
    };
    Plate.prototype.writeOnce = function (keyValue) {
        var _this = this;
        _.forEach(keyValue, function (v, k) {
            _this.write(k, v, false);
        });
        this.save();
    };
    Plate.prototype.readOnce = function () {
        var _this = this;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i - 0] = arguments[_i];
        }
        return _.reduce(keys, function (a, key) {
            a[key] = _this.read(key);
            return a;
        }, {});
    };
    return Plate;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Plate;
//# sourceMappingURL=plate.js.map