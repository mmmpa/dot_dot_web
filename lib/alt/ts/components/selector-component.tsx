import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Player from "../models/player";
import Fa from "../mods/fa";
import PlainSelect from "../mods/plain-select";

interface P {
  players:string[]
}

interface S {
  first:string,
  second:string
}

export default class SelectorComponent extends Good<P,S> {
  render() {
    return null
  }
}
