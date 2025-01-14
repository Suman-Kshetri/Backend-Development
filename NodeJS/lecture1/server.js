console.log("Hello world");//can be runed on the terminal
//global object
// console.log(global)
//importing in the commonJS
//this are the common core modules in the nodeJs
const os = require('os');
const path = require('path');
//own modules
const math = require('./math');
//or we can destructure like
const {add,mul} = require('./math');
console.log(`The sum of the two number is: ${add(64,36)}`);
console.log(mul(20,20))


console.log(os.type());
console.log(os.version());
console.log(os.homedir());
//valuues that are access in the node
console.log(__dirname);//gives the directory name
console.log(__filename);

console.log(path.dirname(__filename));//same as the __dirname
console.log(path.basename(__filename))//only gives the file name without the path
console.log(path.extname(__filename))//gives the file extension name as: .js


console.log(path.parse(__filename));//gives all above value as object


//using the own modules
console.log(math.add(10,40));
console.log(math.sub(30,8));
console.log(math.mul(3,8));
console.log(math.div(20,4));

//using the different export syntax
// const {mod} = require('./math');
// console.log(mod(25,2));