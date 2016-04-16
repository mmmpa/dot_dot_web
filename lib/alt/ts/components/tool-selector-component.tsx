import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";

export default class ToolSelectorComponent extends Cell<{},{}> {
  writeButton(name) {
    let key = name.replace(/\s/ig, '-');
    return <li>
      <button key={key} className={key} onClick={()=> this.fire(key)}>{name}</button>
    </li>
  }

  fire(key) {
    switch (key) {
      case 'save':
        return this.dispatch('file:save');
      case 'new':
        return this.dispatch('file:new');
      case 'open':
        return this.dispatch('file:open');
      case 'grid':
        return this.dispatch('canvas:grid:toggle');
      case 'centering':
        return this.dispatch('canvas:centering');
      case 'scale-plus':
        return this.dispatch('canvas:scale:plus');
      case 'scale-minus':
        return this.dispatch('canvas:scale:minus');
      default:
        this.dispatch(key);
    }
  }

  render() {
    return <div className="cell y tool-selector" style={this.layoutStyle}>
      <ul className="tool-list">

      </ul>
      <ul className="command-list file">
        {['new', 'open', 'save'].map((name)=> this.writeButton(name))}
      </ul>
      <ul className="command-list file">
        {['grid', 'centering', 'scale plus', 'scale minus'].map((name)=> this.writeButton(name))}
      </ul>
    </div>
  }
}