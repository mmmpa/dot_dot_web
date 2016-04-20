import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";

interface SellP{
  layout:any,
  name:string
}

interface SellS{

}

export default class CanvasSettingComponent extends Good<{},{}> {
  componentWillMount(){
    super.componentWillMount();

    let {canvasWidth, canvasHeight, canvasBackgroundColor} = this.props;
    this.setState({canvasWidth, canvasHeight, canvasBackgroundColor})
  }

  render(){
    let {canvasWidth, canvasHeight, canvasBackgroundColor} = this.state;

    return <div className="canvas-setting">
      <h1>width</h1>
      <input type="text" value={canvasWidth}/>
      <h1>height</h1>
      <input type="text" value={canvasHeight}/>
    </div>
  }
}