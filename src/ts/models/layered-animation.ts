import LayeredImage from './layered-image';
import DataURL from './data-url';

export default class LayeredAnimationFrame {
  constructor(public frames: LayeredImage[] = [], public selectedIndex = 0, public selectedLayerIndex = 0) {

  }

  get length(): number {
    return this.frames.length;
  }

  get selected(): LayeredImage {
    return this.frames[this.selectedIndex];
  }

  get selectedLayer(): DataURL {
    return this.frames[this.selectedIndex][this.selectedLayerIndex];
  }

  get layerCount() {
    return this.frames[0].layerCount;
  }

  select(index: number) {
    if (!this.frames[index]) {
      return;
    }
    this.selectedIndex = index;
  }

  selectNext() {
    this.select(this.selectedIndex + 1);
  }

  selectLayer(index) {
    this.selected.select(index);
    this.selectedLayerIndex = this.selected.selectedIndex;
  }

  move(n) {
    let target  = this.frames[this.selectedIndex + n];
    let replace = this.frames[this.selectedIndex];
    if (!target) {
      return;
    }
    this.frames[this.selectedIndex]     = target;
    this.frames[this.selectedIndex + n] = replace;
    this.select(this.selectedIndex + n);
  }

  addLayer() {
    this.frames.map((layeredImage) => layeredImage.add(this.selectedLayerIndex));
  }

  removeLayer() {
    this.frames.map((layeredImage) => layeredImage.remove(this.selectedLayerIndex));
  }

  moveLayerUpward() {
    this.selected.moveUpward(this.selectedLayerIndex, (movedLayerNumber) => {
      this.selectedLayerIndex = movedLayerNumber;
    });
  }

  moveLayerDownward() {
    this.selected.moveDownward(this.selectedLayerIndex, (movedLayerNumber) => {
      this.selectedLayerIndex = movedLayerNumber;
    });
  }

  cloneSelectedFrame() {
    this.frames.splice(this.selectedIndex, 0, this.selected.clone());
    this.selectNext();
  }

  removeSelectedFrame() {
    if (this.frames.length === 1) {
      return;
    }
    this.frames.splice(this.selectedIndex, 1);
  }
}
