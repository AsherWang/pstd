const fs = require('fs');
const Plugin = require('../base');

const defaultConfig = "module.exports = {extends: ['@commitlint/config-conventional']}";
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
    this.tool.installDevDependcies(['husky', '@commitlint/cli', '@commitlint/config-conventional']);
    const packageObj = this.tool.getPackageObj();
    packageObj.husky = {
      hooks: {
        'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
      },
    };
    this.tool.setPackageObj(packageObj);
    fs.writeFileSync('.commitlintrc.js', defaultConfig);
    console.log('commitlint to do...');
  }
}

module.exports = new Commitlint();
