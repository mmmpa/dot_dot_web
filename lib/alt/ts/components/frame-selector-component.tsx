import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import LayeredImage from "../models/layered-image";
import StepperInput from "./stepper-input";
import DataURL from "../models/data-url";

interface P {
  frames:LayeredImage[],
  frameNumber:number
}

export default class FrameSelectorComponent extends Cell<P,{}> {
  shouldComponentUpdate(props) {
    return !!props.frames
  }

  writeFrames() {
    let {selectedFrameNumber, framesScale, frames} = this.props;

    let scale = framesScale;
    return frames.map((image, frameNumber)=> {
      let onClick = (layerNumber)=> this.dispatch('frame:select', frameNumber, layerNumber)
      return <FrameSelectorCellComponent {...{scale, image, onClick, selected: frameNumber === selectedFrameNumber}}/>
    })
  }

  render() {
    return <div className="cell x frame-selector" style={this.layoutStyle}>
      <header className="cell-header">{this.myName}</header>
      <section className="cell-body">
        <div className="frames">
          {this.writeFrames()}
        </div>
        <div className="controller">
          <div className="edit">
            <StepperInput value={this.props.frameRate} onChange={(v)=> this.dispatch('frame:rate', v)}/>
            <StepperInput value={this.props.framesScale} onChange={(v)=> this.dispatch('frame:scale', v)}/>
            <button className="delete icon-button" onClick={(e)=> this.dispatch('frame:previous')}>
              <Fa icon="backward"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('frame:play', this.props.frameRate)}>
              <Fa icon="play"/>
            </button>
            <button className="delete icon-button" onClick={(e)=> this.dispatch('frame:next')}>
              <Fa icon="forward"/>
            </button>
          </div>
          <div className="edit">
            <button className="delete icon-button" onClick={(e)=> this.dispatch('frame:delete')}>
              <Fa icon="trash"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('frame:add')}>
              <Fa icon="plus-circle"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('frame:move:backward')}>
              <Fa icon="hand-o-left"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('frame:move:forward')}>
              <Fa icon="hand-o-right"/>
            </button>
          </div>
        </div>
      </section>
    </div>
  }
}

class FrameSelectorCellComponent extends React.Component<{scale:number, image:LayeredImage, selected:boolean, onClick:()=>void},{}> {
  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  shouldComponentUpdate(props) {
    let {image} = props;
    let {version} = image;
    return true
  }

  componentWillReceiveProps(props) {
    this.setState({
      version: props.image.version,
      image: props.image
    })
  }

  get detectedClassName() {
    return "frame-cell" + (this.props.selected ? ' selected' : '');
  }

  writeLayers() {
    let {image, onClick} = this.props;
    if(!image){
      return
    }
    return image.dataURLs.map((dataURL, layerNumber)=> {
      return <LayerSelectorCellComponent {...{dataURL, onClick, selected: layerNumber === selectedLayerNumber}}/>
    })
  }

  render() {
    let {image, onClick} = this.props;

    return <div className={this.detectedClassName}><img src={image.combined} style={image.scale(this.props.scale)} onClick={()=> onClick()}/>{this.writeLayers()}</div>
  }
}

class LayerSelectorCellComponent extends React.Component<{dataURL:DataURL, selected:boolean, onClick:()=>void},{}> {
  get detectedClassName() {
    return "frame-cell" + (this.props.selected ? ' selected' : '');
  }

  render() {
    let {dataURL, onClick} = this.props;

    return <div className={this.detectedClassName}><img src={dataURL} onClick={()=> onClick()}/></div>
  }
}