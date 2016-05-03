import * as React from "react";
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

export default class BlurButton extends React.Component {
  render(){
    let onMouseUp = (e)=>{
      this.props.onMouseUp && this.props.onMouseUp(e);
      e.currentTarget.blur();
    };
    let onClick = (e)=>{
      this.props.onClick && this.props.onClick(e);
      e.currentTarget.blur();
    };

    return <button {...this.props} {...{onMouseUp, onClick}}>{this.props.children}</button>
  }
}