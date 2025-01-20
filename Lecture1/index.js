require('dotenv').config()
const express = require('express')//require module syntax
//factory Function
const app = express()
const port = 3000
//listern if any request comes in the /->home route then callback is given
app.get('/', (req, res) => {
  res.send('Hello World!')
})
app.get('/home',(req,res)=>{
    res.send("This is the home page")
})

app.get('/login', (req,res) => {
    res.send('<h1>Login page</h1>')
})
// using the environment
app.listen(process.env.PORT, () => {
  console.log(`Example app listening on port ${port}`)
})