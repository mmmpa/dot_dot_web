"use strict";
var HistoryStack = (function () {
    function HistoryStack(length) {
        if (length === void 0) { length = 10; }
        this.length = length;
        // 固定長配列と終端を表すundefinedで循環配列として利用する
        this.history = [];
        this.position = 0;
        // ヒストリー終端の目印分
        this.length++;
    }
    // 処理を現在のヒストリーに登録し、ヒストリーをすすめる。
    // すすめた先のヒストリーに登録されているものを削除してリドゥ不可能にする。
    HistoryStack.prototype.stock = function (command) {
        this.now = this.toArray(command);
        this.stepForward();
        this.dispose();
    };
    // 処理を一つ前のヒストリーと統合する
    // ヒストリーはすすまない
    HistoryStack.prototype.stockPrevious = function (command) {
        var _this = this;
        var previous = this.previous;
        if (!previous) {
            return;
        }
        // commandが配列の場合はバラして登録先の配列に挿入する
        if (command.slice) {
            command.forEach(function (c) { return _this.stockPrevious(c); });
        }
        else {
            this.previous.push(command);
        }
    };
    // ヒストリーを一つもどし、down処理を実行する。
    // ヒストリーに変化は生じない。
    HistoryStack.prototype.undo = function () {
        if (!this.isUndoable) {
            return;
        }
        this.stepBackward();
        for (var i = this.now.length; i--;) {
            this.now[i].down();
        }
    };
    // 現在のヒストリーのup動作を実行し、ヒストリーを一つすすめる。
    // ヒストリーに変化は生じない。
    HistoryStack.prototype.redo = function () {
        if (!this.isRedoable) {
            return;
        }
        this.now.forEach(function (s) { return s.up(); });
        this.stepForward();
    };
    HistoryStack.prototype.stepBackward = function () {
        this.position === 0
            ? this.position = this.length - 1
            : this.position--;
    };
    HistoryStack.prototype.stepForward = function () {
        this.position === this.length - 1
            ? this.position = 0
            : this.position++;
    };
    HistoryStack.prototype.toArray = function (element) {
        return !!element.slice ? element : [element];
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
        this.now && delete this.history[this.position];
    };
    return HistoryStack;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HistoryStack;
//# sourceMappingURL=history-stack.js.map