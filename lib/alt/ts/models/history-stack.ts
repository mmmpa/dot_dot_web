interface Stack{
  up:()=>void,
  down:()=>void
}

export default class HistoryStack {
  private history:Stack[] = [];
  private position:number = 0;

  constructor(public length = 10){
    this.length++;
  }

  stock(command):void {
    this.now = command;
    this.stepForward();
    this.now && this.dispose();
    //this.now = null;
  }

  undo():void {
    if (!this.isUndoable) {
      return;
    }
    this.stepBackward();
    this.now.down()
  }

  redo():void {
    if (!this.isRedoable) {
      return;
    }
    this.now.up();
    this.stepForward();
  }

  stepForward(){
    this.position++;
    if(this.position === this.length){
      this.position = 0;
    }
  }

  stepBackward(){
    if(this.position === 0){
      this.position = this.length - 1;
    }else{
      this.position--;
    }
  }

  get isUndoable():boolean {
    return !!this.previous;
  }

  get isRedoable():boolean {
    return !!this.now;
  }

  get previous():Stack {
    if(this.position === 0){
      return this.history[this.length - 1];
    }else{
      return this.history[this.position - 1];
    }
  }

  get now():Stack {
    return this.history[this.position];
  }

  set now(v:Stack) {
    this.history[this.position] = v;
  }

  private dispose(){
    delete this.history[this.position];
  }
}