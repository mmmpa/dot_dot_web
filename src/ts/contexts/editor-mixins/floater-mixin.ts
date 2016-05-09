export let FloaterMixin = (superclass) => class extends superclass {
  riseFloater(e, floatingCallback) {
    let floatingFrom = e.currentTarget;
    this.setState({floatingCallback, floatingFrom}, () => {
      let remove = () => {
        $(window).unbind('click', remove);
        this.setState({floatingCallback: null, floatingFrom: null});
      };
      setTimeout(() => {
        $(window).bind('click', remove);
      }, 1);
    });
  }

  selectColorFromFloater(callback) {
    callback();
    this.setState({floatingCallback: null, floatingFrom: null});
  }
};
