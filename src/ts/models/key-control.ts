export default class KeyControl {
  downStore: any = {};
  binding: any   = {};

  constructor() {
    this.onDown = this.onDown.bind(this);
    this.onUp   = this.onUp.bind(this);

    window.addEventListener('keydown', this.onDown);
    window.addEventListener('keyup', this.onUp);
  }

  bind(keyName, callbackName, callback: (e: KeyboardEvent) => void) {
    if (!this.binding[keyName]) {
      this.binding[keyName] = {};
    }
    this.binding[keyName][callbackName] = callback;
  }

  unbind(keyName, callbackName) {
    this.binding[keyName][callbackName] = null;
  }

  dispose() {
    window.removeEventListener('keydown', this.onDown);
    window.removeEventListener('keyup', this.onUp);
  }

  onDown(e: KeyboardEvent) {
    this.down(e.code);
    this.down(e.keyIdentifier);
    this.check(e);
  }

  onUp(e: KeyboardEvent) {
    this.up(e.code);
    this.up(e.keyIdentifier);
    this.strike(null, e);
  }

  down(code) {
    this.downStore[code] = true;
  }

  up(code) {
    this.downStore[code] = false;
  }

  isDown(code) {
    return this.downStore[code];
  }

  check(e: KeyboardEvent) {
    let name = 'on';

    if (e.altKey) {
      name += 'Alt';
    }

    if (e.ctrlKey) {
      name += 'Control';
    }

    if (e.shiftKey) {
      name += 'Shift';
    }

    name += e.code.replace('Key', '');

    this.strike(name, e);
  }

  strike(name: string, e: KeyboardEvent) {
    if (this.binding[name]) {
      for (let k in this.binding[name]) {
        this.binding[name][k](e);
      }
      e.preventDefault();
    }
  }
}
