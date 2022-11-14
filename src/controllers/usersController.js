const User = require("./../models/user");

const usersControllers = async (app)=>{
    app.post("/users/add" , addUser);
    app.get("/users/all" , getUsers);
    app.get("/users/:id" , getUser);
    app.delete("/users/remove/:id" , removeUser);
    app.put("/users/update",update);
};

const addUser = async (req,res)=>{
    try
    {
        //console.log(req.body);
        const createToken = require("./../controllers/auth").createToken;
        const token = createToken({userName:req.body.userName});
        //handling id
        const userId = await require("./seqController").getUserId();
        let newUser = new User({
            id: userId,
            fullName : req.body.fullName,
            userName : req.body.userName,
            phone:req.body.phone,
            email : req.body.email,
            password: req.body.password,
            verificationToken : token
        });
        await newUser.save();
        const sendEmail = require("./../controllers/email");
        const link = process.env.HOST + "/auth/verify/signup/" + token;
        //console.log(link);
        //const link = "http://localhost:8080/auth/verify/signup/" + token;
        let htmlContent = "<p> Hello," + req.body.userName + "</p>";
        htmlContent += "<p> please visit this link to verify your Account</p>";
        htmlContent = htmlContent + "<a href='"+ link + "'> link </a>";
        await sendEmail(req.body.email,"Verifiy your Email",htmlContent);
        res.json({"message":"user was added", "user":newUser});
    }
    catch(err)
    {
        //console.log(err);
        res.json({"message":"userName is exist"});
    }
}

const getUsers = async (req,res)=>{
    try
    {
        let allUsers = await User.find();
        res.json({"users" : allUsers});
    }
    catch(err)
    {
        console.log(err);
        res.json({"message":"Error"});
    }
};

const getUser = async(req,res)=>{
    try
    {
        const userId = req.params.id;
        let user = await User.findOne({id:userId});
        res.json({"user":user});
    }
    catch(err)
    {
        console.log(err);
        res.json({"message":"Error"});
    }
};

const removeUser = async(req,res)=>{
    try
    {
        const userId = Number(req.params.id);
        const deletedObject = await User.deleteOne({id:userId});
        const deletedCounter = deletedObject.deletedCount;
        if(deletedCounter === 1)
        {
            res.json({"message":"user Removed"});
        }
        else
        {
            res.json({"message":"No user to remove"});
        }
    }
    catch(err)
    {
        res.json({"message":"Error"});
    }
};

const update = async (req,res)=>{
    try
    {
        const userId = Number(req.body.userId);
        const updatedObject = await User.updateOne({id:userId},{
            id:Number(req.body.id),
            fullName : req.body.fullName,
            userName : req.body.userName,
            email : req.body.userEmail,
            phone : req.body.phone
        });

        if(updatedObject.modifiedCount === 1)
        {
            const updatedUser = await User.find({id:Number(req.body.id)});
            res.json({"message":"updated" , "user" : updatedUser});
        }
        else
        {
            res.json({"message" : "No updates occured"});
        }
    }
    catch(err)
    {
        res.json({"message":"Error"});
    }
};

module.exports = usersControllers;