"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var events_1 = require('events');
var React = require('react');
var _ = require('lodash');
exports.EventingShared = {
    emitter: React.PropTypes.any,
};
var Good = (function (_super) {
    __extends(Good, _super);
    function Good() {
        _super.apply(this, arguments);
        this.eventStore = [];
    }
    Object.defineProperty(Good, "contextTypes", {
        get: function () {
            return exports.EventingShared;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Good, "childContextTypes", {
        get: function () {
            return exports.EventingShared;
        },
        enumerable: true,
        configurable: true
    });
    Good.prototype.getChildContext = function () {
        return { emitter: this.emitter };
    };
    Good.prototype.addEventSafety = function (target) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        this.eventStore.push([target].concat(args));
        target.addEventListener.apply(target, args);
    };
    Good.prototype.removeEventAll = function () {
        this.eventStore.forEach(function (_a) {
            var target = _a[0], args = _a.slice(1);
            return target.removeEventListener.apply(target, args);
        });
    };
    Good.prototype.dispatch = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return (_a = (this.emitter || this.props.emitter)).emit.apply(_a, [event].concat(args));
        var _a;
    };
    Object.defineProperty(Good.prototype, "emitter", {
        get: function () {
            return this.context.emitter || this.emitter_ || (this.emitter_ = new events_1.EventEmitter());
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Good.prototype, "myName", {
        get: function () {
            if (this.myName_) {
                return this.myName_;
            }
            return this.myName_ = this.constructor.toString().match(/function[ ]+([a-zA-Z0-9_]+)/)[1];
        },
        enumerable: true,
        configurable: true
    });
    Good.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i - 0] = arguments[_i];
        }
        // console.log(this.myName, ...args)
    };
    Good.prototype.componentWillMount = function () {
        this.debug('componentWillMount');
        this.removeEventAll();
    };
    Good.prototype.componentDidMount = function () {
        this.debug('componentDidMount');
    };
    Good.prototype.componentWillReceiveProps = function (nextProps) {
        // this.debug('componentWillReceiveProps');
    };
    Good.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        // this.debug('shouldComponentUpdate');
        return true;
    };
    Good.prototype.componentWillUpdate = function (nextProps, nextState) {
        // this.debug('componentWillUpdate');
    };
    Good.prototype.componentDidUpdate = function (prevProps, prevState) {
        // this.debug('componentDidUpdate');
    };
    Good.prototype.componentWillUnmount = function () {
        this.debug('componentWillUnmount');
    };
    Good.prototype.relayingProps = function () {
        var props = _.assign({ emitter: this.emitter || this.props.emitter }, this.props, this.state);
        delete props.children;
        return props;
    };
    Good.prototype.relay = function (children) {
        var props = this.relayingProps();
        return children.map(function (child, key) { return React.cloneElement(child, _.assign(props, { key: key })); });
    };
    return Good;
}(React.Component));
exports.Good = Good;
var Parcel = (function (_super) {
    __extends(Parcel, _super);
    function Parcel(props) {
        _super.call(this, props);
        this.addedOnStore = [];
        this.acceptable = {};
    }
    Parcel.prototype.componentWillUnmount = function () {
        var _this = this;
        var removed = this.addedOnStore.map(function (store) {
            _this.emitter.removeListener(store.eventName, store.callback);
            return store.eventName;
        });
        _super.prototype.componentWillUnmount.call(this);
    };
    Parcel.prototype.componentWillMount = function () {
        var _this = this;
        this.listen(function (key, eventName, callback) {
            console.log(eventName);
            _this.addedOnStore.push({ eventName: eventName, callback: callback });
            _this.acceptable[key] = true;
            if (key) {
                _this.emitter.on(eventName, function () {
                    var args = [];
                    for (var _i = 0; _i < arguments.length; _i++) {
                        args[_i - 0] = arguments[_i];
                    }
                    _this.acceptable[key] && callback.apply(void 0, args);
                });
            }
            else {
                _this.emitter.on(eventName, callback);
            }
        });
        _super.prototype.componentWillMount.call(this);
    };
    Parcel.prototype.lock = function (key) {
        this.acceptable[key] = false;
    };
    Parcel.prototype.unlock = function (key) {
        this.acceptable[key] = true;
    };
    Object.defineProperty(Parcel.prototype, "children", {
        get: function () {
            if (this.routeChildren) {
                return this.routeChildren;
            }
            var children = this.props.children;
            return !!children.map ? children : [children];
        },
        enumerable: true,
        configurable: true
    });
    Parcel.prototype.render = function () {
        return React.createElement("div", {className: "context-wrapper"}, this.relay(this.children));
    };
    return Parcel;
}(Good));
exports.Parcel = Parcel;
//# sourceMappingURL=parcel.js.map