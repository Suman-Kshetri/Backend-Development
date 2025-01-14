const add = (a,b) => a+b;
const sub = (a,b) => a-b;
const mul = (a,b) => a*b;
const div = (a,b) => a/b;

//exporting the above functions
module.exports = {
    add,sub,mul,div
}

//or we can direclt export: 
// exports.mod = (a,b) => a%b;