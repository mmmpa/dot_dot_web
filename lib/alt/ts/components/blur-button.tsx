import * as React from "react";
import * as ReactDOM from 'react-dom';

export default class BlurButton extends React.Component {
  render(){
    let onMouseDown = (e)=>{
      this.props.onMouseDown && this.props.onMouseDown(e);

      let button = e.currentTarget;
      let up = (e)=>{
        button.blur();
        window.removeEventListener('mouseup', up);
      };
      window.addEventListener('mouseup', up);
    };

    return <button {...this.props} {...{onMouseDown}}>{this.props.children}</button>
  }
}