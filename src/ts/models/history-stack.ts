interface Stack {
  up: () => void;
  down: () => void;
}

export default class HistoryStack {
  // 固定長配列と終端を表すundefinedで循環配列として利用する
  private history: Stack[][] = [];
  private position: number   = 0;

  constructor(public length = 10) {
    // ヒストリー終端の目印分
    this.length++;
  }

  // 処理を現在のヒストリーに登録し、ヒストリーをすすめる。
  // すすめた先のヒストリーに登録されているものを削除してリドゥ不可能にする。
  stock(command: (Stack|Stack[])): void {
    this.now = this.toArray(command);
    this.stepForward();
    this.dispose();
  }

  // 処理を一つ前のヒストリーと統合する
  // ヒストリーはすすまない
  stockPrevious(command): void {
    let previous: (Stack|Stack[]) = this.previous;

    if (!previous) {
      return;
    }

    // commandが配列の場合はバラして登録先の配列に挿入する
    if (command.slice) {
      command.forEach((c) => this.stockPrevious(c));
    } else {
      this.previous.push(command);
    }
  }

  // ヒストリーを一つもどし、down処理を実行する。
  // ヒストリーに変化は生じない。
  undo(): void {
    if (!this.isUndoable) {
      return;
    }
    this.stepBackward();
    for (let i = this.now.length; i--; null) {
      this.now[i].down();
    }
  }

  // 現在のヒストリーのup動作を実行し、ヒストリーを一つすすめる。
  // ヒストリーに変化は生じない。
  redo(): void {
    if (!this.isRedoable) {
      return;
    }
    this.now.forEach((s) => s.up());
    this.stepForward();
  }

  private stepBackward() {
    this.position === 0
      ? this.position = this.length - 1
      : this.position--;
  }

  private stepForward() {
    this.position === this.length - 1
      ? this.position = 0
      : this.position++;
  }

  private toArray(element: any): any[] {
    return !!element.slice ? element : [element];
  }

  private get isUndoable(): boolean {
    return !!this.previous;
  }

  private get isRedoable(): boolean {
    return !!this.now;
  }

  private get previous(): Stack[] {
    if (this.position === 0) {
      return this.history[this.length - 1];
    } else {
      return this.history[this.position - 1];
    }
  }

  private get now(): Stack[] {
    return this.history[this.position];
  }

  private set now(v: Stack[]) {
    this.history[this.position] = v;
  }

  private dispose() {
    this.now && delete this.history[this.position];
  }
}
