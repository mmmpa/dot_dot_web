"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var gradation_color_1 = require("../../models/gradation-color");
exports.GradationMixin = function (superclass) { return (function (_super) {
    __extends(class_1, _super);
    function class_1() {
        _super.apply(this, arguments);
    }
    class_1.prototype.addGradation = function (color1, color2) {
        this.state.gradations.push(new gradation_color_1.default(color1, color2));
        this.setState({});
    };
    class_1.prototype.deleteGradation = function (gradation) {
        var gradations = this.state.gradations;
        _.remove(gradations, gradation);
        this.setState({ gradations: gradations });
    };
    class_1.prototype.changeGradationColor = function (target, gradation, color) {
        gradation[target] = color;
        this.setState({});
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=gradation-mixin.js.map