import StyleStylist from "./style-stylist";

export default class ComponentSize {
  public version:number = 0;
  public toolWidth:number;
  public frameSelectorHeight:number;

  constructor({toolWidth, frameSelectorHeight}:{toolWidth?, frameSelectorHeight?}) {
    this.toolWidth = toolWidth || 406;
    this.frameSelectorHeight = frameSelectorHeight || 200;
  }

  update({toolWidth, frameSelectorHeight}:{toolWidth?, frameSelectorHeight?}) {
    toolWidth && (this.toolWidth = toolWidth);
    frameSelectorHeight && (this.frameSelectorHeight = frameSelectorHeight);
    this.version++;
  }

  compute(windowWidth, windowHeight) {
    let {toolWidth, frameSelectorHeight} = this;

    let canvasWidth = windowWidth - toolWidth;
    let canvasHeight = windowHeight - frameSelectorHeight;
    let toolX = canvasWidth;
    let split = (windowHeight - 140) / 4;

    return {
      // left column
      canvas: new StyleStylist(0, 0, canvasWidth, canvasHeight).css,
      frameSelector: new StyleStylist(0, canvasHeight, canvasWidth, frameSelectorHeight).css,

      // right column
      toolSelector: new StyleStylist(toolX, 0, toolWidth, split * 2).css,
      colorPalette: new StyleStylist(toolX, split * 2, toolWidth, split).css,
      gradationSelector: new StyleStylist(toolX, split * 3, toolWidth, split).css,
      colorController: new StyleStylist(toolX, split * 4, toolWidth, 140).css,

      // modal
      modal: new StyleStylist(0, 0, windowWidth, windowHeight).css
    }
  }
}