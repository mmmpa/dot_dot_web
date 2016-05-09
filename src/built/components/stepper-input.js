"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var React = require('react');
var StepperInput = (function (_super) {
    __extends(StepperInput, _super);
    function StepperInput() {
        _super.apply(this, arguments);
    }
    Object.defineProperty(StepperInput.prototype, "input", {
        get: function () {
            return this.refs.input;
        },
        enumerable: true,
        configurable: true
    });
    StepperInput.prototype.onWheel = function (e) {
        var value = this.state.value;
        if (e.deltaY < 0) {
            value += 1;
        }
        else {
            value -= 1;
        }
        if (value < 1) {
            value = 1;
        }
        this.props.onChange(value);
        this.setState({ value: value });
    };
    StepperInput.prototype.componentWillMount = function () {
        this.setState({
            value: this.props.value || 1,
        });
    };
    StepperInput.prototype.componentDidMount = function () {
        this.onWheel = this.onWheel.bind(this);
        this.input.addEventListener('mousewheel', this.onWheel);
    };
    StepperInput.prototype.componentWillUnmount = function () {
        this.input.removeEventListener('mousewheel', this.onWheel);
    };
    StepperInput.prototype.render = function () {
        var value = this.state.value;
        return React.createElement("input", __assign({type: "number", min: "1", max: "10", step: "1"}, { value: isNaN(value) ? 4 : value }, {ref: "input"}));
    };
    return StepperInput;
}(React.Component));
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StepperInput;
//# sourceMappingURL=stepper-input.js.map