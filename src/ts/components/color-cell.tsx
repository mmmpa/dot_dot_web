import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ARGB from '../models/argb';

export default class ColorCell extends React.Component<{color: ARGB, onClick: () => void}, {}> {
  render() {
    let {color, index, onClick} = this.props;
    return <li className="color-cell" onClick={() => onClick(color)} onContextMenu={(e) => {
    e.preventDefault();
    onClick(color, null, true);
    }}>
      <em style={{background: color.css}}>{color.hex}</em>
    </li>;
  }
}
