/// <reference path="./typings/browser.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {Route} from './constants/constants'

import MainContext from "./contexts/main-context";
import EditorContext from "./contexts/editor-context";
import SelectorContext from "./contexts/selector-context";

import SelectorComponent from "./components/selector-component";
import EditorComponent from "./components/editor-component";

class DotDot {
  static run(dom) {
    ReactDOM.render(
      <article className="dot-body">
        <MainContext>
          <SelectorContext route={Route.Selector}>
            <SelectorComponent/>
          </SelectorContext>
          <EditorContext route={Route.Editor}>
            <EditorComponent/>
          </EditorContext>
        </MainContext>
      </article>
      , dom);
  }
}

DotDot.run(document.getElementById('editor'))
