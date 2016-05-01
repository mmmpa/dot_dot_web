import FileInformation from "../../models/file-information";
import LayeredImage from "../../models/layered-image";

export let LayerMixin = (superclass) => class extends superclass {
  addLayer(){
    let {frames, layerNumber} = this.state;
    frames.forEach((layeredImage)=>layeredImage.add(layerNumber))
  }
  
  removeLayer(){
    let {frames, layerNumber} = this.state;
    frames.forEach((layeredImage)=>layeredImage.remove(layerNumber))
  }
  
  selectLayer(index:number){
    
  }
};