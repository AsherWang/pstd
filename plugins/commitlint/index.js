const Plugin = require('../base');

class Commitlint extends Plugin {
  constructor() {
    super('commitlint');
  }

  scan() {
    // commitlint.config.js, .commitlintrc.js, .commitlintrc.json, .commitlintrc.yml
    // or a commitlint field in package.json
    if (this.tool.isFilesExist(/^\.?(commitlintrc|commitlint\.config)\.*/)) {
      this.advice = null;
      return;
    }
    // check eslint config in package.json
    const packageObj = this.tool.getPackageObj();
    if (packageObj.commitlint) {
      this.advice = null;
      return;
    }
    // check devDependencies
    if (packageObj.devDependencies && packageObj.devDependencies['@commitlint/cli']) {
      this.advice = null;
      return;
    }
    this.advice = 'commitlint: add commitlint for this project';
  }

  exec() {
    this.tool.runCMDSync('npm i --save-dev husky @commitlint/cli');
    const packageObj = this.tool.getPackageObj();
    packageObj.husky = {
      hooks: {
        'commit-msg': 'commitlint',
      },
    };
    this.tool.setPackageObj(packageObj);
    console.log('commitlint to do...');
  }
}

module.exports = new Commitlint();
