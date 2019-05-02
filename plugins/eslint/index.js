const fs = require('fs');

module.exports = {
  name: 'eslint',
  advice: null,
  scan() {
    const files = fs.readdirSync('.');
    const regExp = /^\.eslintrc\.*/;
    const filteredFiles = files.filter(file => regExp.test(file));
    if (filteredFiles.length > 0) {
      this.advice = null;
      return;
    }
    // check eslint config in package.json
    const packageStr = fs.readFileSync('./package.json', { encoding: 'utf8' });
    const packageObj = JSON.parse(packageStr);
    if (packageObj.eslintConfig) {
      this.advice = null;
      return;
    }
    this.advice = {
      name: 'eslint: add eslint for this project',
      value: 'eslint',
    };
  },
  async exec(opt) {
    opt.runCMDSync('npm i eslint --save-dev', { stdio: 'inherit' });
    opt.runCMDSync('node ./node_modules/eslint/bin/eslint.js --init', { stdio: 'inherit' });
    return true;
  },
};
