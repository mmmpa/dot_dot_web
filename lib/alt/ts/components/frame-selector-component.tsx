import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ColorCellSet from "./color-cell-set";
import {FloatingColorPaletteMode} from "../constants/constants";
import LayeredImage from "../models/layered-image";

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
    return this.props.frames.map((image, frameNumber)=> {
      let onClick = ()=> this.dispatch('frame:select', frameNumber)
      return <FrameSelectorCellComponent {...{image, onClick}}/>
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
            <button className="delete icon-button" onClick={(e)=> this.dispatch('floater:rise', e,FloatingColorPaletteMode.Delete)}>
              <Fa icon="backward"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('color:add')}>
              <Fa icon="play"/>
            </button>
            <button className="delete icon-button" onClick={(e)=> this.dispatch('floater:rise', e,FloatingColorPaletteMode.Delete)}>
              <Fa icon="forward"/>
            </button>
          </div>
          <div className="edit">
            <button className="delete icon-button" onClick={(e)=> this.dispatch('floater:rise', e,FloatingColorPaletteMode.Delete)}>
              <Fa icon="trash"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('color:add')}>
              <Fa icon="plus-circle"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('color:add')}>
              <Fa icon="hand-o-left"/>
            </button>
            <button className="add icon-button" onClick={()=> this.dispatch('color:add')}>
              <Fa icon="hand-o-right"/>
            </button>
          </div>
        </div>
      </section>
    </div>
  }
}

class FrameSelectorCellComponent extends React.Component<{image:LayeredImage, onClick:()=>void},{}> {
  componentWillMount() {
    this.componentWillReceiveProps(this.props)
  }

  shouldComponentUpdate(props) {
    let {image} = props;
    let {version} = image;
    return image!== this.state.imagge || version === 0 || version !== this.state.version
  }

  componentWillReceiveProps(props) {
    this.setState({
      version: props.image.version,
      image: props.image
    })
  }

  render() {
    let {image, onClick} = this.props;

    return <div className="frame-cell"><img src={image.raw(0)} style={image.scale(2)} onClick={()=> onClick()}/></div>
  }
}