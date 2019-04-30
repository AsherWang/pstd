const npmrcPlugin = require('./npmrc');

const list = [];
list.push(npmrcPlugin);


module.exports = {
    list,
    scan(){
        return Promise.all(list.map(plugin => plugin.scan()));
    }
};
