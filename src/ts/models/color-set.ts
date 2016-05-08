import ARGB from "./argb";
import * as _ from 'lodash';
import IDMan from '../libs/id-man';

export default class ColorSet extends IDMan {
  constructor(public colors:ARGB[] = [], public version = 0) {
    super();
  }

  add(color:ARGB) {
    this.colors.push(color.clone());
    this.version++;
  }

  remove(color:ARGB) {
    _.remove(this.colors, (c)=> c === color);
    this.version++;
  }
}