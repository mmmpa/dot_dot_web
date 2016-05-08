import IDMan from "../libs/id-man";

export default class DataURL extends IDMan {
  constructor(public data:string, public version = 0) {
    super();
  }

  update(dataURL:DataURL) {
    this.data = dataURL.data;
    this.version++;
  }
}