import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import CardModule from "../mods/card-module";
import Card from "../models/card";
import {CardStepper, CardState} from "../models/card-engine";
import ResultModule from "../mods/result-module";
import {ResultData} from "../models/card-engine";

interface P {
  cards:Card[],
  state:CardState,
  result:ResultData
}

export default class GameComponent extends Good<P,{}> {
  render() {
    return null
  }
}
