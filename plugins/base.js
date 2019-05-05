const tool = require('./tool');

let toolObj;

class Plugin {
  constructor(name) {
    this.name = name;
    this.pAdvice = null;
    this.skipped = false;
  }

  get tool() {
    if (!toolObj) {
      toolObj = tool.init();
    }
    return toolObj;
  }

  set advice(nv) {
    if (nv) {
      this.pAdvice = {
        name: nv,
        value: this.pAdvice,
      };
    } else {
      this.pAdvice = null;
    }
  }

  get advice() {
    return this.pAdvice;
  }
  // to be override
  //   scan() {
  //     // check the project
  //   }

  // exec(opt) {
  //   // modify the project
  //   // ret: Promise
  // }
}

module.exports = Plugin;
