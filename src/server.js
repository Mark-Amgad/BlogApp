const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const mongoose = require("mongoose");
const usersControllers = require("./../src/controllers/usersController");
const BlogsControllers = require("./../src/controllers/BlogsController");
const auth = require("./controllers/auth");
const Seq = require("./models/seq");
const seq = require("./models/seq");
const { findOneAndUpdate } = require("./models/seq");
const app = express();







const port = 8080;

app.listen(port,async ()=>{
    try
    {
        await mongoose.connect(process.env.MONGODB_LINK);
        console.log("The server is running on port " + port);
        console.log("Database was connected successfully");
        //console.log(process.env.PORT);
    }
    catch(err)
    {
        console.log("There is a problem in the database or in the server");
    }
});
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

usersControllers(app);
BlogsControllers(app);
auth(app);

app.get("/test",async (req,res)=>{
    // const seqController = require("./controllers/seqController");
    // const userId = await seqController.getUserId();
    // const blogId = await seqController.getBlogId();
    // res.json({"userID":userId,"blogId":blogId});
});