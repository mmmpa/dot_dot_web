import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ARGB from '../models/argb';
import ColorCell from './color-cell';
import ColorSet from '../models/color-set';

export default class ColorCellSet extends React.Component<{colorSet: ColorSet, onClick: (color: ARGB) => void}, {}> {
  componentWillMount() {
    this.setState({
      version: this.props.colorSet.version,
    });
  }

  shouldComponentUpdate(props) {
    return props.colorSet !== this.props.colorSet || props.colorSet.version !== this.state.version;
  }

  componentWillReceiveProps(props) {
    this.setState({version: props.colorSet.version});
  }

  writeCells() {
    let {onClick} = this.props;
    let {colors} = this.props.colorSet;

    return colors.map((color, key) => {
      return <ColorCell {...{key, color, onClick}}/>;
    });
  }

  render() {
    return <ul className="colors">
      {this.writeCells()}
    </ul>;
  }
}
