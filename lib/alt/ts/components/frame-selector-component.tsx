import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ColorCellSet from "./color-cell-set";
import {FloatingColorPaletteMode} from "../constants/constants";
import LayeredImage from "../models/layered-image";
import StepperInput from "./stepper-input";

interface P {
  frames:LayeredImage[],
  frameNumber:number
}

export default class FrameSelectorComponent extends Cell<P,{}> {
  componentWillMount() {
  }

  detectPosition(props) {
  }

  shouldComponentUpdate(props) {
    return !!props.frames
  }

  componentWillReceiveProps(props) {
  }

  writeFrames() {
    let scale = this.props.framesScale;
    return this.props.frames.map((image, frameNumber)=> {
      let onClick = ()=> this.dispatch('frame:select', frameNumber)
      return <FrameSelectorCellComponent {...{scale, image, onClick, selected: frameNumber === this.props.selectedFrameNumber}}/>
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
    return image !== this.state.imagge || version === 0 || version !== this.state.version
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

  render() {
    let {image, onClick} = this.props;

    return <div className={this.detectedClassName}><img src={image.raw(0)} style={image.scale(this.props.scale)} onClick={()=> onClick()}/></div>
  }
}