import ARGB from "./argb";
import * as _ from 'lodash';

export default class ColorSet {
  constructor(public colors:ARGB[] = [], public version = 0) {

  }

  add(color:ARGB) {
    console.log(color.clone())
    this.colors.push(color.clone());
    this.version++;
  }

  remove(color:ARGB) {
    _.remove(this.colors, (c)=> c === color);
    this.version++;
  }
}