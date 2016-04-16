export default class KeyControl {
  downStore:any = {};
  public hook:(name:string, e:JQueryKeyEventObject)=>void;

  constructor(public callback) {
    $(window).keydown((e:JQueryKeyEventObject)=> {
      this.down(e.keyCode);
      this.check(e);
    });

    $(window).keyup((e:JQueryKeyEventObject)=> {
      this.up(e.keyCode);
      this.strike(null, e);
    });
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

  check(e:JQueryKeyEventObject) {
    if (this.isDown(32)) {
      return this.strike('slide', e)
    }

    let string = 'on';

    if(e.altKey){
      string += 'Alt'
    }

    if(e.ctrlKey){
      string += 'Control'
    }

    string += e.code.replace('Key', '');

    this.strike(string, e);
  }

  strike(name:string, e:JQueryKeyEventObject){
    console.log('strike', name)
    this.callback(name);
    this.hook && this.hook(name, e)
  }

  codeEnum(code) {
    switch (code) {
      case 'Space':
        return Code.Space
    }
  }
}

enum Code{
  Space
}