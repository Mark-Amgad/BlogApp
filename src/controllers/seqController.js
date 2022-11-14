const getUserId = async()=>{
    try
    {
        const Seq = require("./../models/seq");
        const result = await Seq.find();
        if(result.length === 0)
        {
            const seq = new Seq({userId:1,blogId:1});
            await seq.save();
        }
        const userId = (await Seq.find())[0].userId;
        await Seq.findOneAndUpdate({userId:userId} , {userId:userId+1});
        return userId
    }
    catch(err)
    {
        return -1;
    }
}


const getBlogId = async()=>{
    try
    {
        const Seq = require("./../models/seq");
        const result = await Seq.find();
        if(result.length === 0)
        {
            const seq = new Seq({userId:1,blogId:1});
            await seq.save();
        }
        const blogId = (await Seq.find())[0].blogId;
        await Seq.findOneAndUpdate({blogId:blogId} , {blogId:blogId+1});
        return blogId;
    }
    catch(err)
    {
        return -1;
    }
}

exports.getBlogId = getBlogId;
exports.getUserId = getUserId;