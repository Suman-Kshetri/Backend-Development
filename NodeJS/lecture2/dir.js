
const fs = require('fs');
//creating the directory
//if the file exist then no need to create/delete/rename the file
if(!fs.existsSync('./new'))
{
    fs.mkdir('./new',(err) =>{
        if(err) throw err;
        console.log('Directory created')
    });
}
//removing the directory if it exists
if(fs.existsSync('./new'))
    {
        fs.rmdir('./new',(err) =>{
            if(err) throw err;
            console.log('Directory deleted')
        });
    }