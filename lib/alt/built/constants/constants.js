"use strict";
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
(function (FloatingColorPaletteMode) {
    FloatingColorPaletteMode[FloatingColorPaletteMode["Delete"] = 0] = "Delete";
    FloatingColorPaletteMode[FloatingColorPaletteMode["Select"] = 1] = "Select";
    FloatingColorPaletteMode[FloatingColorPaletteMode["SelectBackground"] = 2] = "SelectBackground";
    FloatingColorPaletteMode[FloatingColorPaletteMode["SelectGraduation"] = 3] = "SelectGraduation";
})(exports.FloatingColorPaletteMode || (exports.FloatingColorPaletteMode = {}));
var FloatingColorPaletteMode = exports.FloatingColorPaletteMode;
//# sourceMappingURL=constants.js.map