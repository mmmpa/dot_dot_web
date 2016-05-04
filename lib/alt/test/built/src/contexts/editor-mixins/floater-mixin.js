"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
exports.FloaterMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.riseFloater = function (e, floatingCallback) {
        var _this = this;
        var floatingFrom = e.currentTarget;
        this.setState({ floatingCallback: floatingCallback, floatingFrom: floatingFrom }, function () {
            var remove = function () {
                $(window).unbind('click', remove);
                _this.setState({ floatingCallback: null, floatingFrom: null });
            };
            setTimeout(function () {
                $(window).bind('click', remove);
            }, 1);
        });
    };
    class_1.prototype.selectColorFromFloater = function (callback) {
        callback();
        this.setState({ floatingCallback: null, floatingFrom: null });
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=floater-mixin.js.map