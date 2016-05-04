const assert = require('power-assert');
import HistoryStack from './src/models/history-stack';

describe('HistoryStack', ()=> {
  describe('', ()=> {
    it('基本', ()=> {
      let stack = new HistoryStack();
      let target = 0;

      let action = (n)=>{
        let old = target;
        target = n;
        stack.stock({
          down: ()=>{
            target = old;
          },
          up: ()=>{
            target = n;
          }
        })
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

    it('アンドゥ後のアクションでリドゥ不可', ()=> {
      let stack = new HistoryStack();
      let target = 0;

      let action = (n)=>{
        let old = target;
        target = n;
        stack.stock({
          down: ()=>{
            target = old;
          },
          up: ()=>{
            target = n;
          }
        })
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

    it('ヒストリー上限に達すると古いものから消える', ()=> {
      let stack = new HistoryStack(3);
      let target = 0;

      let action = (n)=>{
        let old = target;
        target = n;
        stack.stock({
          down: ()=>{
            target = old;
          },
          up: ()=>{
            target = n;
          }
        })
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
