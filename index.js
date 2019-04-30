#!/usr/bin/env node
const plugins = require('./plugins');

// load all plugins
console.log('hello pstd');
console.log(`plugins length: ${plugins.length}`);

// scan & check
const scan = () => {
    return plugins.scan();
};

// show plugins with info scaned
const showMenu = () => {

};

const quit = () => {
    process.exit(0);
};

async function main(){
    try {
        await scan();
        while(true){
            const choice = await showMenu();
            switch(choice){
                case 1:
                    console.log('2333');
                case -1:
                    quit();
                default:
                    console.log('nothing chosen');
                break;
            }
        }
    } catch (error) {
        console.log(`error occurred: ${error.message}`);
        process.exit(1);
    }

}

main();