import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
declare const createjs;

interface P {
}

export default class CanvasComponent extends Good<P,{}> {
  private stage;

  componentDidMount(){
    super.componentDidMount();
  }

  bitmapData(){
  }

  render() {
    return <canvas ref="canvas" onClick={()=> this.setState({})}>canvas</canvas>
  }
}


/*

// 読み込み
 new createjs.BitmapData(HTMLImageElement)

// 新規作成
new createjs.BitmapData(null, 100, 100, 0xffff0000)

* */