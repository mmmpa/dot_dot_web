import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class StepperInput extends React.Component {
  get input() {
    return this.refs.input;
  }

  onWheel(e) {
    let {value} = this.state;
    if (e.deltaY < 0) {
      value += 1;
    } else {
      value -= 1;
    }
    if (value < 1) {
      value = 1;
    }
    this.props.onChange(value);
    this.setState({value});
  }

  componentWillMount() {
    this.setState({
      value: this.props.value || 1,
    });
  }

  componentDidMount() {
    this.onWheel = this.onWheel.bind(this);
    this.input.addEventListener('mousewheel', this.onWheel);
  }

  componentWillUnmount() {
    this.input.removeEventListener('mousewheel', this.onWheel);
  }

  render() {
    let {value} = this.state;
    return <input type="number" min="1" max="10" step="1" {...{value: isNaN(value) ? 4 : value}} ref="input"/>;
  }
}
