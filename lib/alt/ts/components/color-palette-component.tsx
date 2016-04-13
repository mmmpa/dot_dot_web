import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';
import Fa from "../mods/fa";
import Cell from "./cell-component";
import ColorSet from "../models/color-set";
import ARGB from "../models/argb";

interface P {
  colorSet:ColorSet
}

export default class ColorPaletteComponent extends Cell<P,{}> {
  componentWillMount() {
    this.setState({
      version: this.props.colorSet.version
    })
  }

  shouldComponentUpdate(props) {
    return props.colorSet.version !== this.state.version
  }

  componentWillReceiveProps(props) {
    this.setState({version: props.colorSet.version});
  }

  writeCells() {
    let {colors} = this.props.colorSet;

    return colors.map((color, key)=> {
      let onClick = ()=> this.dispatch('color:select', color);
      return <ColorCell {...{key, color, onClick}}/>;
    })
  }

  render() {
    return <div className="cell y color-pallet" style={this.layoutStyle}>
      <header className="cell-header">{this.myName}</header>
      <section className="cell-body">
        <ul className="colors">
          {this.writeCells()}
        </ul>
        <div className="controller">
          <button className="add icon-button" onClick={()=> this.dispatch('color:add')}>
            <Fa icon="plus-circle"/>
          </button>
          <button className="delete icon-button" onClick={()=> this.dispatch('color:delete')}>
            <Fa icon="trash"/>
          </button>
        </div>
      </section>
    </div>
  }
}

class ColorCell extends React.Component<{color:ARGB, onClick:()=> void},{}> {
  render() {
    let {color, onClick} = this.props;
    return <li className="color-cell" style={{background: color.hex}} onClick={onClick}>
      {color.hex}
    </li>

  }
}