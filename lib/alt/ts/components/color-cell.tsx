import * as React from "react";
import * as ReactDOM from 'react-dom';
import ARGB from "../models/argb";

export default class ColorCell extends React.Component<{color:ARGB, onClick:()=> void},{}> {
  render() {
    let {color, index, onClick} = this.props;
    return <li className="color-cell" style={{background: color.hex}} onClick={()=> onClick(color, index)}>
      {color.hex}
    </li>
  }
}