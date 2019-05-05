#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const childProcess = require('child_process');
const inquirer = require('inquirer');
const plugins = require('./plugins');

let advices = null;
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
      console.log('lineBreak: CRLF');
      lineBreak = '\r\n';
    } else {
      console.log('lineBreak: LF');
    }
  }
};

const runCMDSync = (cmd, options) => {
  console.log(`run CMD: ${cmd}`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.close();
  childProcess.execSync(cmd, options);
  return true;
};


// scan & check
const scan = () => {
  plugins.map(async (plugin) => {
    await plugin.scan();
  });
  // console.log('plugins', plugins)
  advices = plugins
    .filter(plugin => !plugin.skipped && plugin.advice)
    .map(plugin => plugin.advice);
};

const skip = () => {
  const plugin = plugins
    .find(plugin => !plugin.skipped && plugin.advice)
  if (plugin) {
    plugin.skipped = true;
    plugin.advice = null;
  }
};

// show plugins with info scaned
const showMenu = async () => {
  const presetChoices = [
    new inquirer.Separator(),
    {
      name: 'skip',
      value: 'skip',
    },
    {
      name: 'quit',
      value: 'quit',
    },
  ];
  const choices = advices.slice(0, 1).concat(presetChoices);
  const choice = await inquirer
    .prompt([
      {
        type: 'list',
        name: 'action',
        message: 'advices for this project',
        choices,
      },
    ])
    .then(({ action }) => action);
  return choice;
};

const quit = () => {
  console.log('bye~');
  process.exit(0);
};

const pluginExec = async (choice) => {
  const plugin = plugins.find(({ advice }) => advice && advice.value === choice);
  const opt = {
    lineBreak,
    runCMDSync,
  };
  if (plugin) {
    await plugin.exec(opt);
    return true;
  }
  return false;
};

async function main() {
  try {
    if (!fs.existsSync('./package.json')) {
      console.log('package.json not found, try create one with npm init');
      process.exit(0);
    }
    checkLBStyle('./package.json');
    while (true) { // eslint-disable-line
      await scan();
      if (advices && advices.length > 0) {
        const choice = await showMenu();
        switch (choice) {
          case 'quit':
            quit();
            break;
          case 'skip':
            skip();
            break;
          default:
            await pluginExec(choice);
            break;
        }
      } else {
        console.log('all check passed, cool~');
        process.exit(0);
      }
    }
  } catch (error) {
    console.log(`error occurred: ${error.message}`);
    process.exit(1);
  }
}

main();
