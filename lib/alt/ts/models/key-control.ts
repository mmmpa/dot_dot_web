export default class KeyControl {
  downStore:any = {};

  constructor(public callback) {
    console.log('key control')

    $(window).keydown((e:JQueryKeyEventObject)=> {
      this.down(e.keyCode);
      this.check(e);
    });

    $(window).keyup((e:JQueryKeyEventObject)=> {
      this.up(e.keyCode);
      this.check(e);
    });
  }

  down(code){
    this.downStore[code] = true;
  }

  up(code){
    this.downStore[code] = false;
  }

  isDown(code){
    return this.downStore[code];
  }

  check(e:JQueryKeyEventObject){
    if(this.isDown(32)){
      return this.callback('slide')
    }

    this.callback(null);
  }

  codeEnum(code){
    switch(code){
      case 'Space':
        return Code.Space

    }
  }
}

enum Code{
  Space
}