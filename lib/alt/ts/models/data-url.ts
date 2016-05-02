export default class DataURL {
  constructor(public data:string, public version = 0) {

  }

  update(dataURL:DataURL) {
    this.data = dataURL.data;
    this.version++;
  }
}