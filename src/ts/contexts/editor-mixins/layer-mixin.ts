export let LayerMixin = (superclass) => class extends superclass {
  addLayer() {
    this.state.frames.addLayer();
    this.dispatch('frame:select');
  }

  removeLayer() {
    this.state.frames.removeLayer();
    this.dispatch('frame:select', null);
  }

  moveLayerUpward() {
    this.state.frames.moveLayerUpward();
    this.dispatch('frame:select');
  }

  moveLayerDownward() {
    this.state.frames.moveLayerDownward();
    this.dispatch('frame:select');
  }
};
