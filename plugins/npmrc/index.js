const fs = require('fs');
const Plugin = require('../base');

const filePath = './.npmrc';
const kvs = [
  ['registry', 'https://registry.npm.taobao.org'],
  ['disturl', 'https://npm.taobao.org/dist'],
];

class Npmrc extends Plugin {
  constructor() {
    super('npmrc');
  }

  scan() {
    if (!fs.existsSync(filePath)) {
      this.advice = 'npmrc: create file .npmrc';
    } else {
      this.advice = null;
    }
  }

  exec() {
    // create file .npmrc
    fs.writeFileSync(filePath, kvs.map(([k, v]) => `${k} = ${v}`).join(this.tool.lineBreak));
    console.log('file .npmrc created');
  }
}

module.exports = new Npmrc();
