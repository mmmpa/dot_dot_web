export default class StyleStylist {
  constructor(private x, private y, private w, private h) {

  }

  get css() {
    return {
      left: this.x + 'px',
      top: this.y + 'px',
      width: this.w + 'px',
      height: this.h + 'px',
    }
  }
}