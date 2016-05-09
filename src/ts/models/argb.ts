export default class ARGB {
  static fromNumber(argb) {
    let a = (argb >> 24) & 0xff;
    let r = (argb >> 16) & 0xff;
    let g = (argb >> 8) & 0xff;
    let b = (argb >> 0) & 0xff;

    return new ARGB(a, r, g, b);
  }

  static fromJson(json): ARGB {
    let {r, b, g, a} = json;
    return new ARGB(a, r, g, b);
  }

  static hexSupport(c) {
    let hex = c.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }

  constructor(public a, public r, public g, public b) {

  }

  get css() {
    let {a, r, g, b} = this;
    let floatA = a / 255;
    return `rgba(${[r, g, b, floatA].join(',')})`;
  }

  get hex() {
    return '#' + ARGB.hexSupport(this.r) + ARGB.hexSupport(this.g) + ARGB.hexSupport(this.b);
  }

  get number() {
    return ((this.a << 24) + (this.r << 16) + (this.g << 8) + this.b) >>> 0;
  }

  clone(): ARGB {
    return ARGB.fromJson(this.toJson());
  }

  toJson() {
    let {r, b, g, a} = this;
    return {r, g, b, a};
  }

}
