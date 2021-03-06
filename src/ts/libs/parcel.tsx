import {EventEmitter} from 'events';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from 'lodash';

interface IEventingShared {
  emitter: EventEmitter;
}

interface GoodProps {
  emitter?: EventEmitter;
}

interface GoodState {

}

interface ParcelProps {
  children?;
  route?;
}

interface ParcelState {
}

interface EventStore {
  eventName: string;
  callback: Function;
}

export const EventingShared = {
  emitter: React.PropTypes.any,
};

export abstract class Good<P, S> extends React.Component<P & GoodProps, S & GoodState> {
  emitter: EventEmitter;
  context: IEventingShared;

  static get contextTypes(): React.ValidationMap<any> {
    return EventingShared;
  }

  static get childContextTypes(): React.ValidationMap<any> {
    return EventingShared;
  }

  getChildContext(): IEventingShared {
    return {emitter: this.emitter};
  }

  eventStore: any[] = [];

  addEventSafety(target, ...args) {
    this.eventStore.push([target].concat(args));
    target.addEventListener(...args);
  }

  removeEventAll() {
    this.eventStore.forEach(([target, ...args]) => target.removeEventListener(...args));
  }

  dispatch(event: string, ...args: any[]): boolean {
    return (this.emitter || this.props.emitter).emit(event, ...args);
  }

  private emitter_;

  get emitter() {
    return this.context.emitter || this.emitter_ || (this.emitter_ = new EventEmitter());
  }

  private myName_: string;

  get myName() {
    if (this.myName_) {
      return this.myName_;
    }
    return this.myName_ = this.constructor.toString().match(/function[ ]+([a-zA-Z0-9_]+)/)[1];
  }

  debug(...args) {
    // console.log(this.myName, ...args)
  }

  componentWillMount() {
    this.debug('componentWillMount');
    this.removeEventAll();
  }

  componentDidMount() {
    this.debug('componentDidMount');
  }

  componentWillReceiveProps(nextProps) {
    // this.debug('componentWillReceiveProps');
  }

  shouldComponentUpdate(nextProps, nextState): boolean {
    // this.debug('shouldComponentUpdate');
    return true;
  }

  componentWillUpdate(nextProps, nextState): void {
    // this.debug('componentWillUpdate');
  }

  componentDidUpdate(prevProps, prevState): void {
    // this.debug('componentDidUpdate');
  }

  componentWillUnmount() {
    this.debug('componentWillUnmount');
  }

  relayingProps() {
    let props: any = _.assign({emitter: this.emitter || this.props.emitter}, this.props, this.state);
    delete props.children;
    return props;
  }

  relay(children) {
    let props: any = this.relayingProps();

    return children.map((child, key) => React.cloneElement(child, _.assign(props, {key})));
  }
}

export abstract class Parcel<P, S> extends Good<P & ParcelProps, S & ParcelState> {
  routeChildren;
  addedOnStore: EventStore[] = [];
  acceptable: any            = {};

  abstract listen(to: (key: string, eventName: string, callback: Function) => void): void;


  componentWillUnmount() {
    let removed = this.addedOnStore.map((store: EventStore) => {
      this.emitter.removeListener(store.eventName, store.callback);
      return store.eventName;
    });
    super.componentWillUnmount();
  }

  componentWillMount() {
    this.listen((key: string, eventName: string, callback: Function) => {
      console.log(eventName);
      this.addedOnStore.push({eventName, callback});
      this.acceptable[key] = true;
      if (key) {
        this.emitter.on(eventName, (...args) => {
          this.acceptable[key] && callback(...args);
        });
      } else {
        this.emitter.on(eventName, callback);
      }
    });
    super.componentWillMount();
  }

  lock(key: string) {
    this.acceptable[key] = false;
  }

  unlock(key: string) {
    this.acceptable[key] = true;
  }

  constructor(props) {
    super(props);
  }

  get children() {
    if (this.routeChildren) {
      return this.routeChildren;
    }

    let {children} = this.props;
    return !!children.map ? children : [children];
  }

  render() {
    return <div className="context-wrapper">
      {this.relay(this.children)}
    </div>;
  }
}
