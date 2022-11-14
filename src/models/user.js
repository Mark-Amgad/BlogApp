const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    id:{type:Number , required:true},
    fullName : {type: String, required:true},
    userName : {type : String, required:true, unique:true},
    email : {type:String , required:true},
    phone : {type:String},
    password : {type:String , required:true},
    verified : {type:Boolean, default:false},
    verificationToken : {type:String},
    resetToken : {type:String },
    resetTokenExp : {type:Date},
    blogs : [{ type: mongoose.Schema.Types.ObjectId, ref: 'Blog', required: false }]
});



module.exports = mongoose.model("User",userSchema);

