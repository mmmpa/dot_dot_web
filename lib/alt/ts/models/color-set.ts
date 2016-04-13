import ARGB from "./argb";
export default class ColorSet {
  constructor(public colors:ARGB[] = [], public version = 0) {

  }

  add(color:ARGB) {
    this.colors.push(color);
    this.version++;
  }
}