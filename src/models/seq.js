const mongoose = require("mongoose");

const seqSchema = mongoose.Schema(
    {
        userId:{type:Number,require:true,default:0},
        blogId:{type:Number,require:true,default:0}
    }
);


module.exports = mongoose.model("Seq",seqSchema);