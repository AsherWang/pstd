const fs = require('fs');
const childProcess = require('child_process');
const readline = require('readline');

let lineBreak = '\n';
const checkLBStyle = (filePath) => {
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, { encoding: 'utf8' });
    const newlines = content.match(/(?:\r?\n)/g) || [];
    if (newlines.length === 0) {
      return;
    }
    const crlf = newlines.filter(newline => newline === '\r\n').length;
    if (crlf * 2 > newlines.length) {
      // console.log('lineBreak: CRLF');
      lineBreak = '\r\n';
    } else {
      // console.log('lineBreak: LF');
    }
  }
};

const runCMDSync = (cmd, options) => {
  console.log(cmd);
  const defaultOpt = { stdio: 'inherit' };
  // fix some strange bug in win10
  // https://github.com/SBoudrias/Inquirer.js/issues/792
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.close();
  childProcess.execSync(cmd, options || defaultOpt);
  return true;
};

const isFilesExist = (regExp, path = '.') => {
  const filterFunc = item => (regExp instanceof RegExp ? regExp.test(item) : regExp === item);
  const files = fs.readdirSync(path);
  const filteredFiles = files.filter(filterFunc);
  return filteredFiles.length > 0;
};

const useYarn = isFilesExist('yarn.lock');

const getPackageObj = () => {
  const packageStr = fs.readFileSync('./package.json', { encoding: 'utf8' });
  return JSON.parse(packageStr);
};

const setPackageObj = (nv) => {
  const packageStr = JSON.stringify(nv, null, 2);
  return fs.writeFileSync('./package.json', packageStr);
};

const installDevDependcies = (pkgs) => {
  if (useYarn) {
    runCMDSync(`yarn add ${pkgs.join(' ')} -D`);
  } else {
    runCMDSync(`npm i ${pkgs.join(' ')} -D`);
  }
};

const init = () => {
  checkLBStyle('./package.json');
  return {
    useYarn,
    lineBreak,
    runCMDSync,
    isFilesExist,
    getPackageObj,
    setPackageObj,
    installDevDependcies,
  };
};

module.exports = {
  init,
};
