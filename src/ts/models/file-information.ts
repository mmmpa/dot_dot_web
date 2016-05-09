export default class FileInformation {
  constructor(public name: string, public layerCount = 1, public frameCount = 1) {

  }

  static parseFileName(fileName) {
    let splat = fileName.split('.');
    if (splat.length !== 4) {
      return new FileInformation(splat[0]);
    } else {
      return new FileInformation(splat[0].split('_').shift(), +splat[1], +splat[2]);
    }
  }
}
