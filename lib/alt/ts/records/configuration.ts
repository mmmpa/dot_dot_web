import Plate from "../libs/plate";
import ARGB from "../models/argb";
import ColorSet from "../models/color-set";
import GradationColor from "../models/gradation-color";

export default class Configuration extends Plate {
  constructor() {
    super('dot-dot-configuration');
  }

  set_selectedColor(value) {
    this.writeRaw('selectedColor', value.toJson());
  }

  get_selectedColor() {
    let {a, r, g, b} = this.readRaw('selectedColor');
    return new ARGB(a, r, g, b);
  }

  set_colors(value) {
    this.writeRaw('colors', value.map((c)=> c.toJson()));
  }

  get_colors() {
    return this.readRaw('colors').map(({a, r, g, b})=> new ARGB(a, r, g, b));
  }

  set_gradations(value) {
    this.writeRaw('gradations', value.map(({color1, color2})=> ({color1: color1.toJson(), color2: color2.toJson()})));
  }

  get_gradations() {
    return this.readRaw('gradations').map(({color1, color2})=> {
      return new GradationColor(ARGB.fromJson(color1), ARGB.fromJson(color2))
    });
  }

  set_colorSet(value) {
    this.writeRaw('colorSet', value.colors.map((c)=> c.toJson()));
  }

  get_colorSet() {
    let colors = this.readRaw('colorSet').map(({a, r, g, b})=> new ARGB(a, r, g, b));
    return new ColorSet(colors);
  }
}