const assert = require('power-assert');
import * as _ from 'lodash';
import ARGB from "../ts/models/argb";
import GradationColor from '../ts/models/gradation-color';

describe('Card', ()=> {
  describe('作成', ()=> {
    it('グラデーションの数', ()=> {
      let g = new GradationColor(undefined, undefined, 10);
      assert.ok(g.colors.length === 10);
    });

    it('グラデーションの変化', ()=> {
      let g = new GradationColor(new ARGB(255, 1, 1, 1), new ARGB(255, 10, 10, 10), 10);
      assert.deepEqual(g.colors.map(({r})=> r), [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    });

    it('バージョン変化', ()=> {
      let g    = new GradationColor(new ARGB(255, 1, 1, 1), new ARGB(255, 10, 10, 10));
      let {version} = g;
      g.color1 = new ARGB(255, 1, 1, 1);
      assert.ok(version !== g.version);
    });
  });
});
