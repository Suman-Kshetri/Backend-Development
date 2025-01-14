//when we have larger file then it is not good to grab all of the data all at once

const fs = require('fs');
const rs = fs.createReadStream('./Files/lorem.txt', {encoding: 'utf8'})//creating the readable stream
const ws = fs.createWriteStream('./Files/new-lorem.txt');

rs.on('data',(dataChunk) => {//this is the event listener that read a chunk of data from rs and 
    //copy it to the ws
    ws.write(dataChunk);
}) 