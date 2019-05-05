#!/usr/bin/env node
const fs = require('fs');
const inquirer = require('inquirer');
const plugins = require('./plugins');

let advices = null;


// scan & check
const scan = () => {
  plugins.map(async (plugin) => {
    await plugin.scan();
  });
  // console.log('plugins', plugins)
  advices = plugins
    .filter(p => !p.skipped && p.advice)
    .map(p => p.advice);
};

const skip = () => {
  const plugin = plugins
    .find(p => !p.skipped && p.advice);
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
  if (plugin) {
    await plugin.exec();
  }
};

async function main() {
  try {
    if (!fs.existsSync('./package.json')) {
      console.log('package.json not found, try create one with npm init');
      process.exit(0);
    }
    while (true) { // eslint-disable-line
      await scan(); // eslint-disable-line
      if (advices && advices.length > 0) {
        const choice = await showMenu(); // eslint-disable-line
        switch (choice) {
          case 'quit':
            quit();
            break;
          case 'skip':
            skip();
            break;
          default:
            await pluginExec(choice); // eslint-disable-line
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
