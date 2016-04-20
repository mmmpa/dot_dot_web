import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";

interface SellP {
  layout:any,
  name:string
}

interface SellS {

}

export default class CanvasSettingComponent extends Good<{},{}> {
  componentWillMount() {
    super.componentWillMount();

    let {width, height, bg} = this.props;
    this.setState({width, height, bg})
  }

  render() {
    let {width, height, bg} = this.state;
    let {onComplete} = this.props;;

    return <div className="canvas-setting">
      <h1>width</h1>
      <input type="text" value={width} onChange={(e)=> this.setState({width: +e.target.value})}/>
      <h1>height</h1>
      <input type="text" value={height} onChange={(e)=> this.setState({height: +e.target.value})}/>
      <button onClick={()=> onComplete(width, height, bg)}>作成</button>
    </div>
  }
}