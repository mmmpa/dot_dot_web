export default class ARGB {
  constructor(public a, public r, public g, public b) {

  }

  hexSupport(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
  }

  static number(argb) {
    let a = (argb >> 24) & 0xff;
    let r = (argb >> 16) & 0xff;
    let g = (argb >> 8) & 0xff;
    let b = (argb >> 0) & 0xff;

    return new ARGB(a, r, g, b);
  }

  get number() {
    return (this.a << 24) + (this.r << 16) + (this.g << 8) + this.b;
  }

  get hex() {
    return "#" + this.hexSupport(this.r) + this.hexSupport(this.g) + this.hexSupport(this.b);
  }

  toJson() {
    let {r, b, g, a} = this;
    return {r, g, b, a}
  }

  clone():ARGB {
    return ARGB.fromJson(this.toJson());
  }

  static fromJson(json):ARGB {
    let {r, b, g, a} = json;
    return new ARGB(a, r, g, b);
  }
}