import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import CanvasComponent from "./canvas-component";


interface P {
  bitmap
}

export default class GameComponent extends Good<P,{}> {
  render() {
    return <CanvasComponent/>
  }
}
