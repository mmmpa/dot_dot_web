import {Parcel} from '../libs/parcel';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

export default class MainContext extends Parcel<{children: {props: {route: any}}[]}, {}> {
  listen(to) {
    // nothing
  }

  route(state) {
    this.routeChildren = this.props.children.filter((child) => {
      return _.isUndefined(child.props.route) || child.props.route === state.route;
    });
  }

  componentWillUpdate(props, state) {
    this.route(state);
  }
}
