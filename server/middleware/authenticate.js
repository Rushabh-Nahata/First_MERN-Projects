const jwt=require("jsonwebtoken");

const User=require("../model/UserSchema");

const Authenticate=async (req, res, next) => {
    try{

        const token =req.cookies.jwtoken;
        // console.log(req);

        const verifyToken=jwt.verify(token,process.env.SECRET_KEY);
        console.log(verifyToken);

        const rootUser=await User.findOne({ _id:verifyToken._id,"tokens.token":token});

    if(!rootUser){
        throw new Error("User not found");
    }
    else{
        console.log("token generated");
        req.token=token;
        req.rootUser=rootUser;
        req.userID=rootUser._id;
        next();
    }
}
    catch(err){
        console.log("Rushbabh");
        // console.log(err);
        res.status(401).send("unauthorized:No token Provided");
        
        console.log(err);
    }
}
module.exports=Authenticate;