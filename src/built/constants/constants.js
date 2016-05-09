"use strict";
var _ = require('lodash');
var argb_1 = require('../models/argb');
var color_set_1 = require('../models/color-set');
(function (Route) {
    Route[Route["Selector"] = 0] = "Selector";
    Route[Route["Editor"] = 1] = "Editor";
})(exports.Route || (exports.Route = {}));
var Route = exports.Route;
(function (Tool) {
    Tool[Tool["Pen"] = 0] = "Pen";
    Tool[Tool["Spuit"] = 1] = "Spuit";
})(exports.Tool || (exports.Tool = {}));
var Tool = exports.Tool;
exports.presetScale = [1, 2, 4, 8, 16, 32, 64];
(function (FloatingColorPaletteMode) {
    FloatingColorPaletteMode[FloatingColorPaletteMode["Delete"] = 0] = "Delete";
    FloatingColorPaletteMode[FloatingColorPaletteMode["Select"] = 1] = "Select";
    FloatingColorPaletteMode[FloatingColorPaletteMode["SelectBackground"] = 2] = "SelectBackground";
    FloatingColorPaletteMode[FloatingColorPaletteMode["SelectGraduation"] = 3] = "SelectGraduation";
})(exports.FloatingColorPaletteMode || (exports.FloatingColorPaletteMode = {}));
var FloatingColorPaletteMode = exports.FloatingColorPaletteMode;
exports.web = _.flatten(_.times(6, function (r) {
    return _.flatten(_.times(6, function (g) {
        return _.times(6, function (b) {
            return new argb_1.default(255, r * 51, g * 51, b * 51);
        });
    }));
}));
exports.nes = [
    new argb_1.default(255, 124, 124, 124),
    new argb_1.default(255, 0, 0, 252),
    new argb_1.default(255, 0, 0, 188),
    new argb_1.default(255, 68, 40, 188),
    new argb_1.default(255, 148, 0, 132),
    new argb_1.default(255, 168, 0, 32),
    new argb_1.default(255, 168, 16, 0),
    new argb_1.default(255, 136, 20, 0),
    new argb_1.default(255, 80, 48, 0),
    new argb_1.default(255, 0, 120, 0),
    new argb_1.default(255, 0, 104, 0),
    new argb_1.default(255, 0, 88, 0),
    new argb_1.default(255, 0, 64, 88),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 188, 188, 188),
    new argb_1.default(255, 0, 120, 248),
    new argb_1.default(255, 0, 88, 248),
    new argb_1.default(255, 104, 68, 252),
    new argb_1.default(255, 216, 0, 204),
    new argb_1.default(255, 228, 0, 88),
    new argb_1.default(255, 248, 56, 0),
    new argb_1.default(255, 228, 92, 16),
    new argb_1.default(255, 172, 124, 0),
    new argb_1.default(255, 0, 184, 0),
    new argb_1.default(255, 0, 168, 0),
    new argb_1.default(255, 0, 168, 68),
    new argb_1.default(255, 0, 136, 136),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 248, 248, 248),
    new argb_1.default(255, 60, 188, 252),
    new argb_1.default(255, 104, 136, 252),
    new argb_1.default(255, 152, 120, 248),
    new argb_1.default(255, 248, 120, 248),
    new argb_1.default(255, 248, 88, 152),
    new argb_1.default(255, 248, 120, 88),
    new argb_1.default(255, 252, 160, 68),
    new argb_1.default(255, 248, 184, 0),
    new argb_1.default(255, 184, 248, 24),
    new argb_1.default(255, 88, 216, 84),
    new argb_1.default(255, 88, 248, 152),
    new argb_1.default(255, 0, 232, 216),
    new argb_1.default(255, 120, 120, 120),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 252, 252, 252),
    new argb_1.default(255, 164, 228, 252),
    new argb_1.default(255, 184, 184, 248),
    new argb_1.default(255, 216, 184, 248),
    new argb_1.default(255, 248, 184, 248),
    new argb_1.default(255, 248, 164, 192),
    new argb_1.default(255, 240, 208, 176),
    new argb_1.default(255, 252, 224, 168),
    new argb_1.default(255, 248, 216, 120),
    new argb_1.default(255, 216, 248, 120),
    new argb_1.default(255, 184, 248, 184),
    new argb_1.default(255, 184, 248, 216),
    new argb_1.default(255, 0, 252, 252),
    new argb_1.default(255, 216, 216, 216),
    new argb_1.default(255, 0, 0, 0),
    new argb_1.default(255, 0, 0, 0),
];
exports.colorPreset = {
    sfc: {
        title: 'SFC',
        colorSet: new color_set_1.default(exports.nes),
    },
    web: {
        title: 'Webセーフカラー',
        colorSet: new color_set_1.default(exports.web),
    },
};
//# sourceMappingURL=constants.js.map