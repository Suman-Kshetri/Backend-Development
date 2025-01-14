const fs = require('fs');
// fs.readFile('./Files/starter.txt', (err,data)=>{
//     if (err) throw(err);
//     console.log(data.toString());
// })

// OR

fs.readFile('./Files/starter.txt','utf8', (err,data)=>{
    if (err) throw(err);
    console.log(data.toString());
})
//exit on uncaught error

process.on('uncaughtException',err =>{
    console.log(`There was uncaught error ${err}`);
    process.exit(1);
})

console.log('hello...')
//node works as asynchronous 

//using the path modules.
const path = require('path');

fs.readFile(path.join(__dirname, 'Files', 'starter.txt'),'utf8', (err,data)=>{
    if (err) throw(err);
    console.log(`using the path modules \n\t ${data.toString()}`);
}) 
//appendig the file: modify or creates
//creating the file if it doesnt exist
fs.appendFile(path.join(__dirname, 'Files', 'append.txt'),'\nAppneding the newly created file', (err)=>{
    if (err) throw(err);
    console.log('Creating and Append complete');
})

//if we write like this then it will look like callback hell since append is in callbcak of write....
//if we write like this then the code ouput will be in order ie: synchronous 
 //writing in the file
fs.writeFile(path.join(__dirname, 'Files', 'reply.txt'),'Writing in the file', (err)=>{
    if (err) throw(err);
    console.log('Write complete');
    //appendig in the existed file
    fs.appendFile(path.join(__dirname, 'Files', 'reply.txt'),'.\nI am learning about the nodeJS', (err)=>{
        if (err) throw(err);
        console.log('Append complete');
        fs.rename(path.join(__dirname,'Files','reply.txt'),path.join(__dirname, 'Files', 'newReplt.txt'),(err) => {
            if(err) throw err;
            console.log('Renaming the file complete');
        })
    })
})
    
    
console.log("\nUsing the concept of Promises to reduce the Callback hell:\n");


const fsPromises = require('fs').promises;
const path = require('path');

const fileOps = async () => {
    try{
        const data = await fsPromises.readFile(path.join(__dirname,'Files','starter.txt'),'utf8');
        console.log(data);

        await fsPromises.unlink(path.join(__dirname,'Files','starter.txt'),data)//deleting the starter file reading and logging the data to the console then deleting the data

        //taking data from the starter and creating the new file and appending and ranaming it
        
        await fsPromises.writeFile(path.join(__dirname,'Files','promiseWrite.txt'),data)
        await fsPromises.appendFile(path.join(__dirname,'Files','promiseWrite.txt'),'\n Nice to meet you');
        await fsPromises.rename(path.join(__dirname,'Files','promiseWrite.txt'),path.join(__dirname,'Files','NewPromiseWrite.txt'));
        
        const newData = await fsPromises.readFile(path.join(__dirname,'Files','NewPromiseWrite.txt'),'utf8');
        console.log(`\n${newData}`);

    }catch(err)
    {
        console.log(err);
    }
}
fileOps();