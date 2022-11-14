const mongoose = require("mongoose");

const Blog = mongoose.Schema({
    id:{type:Number,required:true,unique:true},
    title:{type:String,required:true},
    content:{type:String,required:true},
    authorId:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true}
});

module.exports = mongoose.model("Blog",Blog);