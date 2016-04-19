import * as _ from 'lodash';
import ARGB from "./argb";

export default class GradationColor {
  public colors:ARGB[];

  constructor(private _color1 = new ARGB(255, 0, 0, 0), private _color2 = new ARGB(255, 255, 255, 255), private length:number = 10, public version = 0) {
    this.compute();
  }

  set color1(v) {
    this._color1 = v;
    this.compute();
  }

  set color2(v) {
    this._color2 = v;
    this.compute();
  }

  get color1() {
    return this._color1;
  }

  get color2() {
    return this._color2;
  }

  compute() {
    let steps = _.reduce(['r', 'g', 'b'], (a, argb)=> {
      a[argb] = (this._color2[argb] - this._color1[argb]) / (this.length - 1);
      return a;
    }, {a: 255});

    this.colors = _.times(this.length - 1, (n)=> {
      let {a, r, g, b} = _.reduce(['r', 'g', 'b'], (a, argb)=> {
        a[argb] = Math.round(this._color1[argb] + steps[argb] * n);
        return a;
      }, {a: 255});

      return new ARGB(a, r, g, b);
    });

    let last = this._color2.clone();
    last.a = 255;

    this.colors.push(last);
    this.version++;
  }
}