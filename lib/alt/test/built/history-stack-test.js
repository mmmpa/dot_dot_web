"use strict";
var assert = require('power-assert');
var history_stack_1 = require('./src/models/history-stack');
describe('HistoryStack', function () {
    describe('', function () {
        it('基本', function () {
            var stack = new history_stack_1.default();
            var target = 0;
            var action = function (n) {
                var old = target;
                target = n;
                stack.stock({
                    down: function () {
                        target = old;
                    },
                    up: function () {
                        target = n;
                    }
                });
            };
            action(1);
            action(2);
            action(3);
            action(4);
            action(5);
            assert.equal(target, 5);
            stack.undo();
            assert.equal(target, 4);
            stack.undo();
            assert.equal(target, 3);
            stack.undo();
            assert.equal(target, 2);
            stack.undo();
            assert.equal(target, 1);
            stack.undo();
            assert.equal(target, 0);
            stack.undo();
            assert.equal(target, 0);
            stack.redo();
            assert.equal(target, 1);
            stack.redo();
            assert.equal(target, 2);
            stack.redo();
            assert.equal(target, 3);
            stack.redo();
            assert.equal(target, 4);
            stack.redo();
            assert.equal(target, 5);
            stack.redo();
            assert.equal(target, 5);
        });
        it('アンドゥ後のアクションでリドゥ不可', function () {
            var stack = new history_stack_1.default();
            var target = 0;
            var action = function (n) {
                var old = target;
                target = n;
                stack.stock({
                    down: function () {
                        target = old;
                    },
                    up: function () {
                        target = n;
                    }
                });
            };
            action(1);
            action(2);
            action(3);
            action(4);
            action(5);
            assert.equal(target, 5);
            stack.undo();
            assert.equal(target, 4);
            stack.undo();
            assert.equal(target, 3);
            action(11);
            stack.redo();
            assert.equal(target, 11);
            stack.undo();
            assert.equal(target, 3);
            stack.redo();
            assert.equal(target, 11);
        });
        it('ヒストリー上限に達すると古いものから消える', function () {
            var stack = new history_stack_1.default(3);
            var target = 0;
            var action = function (n) {
                var old = target;
                target = n;
                stack.stock({
                    down: function () {
                        target = old;
                    },
                    up: function () {
                        target = n;
                    }
                });
            };
            action(1);
            action(2);
            action(3);
            action(4);
            action(5);
            assert.equal(target, 5);
            stack.undo();
            assert.equal(target, 4);
            stack.undo();
            assert.equal(target, 3);
            stack.undo();
            assert.equal(target, 2);
            stack.undo();
            assert.equal(target, 2);
            stack.redo();
            assert.equal(target, 3);
            stack.redo();
            assert.equal(target, 4);
            stack.redo();
            assert.equal(target, 5);
            stack.redo();
            assert.equal(target, 5);
        });
    });
});
//# sourceMappingURL=history-stack-test.js.map