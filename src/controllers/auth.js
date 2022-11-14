const User = require("./../models/user");

const auth = async(app)=>{
    app.post("/auth/login" , userLogin);
    app.post("/auth/signup",userSignUp);
    app.post("/auth/reset" , resetPassword);
    app.get("/auth/verify/reset/:email/:resetToken" , verifyResetPassword);
    app.get("/auth/verify/signup/:token", verifySignup);
};

const userLogin = async(req,res)=>{
    try
    {
        const email = req.body.email;
        const password = req.body.password;
        const user = await User.findOne({email:email});
        console.log(user);
        if(user === undefined)
        {
            return res.json({"message":"This email doesn't exist"});
        }
        
        if(user.password != password)
        {
            return res.json({"message": "Wrong password"});
        }
        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ "user":user }, process.env.TOKEN_KEY);
        return res.json({"JWTtoken":token,"message":"Logged in"});

        
    }
    catch(err)
    {
        console.log(err);
        res.json({"message" : "Error"});
    }
}

const userSignUp = async (req,res)=>{
    try
    {
        //console.log(req.body);
        let newUser = new User({
            id: req.body.id,
            fullName : req.body.fullName,
            userName : req.body.userName,
            email : req.body.email,
            password: req.body.password
        });
        newUser.save();
        res.json({"message":"user was added", "user":newUser});
    }
    catch(err)
    {
        console.log(err);
        res.json({"message":"Error"});
    }
}


// Don't forget to change reset
/*
const resetPassword = async(req,res)=>{
    try
    {
        const email = req.body.email;
        const jwt = require("jsonwebtoken");
        const token = jwt.sign({ email:email }, process.env.TOKEN_KEY);
        // save this token
        await User.updateOne({email:email},{resetToken:token,resetTokenExp:Date.now()+300000});
        // send the token to the email
        const sendEmail = require("./../controllers/email");
        await sendEmail(email,token);
        res.json({"message":"Done!"});
    }
    catch(err)
    {
        req.json({"message":"Error"});
    }
};
*/

const verifyResetPassword = async(req,res)=>{
    try
    {
        const token = req.params.resetToken;
        const email = req.params.email;
        // get the true token from the DB and check it
        const jwt = require("jsonwebtoken");
        const decode = jwt.verify(token,process.env.TOKEN_KEY);
        const user = await User.findOne({email:email,resetTokenExp:{$gt:Date.now()}});
        if(user === null)
        {
            return res.json({"message":"token expired"});
        }
        if(user.resetToken != token)
        {
            return res.json({"message":"wrong token"});
        }
        return res.json({"message":"verified!"});
        
        

    }
    catch(err)
    {
        console.log(err);
        res.json({"message":"Error"});
    }
};

const verifySignup = async(req,res)=>{
    try
    {
        const token = req.params.token;
        const jwt = require("jsonwebtoken");
        const decode = jwt.verify(token,process.env.TOKEN_KEY);
        const decodedUserName = decode.userName;
        const user = await User.findOne({userName:decodedUserName});
        if(user.verificationToken === token)
        {
            await User.updateOne({userName:decodedUserName},{verified : true});
            return res.json({"message" : "Congratulations,your account is verified"});
        }
        return res.json({"message" : "faield to verify your account"});
    }
    catch(err)
    {
        console.log("error in verify sign up");
    }
};

const createToken = (payload)=>{
    try
    {
        const jwt = require("jsonwebtoken");
        const token = jwt.sign(payload, process.env.TOKEN_KEY);
        return token;
    }
    catch(err)
    {
        console.log("error within creating token");
    }
    
};





module.exports = auth;
module.exports.createToken = createToken;