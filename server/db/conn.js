
const mongoose=require('mongoose');

const Database=process.env.DATABASE;

mongoose.connect(Database,{
    useNewUrlParser:true,
    // useCreateIndex:true,
    useUnifiedTopology:true,
    // useFindAndModify:false
}).then(()=>{
    console.log('Connect successfully');
}).catch((err)=>console.log("connection error"));