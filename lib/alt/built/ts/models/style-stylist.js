"use strict";
var StyleStylist = (function () {
    function StyleStylist(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    Object.defineProperty(StyleStylist.prototype, "css", {
        get: function () {
            return {
                left: this.x + 'px',
                top: this.y + 'px',
                width: this.w + 'px',
                height: this.h + 'px',
            };
        },
        enumerable: true,
        configurable: true
    });
    return StyleStylist;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StyleStylist;
//# sourceMappingURL=style-stylist.js.map