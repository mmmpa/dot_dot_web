"use strict";
var KeyControl = (function () {
    function KeyControl(callback) {
        var _this = this;
        this.callback = callback;
        this.downStore = {};
        $(window).keydown(function (e) {
            _this.down(e.keyCode);
            _this.check(e);
        });
        $(window).keyup(function (e) {
            _this.up(e.keyCode);
            _this.strike(null, e);
        });
    }
    KeyControl.prototype.down = function (code) {
        this.downStore[code] = true;
    };
    KeyControl.prototype.up = function (code) {
        this.downStore[code] = false;
    };
    KeyControl.prototype.isDown = function (code) {
        return this.downStore[code];
    };
    KeyControl.prototype.check = function (e) {
        if (this.isDown(32)) {
            return this.strike('slide', e);
        }
        var string = 'on';
        if (e.altKey) {
            string += 'Alt';
        }
        if (e.ctrlKey) {
            string += 'Control';
        }
        if (e.shiftKey) {
            string += 'Shift';
        }
        string += e.code.replace('Key', '');
        this.strike(string, e);
    };
    KeyControl.prototype.strike = function (name, e) {
        console.log(name, e);
        this.callback(name);
        this.hook && this.hook(name, e);
    };
    KeyControl.prototype.codeEnum = function (code) {
        switch (code) {
            case 'Space':
                return Code.Space;
        }
    };
    return KeyControl;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = KeyControl;
var Code;
(function (Code) {
    Code[Code["Space"] = 0] = "Space";
})(Code || (Code = {}));
//# sourceMappingURL=key-control.js.map