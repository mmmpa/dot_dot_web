import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";

export default class HeaderComponent extends Good<{},{}> {
  render() {
    return <header className="game-header">
      <h1>ふつうの神経衰弱</h1>
      <ul>
        <li>
          <a onClick={()=> this.dispatch('route:selector')}>ゲーム選択画面</a>
          <Fa icon="arrow-circle-right"/>
        </li>
      </ul>
    </header>
  }
}