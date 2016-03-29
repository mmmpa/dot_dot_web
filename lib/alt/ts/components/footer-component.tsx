import {Good} from "../libs/parcel";
import * as React from "react";
import * as ReactDOM from 'react-dom';

interface P {
  leftMessage:string,
  rightMessage:string
}

interface S {
  leftMessage:string,
  rightMessage:string,
  leftMessageDisplayed:string,
  rightMessageDisplayed:string
}

export default class FooterComponent extends Good<P,S> {
  messageArea:HTMLElement;
  preMessage:HTMLElement;

  timeoutStore:number[] = [];

  startClassName = 'game-message';
  riseClassName = 'game-message rise';
  sweepClassName = 'game-message sweep';

  componentWillMount() {
    this.setState({
      leftMessage: '',
      rightMessage: '',
      leftMessageDisplayed: '',
      rightMessageDisplayed: ''
    });
  }

  componentDidMount() {
    this.messageArea = this.refs['message-area'] as HTMLElement;
  }

  componentWillReceiveProps(props) {
    this.setState({rightMessage: props.rightMessage})
  }

  componentWillUpdate(p, state) {
    if (state.rightMessage !== this.state.rightMessage) {
      this.addMessage(state.rightMessage);
    }
  }

  componentWillUnmount() {
    this.timeoutStore.forEach((id)=> clearTimeout(id));
  }

  setTimeout(...args):number {
    let id = setTimeout(...args);
    this.timeoutStore.push(id);
    return id;
  }

  clearTimeOut(id:number) {
    _.remove(this.timeoutStore, id);
    clearTimeout(id);
  }

  sweepAndRiseMessage(nextMessage) {
    this.messageArea.appendChild(nextMessage);
    let riseId = this.setTimeout(()=> {
      this.clearTimeOut(riseId);

      nextMessage.setAttribute('class', this.riseClassName);
      if (!this.preMessage) {
        this.preMessage = nextMessage;
        return;
      }
      let {preMessage} = this;
      preMessage.setAttribute('class', this.sweepClassName);

      let sweepId = this.setTimeout(()=> {
        preMessage.parentNode.removeChild(preMessage);
        this.clearTimeOut(sweepId);
      }, 500);

      this.preMessage = nextMessage;
    }, 1);
  }

  addMessage(message) {
    let nextMessage = document.createElement('div');
    nextMessage.innerText = message;
    nextMessage.setAttribute('class', this.startClassName);
    this.sweepAndRiseMessage(nextMessage);
  }

  render() {
    let {leftMessage, rightMessage} = this.props;

    return <footer className="game-footer">
      <div className="left-message">{leftMessage}</div>
      <div className="right-message" ref="message-area"></div>
    </footer>
  }
}
