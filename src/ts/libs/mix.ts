export const mix = (superclass) => new MixinBuilder(superclass);

class MixinBuilder {
  constructor(private superclass: any) {

  }

  mix(...mixins: any[]) {
    return mixins.reduce((c, mixin) => mixin(c), this.superclass);
  }
}
