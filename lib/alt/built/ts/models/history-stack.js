"use strict";
var HistoryStack = (function () {
    function HistoryStack(length) {
        if (length === void 0) { length = 10; }
        this.length = length;
        this.history = [];
        this.position = 0;
        this.length++;
    }
    HistoryStack.prototype.stock = function (command) {
        this.now = command;
        this.stepForward();
        this.now && this.dispose();
    };
    HistoryStack.prototype.stockPrevious = function (command) {
        var previous = this.previous;
        if (!previous) {
            return;
        }
        if (!previous.slice) {
            this.history[this.position - 1] = [previous];
        }
        this.previous.push(command);
    };
    HistoryStack.prototype.undo = function () {
        if (!this.isUndoable) {
            return;
        }
        this.stepBackward();
        if (this.now.slice) {
            for (var i = this.now.length; i--;) {
                this.now[i].down();
            }
        }
        else {
            this.now.down();
        }
    };
    HistoryStack.prototype.redo = function () {
        if (!this.isRedoable) {
            return;
        }
        this.now.slice ? this.now.forEach(function (s) { return s.up(); }) : this.now.up();
        this.stepForward();
    };
    HistoryStack.prototype.stepForward = function () {
        this.position++;
        if (this.position === this.length) {
            this.position = 0;
        }
    };
    HistoryStack.prototype.stepBackward = function () {
        if (this.position === 0) {
            this.position = this.length - 1;
        }
        else {
            this.position--;
        }
    };
    Object.defineProperty(HistoryStack.prototype, "isUndoable", {
        get: function () {
            return !!this.previous;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistoryStack.prototype, "isRedoable", {
        get: function () {
            return !!this.now;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistoryStack.prototype, "previous", {
        get: function () {
            if (this.position === 0) {
                return this.history[this.length - 1];
            }
            else {
                return this.history[this.position - 1];
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(HistoryStack.prototype, "now", {
        get: function () {
            return this.history[this.position];
        },
        set: function (v) {
            this.history[this.position] = v;
        },
        enumerable: true,
        configurable: true
    });
    HistoryStack.prototype.dispose = function () {
        delete this.history[this.position];
    };
    return HistoryStack;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HistoryStack;
//# sourceMappingURL=history-stack.js.map