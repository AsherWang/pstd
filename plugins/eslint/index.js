const Plugin = require('../base');

class Eslint extends Plugin {
  constructor() {
    super('eslint');
  }

  scan() {
    // check file .eslintrc.*
    if (this.tool.isFilesExist(/^\.eslintrc\.*/)) {
      this.advice = null;
      return;
    }
    // check eslint config in package.json
    const packageObj = this.tool.getPackageObj();
    if (packageObj.eslintConfig) {
      this.advice = null;
      return;
    }
    this.advice = 'eslint: add eslint for this project';
  }

  exec() {
    // install eslint and run eslint --init
    this.tool.installDevDependcies(['eslint']);
    this.tool.runCMDSync('node ./node_modules/eslint/bin/eslint.js --init');
  }
}

module.exports = new Eslint();
