const express=require('express');
const bcrypt=require('bcryptjs');
const router=express.Router();
const authenticate = require('../middleware/authenticate');
const jwt=require('jsonwebtoken');

router.get('/',(req, res) => {
    res.send(`Hello world from router server`);
    console.log("Hello world!");
});


require('../db/conn');
const User=require('../model/UserSchema');

// router.post('/register',(req, res) => {
    
// //object destructing
// const{name,email,phone,work,password,cpassword} =req.body;

// if(!name || !email || !phone || !work || !password || !cpassword){
//     return res.status(422).json({error:"Fill the detail properly"});
// }

// (User.findOne({email:email}) && User.findOne({phone:phone})).then((userexist)=>{
//     if(userexist){
//     return res.status(422).json({error :"User already exists"});
//     }  
//     const user =new User({name,email,phone,work,password,cpassword});

//     user.save().then(() => {
//         res.status(201).json({message:"User register successfully"});
//     }).catch(err => {res.status(500).json({error:"Faild to register"})});
// }).catch(error=>{console.log(error);});
//     // res.json({message:req.body});
//     // res.send("Mera router page"); 
// });

router.post('/register', async (req, res) => {
    
    //object destructing
    const{name,email,gender,phone,work,password,cpassword} =req.body;
    
    if(!name || !email || !gender || !phone || !work || !password || !cpassword){
        return res.status(422).json({error:"Fill the detail properly"});
    }
    try{
    
    const userRegister=await (User.findOne({email:email}) && User.findOne({phone:phone}));
        if(userRegister){
        return res.status(422).json({error :"User already exists"});
        }  
        else if(password!=cpassword){
            return res.status(422).json({error:"Password is not matching"});
        }
        else{
            const user =new User({name,email,gender,phone,work,password,cpassword});

          //Here code from userSchema will run befire save finction
        const response=user.save();
            if(response){
           res.status(201).json({message:"User register successfully"});
          }
       else
        {res.status(500).json({error:"Faild to register"})};
    }
}
    catch(err) {
        console.error(err);
    }
});



router.post('/sigin',async(req, res) => {
    try{
        const{email,password} = req.body;
        if(!email || !password) {
            return res.status(400).json({error:"Please fill the data"});
        }

        const userLogin=await User.findOne({email:email});
        if(userLogin){

        const isMatch=await bcrypt.compare(password,userLogin.password);

        let token=await userLogin.generateAuthToken();
        console.log(token);

        res.cookie("jwtoken",token,{
            expires: new Date(Date.now() +258920000),
            httpOnly: true
        });

        if(!isMatch){
            res.status(400).json({error: 'Invalid cresdienatil'});
        }else{
            res.status(200).json({message:"User Signin success"});
        }
    }

        else{
            res.json({message:"Invalid credential"});
        }

    }
    catch(error){
        console.log(error);
    }

});

router.get("/about" , authenticate,(req,res)=>{
    console.log("Respose from server");
    res.send(req.rootUser);
});

router.get("/getdata" , authenticate,(req,res)=>{
    console.log("Respose from server");
    res.send(req.rootUser);
});

router.post('/contact',authenticate,async(req, res) => {
    try{
        const {name,email,phone,message}=req.body;
        if(!name || !email || !phone || !message){

            return res.json({error:"fill the form"});
        }
        const userContact =await User.findOne({_id: req.userID});
        if(userContact){
            const userMessage=await userContact.addMessage(name,email,phone,message);

            await userContact.save();

            res.status(201).json({message:"user Conatct successfully"});

        }
    }
    catch(error){
        console.log(error);
    }

});

router.get('/logout' ,(req,res)=>{
    console.log("Logout ka page");
    res.clearCookie('jwtoken',{path:'/'});
    res.status(200).send('User Logged Out');
});




module.exports=router;