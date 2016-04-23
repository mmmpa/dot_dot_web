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

export default class Cell<P,S> extends Good<SellP&P,SellS&S> {
  get layoutStyle(){
    return this.pickLayout(this.props)
  }

  pickLayout(props){
    return props.layout[this.props.name] || {}
  }
}