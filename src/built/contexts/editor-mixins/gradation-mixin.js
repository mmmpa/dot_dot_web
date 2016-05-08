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
    class_1.prototype.addGradation = function () {
        var gradations = this.state.gradations;
        gradations.push(new gradation_color_1.default(this.leftColor, this.rightColor));
        this.setState({ gradations: gradations });
    };
    class_1.prototype.removeGradation = function (gradation) {
        var gradations = this.state.gradations;
        _.remove(gradations, function (g) { return g === gradation; });
        this.setState({ gradations: gradations });
    };
    class_1.prototype.changeGradationColor = function (target, gradation, color) {
        gradation.changeColor(target, color);
        this.setState({});
    };
    return class_1;
}(superclass)); };
//# sourceMappingURL=gradation-mixin.js.map