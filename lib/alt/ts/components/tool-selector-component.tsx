import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";

export default class ToolSelectorComponent extends Cell<{},{}> {
  writeButton(name) {
    let key = name.replace(/\s/ig, '-');
    return <li>
      <button key={key} className={key} onClick={(e)=> this.fire(e, key)}>{name}</button>
    </li>
  }

  fire(e, key) {
    e.target.blur();
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
        return this.dispatch('canvas:center');
      case 'scale-plus':
        return this.dispatch('canvas:scale:plus');
      case 'scale-minus':
        return this.dispatch('canvas:scale:minus');
      case 'resize':
        return this.dispatch('canvas:size');
      default:
        this.dispatch(key);
    }
  }

  render() {
    return <div className="cell y tool-selector" style={this.layoutStyle}>
      <section>
        <h1>file name</h1>
        <input type="text" value={this.props.fileName} onChange={(e)=> this.dispatch('file:name', e.target.value)}/>
      </section>
      <ul className="tool-list">

      </ul>
      <ul className="command-list file">
        {['new', 'open', 'save', 'resize'].map((name)=> this.writeButton(name))}
      </ul>
      <ul className="command-list file">
        {['grid', 'centering', 'scale plus', 'scale minus'].map((name)=> this.writeButton(name))}
      </ul>
    </div>
  }
}