import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import LayeredImage from "../models/layered-image";
import StepperInput from "./stepper-input";
import DataURL from "../models/data-url";
import * as ReactAddons from "react-addons";
import BlurButton from "./blur-button";
const classSet = ReactAddons.classSet;

interface P {
  frames:LayeredImage[],
  frameNumber:number,
  framesScale:number
}

export default class FrameSelectorComponent extends Cell<P,{}> {
  shouldComponentUpdate(props) {
    return !!props.frames
  }

  writeFrames() {
    let {selectedFrameNumber, selectedLayerNumber, framesScale, frames} = this.props;

    let scale = framesScale;
    return frames.map((image, frameNumber)=> {
      let onClick = (layerNumber)=> this.dispatch('frame:select', frameNumber, layerNumber)
      return <FrameSelectorCellComponent {...{scale, image, onClick, selectedLayerNumber, selected: frameNumber === selectedFrameNumber}}/>
    })
  }

  resize(e){
    e.preventDefault();
    let pre = {x: e.pageX, y: e.pageY};

    let move = (e:MouseEvent)=> {
      let {pageX, pageY} = e;
      let moveX = pageX - pre.x;
      let moveY = pageY - pre.y;
      this.dispatch('component:resize', 'frameSelectorHeight', moveX, -moveY);
      pre = {x: pageX, y: pageY};
    };

    let clear = (e)=>{
      $(window).unbind('mouseup', clear);
      $(window).unbind('mousemove', move);
    };

    $(window).bind('mousemove', move);
    $(window).bind('mouseup', clear);
  }

  render() {
    return <div className="cell x frame-selector" style={this.layoutStyle}>
      <div className="resize-bar" onMouseDown={(e)=> this.resize(e)}>&nbsp;</div>
      <header className="cell-header">アニメーションフレームとレイヤー</header>
      <section className="cell-body">
        <div className="controller">
          <div className="edit">
            <StepperInput value={this.props.framesScale} onChange={(v)=> this.dispatch('frame:scale', v)}/>
            <BlurButton className="add icon-button" onClick={()=> this.dispatch('frame:play', this.props.frameRate)}>
              <Fa icon="play"/>
            </BlurButton>
          </div>
          <div className="edit">
            <BlurButton className="add icon-button" onClick={()=> this.dispatch('frame:add')}>
              <Fa icon="film"/> <Fa icon="plus-circle"/>
            </BlurButton>
            <BlurButton className="delete icon-button" onClick={(e)=> this.dispatch('frame:delete')}>
              <Fa icon="film"/> <Fa icon="trash"/>
            </BlurButton>
            <BlurButton className="add icon-button" onClick={()=> this.dispatch('layer:add')}>
              <Fa icon="copy"/> <Fa icon="plus-circle"/>
            </BlurButton>
            <BlurButton className="delete icon-button" onClick={(e)=> this.dispatch('layer:remove')}>
              <Fa icon="copy"/> <Fa icon="trash"/>
            </BlurButton>
            <BlurButton className="add icon-button" onClick={()=> this.dispatch('frame:move:backward')}>
              <Fa icon="hand-o-left"/>
            </BlurButton>
            <BlurButton className="add icon-button" onClick={()=> this.dispatch('frame:move:forward')}>
              <Fa icon="hand-o-right"/>
            </BlurButton>
            <BlurButton className="add icon-button" onClick={()=> this.dispatch('layer:move:upward')}>
              <Fa icon="hand-o-up"/>
            </BlurButton>
            <BlurButton className="add icon-button" onClick={()=> this.dispatch('layer:move:downward')}>
              <Fa icon="hand-o-down"/>
            </BlurButton>
          </div>
        </div>
        <div className="frames">
          {this.writeFrames()}
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

  get classes() {
    return classSet({
      'frame-cell': true,
      'selected': this.props.selected
    });
  }

  writeLayers() {
    let {image, onClick, selectedLayerNumber} = this.props;
    let style = image.scale(this.props.scale);
    if (!image) {
      return
    }
    return image.dataURLs.map((dataURL, layerNumber)=> {
      return <LayerSelectorCellComponent {...{style, dataURL, onClick, layerNumber, selected: layerNumber === selectedLayerNumber}}/>
    })
  }

  render() {
    let {image, onClick} = this.props;

    let style = image.scale(this.props.scale);

    return <div className={this.classes}>
      <div className="layer-cell first"><img src={image.combined.data} style={style} onClick={()=> onClick()}/></div>
      {this.writeLayers()}
    </div>
  }
}

class LayerSelectorCellComponent extends React.Component<{dataURL:DataURL, selected:boolean, onClick:()=>void},{}> {
  get classes() {
    return classSet({
      'layer-cell': true,
      'selected': this.props.selected
    });
  }

  render() {
    let {dataURL, onClick, layerNumber, style} = this.props;
    return <div className={this.classes}><img src={dataURL.data} style={style} onClick={()=> onClick(layerNumber)}/></div>
  }
}