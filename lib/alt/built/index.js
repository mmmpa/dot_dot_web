/// <reference path="./typings/browser.d.ts" />
"use strict";
var React = require('react');
var ReactDOM = require('react-dom');
var constants_1 = require('./constants/constants');
var main_context_1 = require("./contexts/main-context");
var editor_context_1 = require("./contexts/editor-context");
var editor_context_2 = require("./contexts/editor-context");
var selector_component_1 = require("./components/selector-component");
var editor_component_1 = require("./components/editor-component");
var DotDot = (function () {
    function DotDot() {
    }
    DotDot.run = function (dom) {
        ReactDOM.render(React.createElement("article", {className: "dot-body"}, React.createElement(main_context_1.default, null, React.createElement(editor_context_2.default, {route: constants_1.Route.Selector}, React.createElement(selector_component_1.default, null)), React.createElement(editor_context_1.default, {route: constants_1.Route.Editor}, React.createElement(editor_component_1.default, null)))), dom);
    };
    return DotDot;
}());
DotDot.run(document.getElementById('editor'));
//# sourceMappingURL=index.js.map