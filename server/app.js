const express= require('express');
const dotenv= require('dotenv');
const app = express();
const mongoose = require('mongoose');
// const express = require('express');
const cookieParser = require('cookie-parser');

app.use(cookieParser());

dotenv.config({path:'./config.env'});

const PORT=process.env.PORT;

require('./db/conn');

const User = require('./model/UserSchema');
app.use(express.json());

app.use(require('./router/auth'));

app.get('/',(req, res) => {
    res.send(`Hello world from server`);
    console.log("Hello world!");
});

// app.get('/contact',(req, res) => {
//     res.send(`Welcome to Conatct`)
// });

app.get('/signin',(req, res) => {
    res.send(`Welcome to signin`)
});
app.get('/signup',(req, res) => {
    res.send(`Welcome to signup`)
});

app.listen(PORT,()=>{
    console.log(`Server running on port ${PORT}`);
});

