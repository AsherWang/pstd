const fs = require('fs');

const filePath = './.npmrc';
const kvs = [
  ['registry', 'https://registry.npm.taobao.org'],
  ['disturl', 'https://npm.taobao.org/dist'],
];


module.exports = {
  name: 'npmrc',
  advice: null,
  scan() {
    if (!fs.existsSync(filePath)) {
      this.advice = {
        name: 'npmrc: create file .npmrc',
        value: 'npmrc',
      };
    } else {
      this.advice = null;
    }
    return Promise.resolve();
  },
  exec(opt) {
    fs.writeFileSync(filePath, kvs.map(([k, v]) => `${k} = ${v}`).join(opt.lineBreak));
    console.log('file .npmrc created');
    return true;
  },
};
