"use strict";
var assert = require('power-assert');
var argb_1 = require("./src/models/argb");
var gradation_color_1 = require('./src/models/gradation-color');
describe('Card', function () {
    describe('作成', function () {
        it('グラデーションの数', function () {
            var g = new gradation_color_1.default();
            assert.ok(g.colors.length === 10);
        });
        it('グラデーションの変化', function () {
            var g = new gradation_color_1.default(new argb_1.default(255, 1, 1, 1), new argb_1.default(255, 10, 10, 10));
            assert.deepEqual(g.colors.map(function (_a) {
                var r = _a.r;
                return r;
            }), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
        });
        it('バージョン変化', function () {
            var g = new gradation_color_1.default(new argb_1.default(255, 1, 1, 1), new argb_1.default(255, 10, 10, 10));
            var version = g.version;
            g.color1 = new argb_1.default(255, 1, 1, 1);
            assert.ok(version !== g.version);
        });
    });
});
//# sourceMappingURL=gradation-color-test.js.map