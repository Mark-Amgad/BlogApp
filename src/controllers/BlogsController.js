const Blog = require("./../models/blog");
const User = require("./../models/user");
const BlogsControllers = (app)=>{
    app.get("/blogs/all",getBlogs);
    app.post("/blogs/add",addBlog);
    app.get("/blogs/:blogId",getBlog);
    app.delete("/blogs/remove",remove);
};

const getBlogs = async (req,res)=>{
    try
    {
        const blogs = await Blog.find() // get blogs only
        //const blogs = await Blog.find().populate("authorId"); // get blogs and data of the author
        res.json({"blogs":blogs});
    }
    catch(err)
    {
        res.json({"message":"Error"});
    }
};

const addBlog = async (req,res)=>{
    try
    {
        const blogId = await require("./seqController").getBlogId();
        const newBlog = new Blog({
            id:blogId,
            title:req.body.title,
            content:req.body.content,
            authorId:req.body.authorId,
        });
        await newBlog.save();
        let user = await User.findOne({_id:req.body.authorId});
        let allblogs = user.blogs;
        allblogs.push(newBlog);
        await User.updateOne({_id:req.body.authorId},{blogs:allblogs});
        

        res.json({"message":"Blog posted" , "newBlog":newBlog});
    }
    catch(err)
    {
        console.log(err);
        res.json({"message":"Error"});
    }
};

const getBlog = async(req,res)=>{
    try
    {
        const blogId = Number(req.params.blogId);
        const blog = await Blog.find({id:blogId});
        res.json({"blog":blog});
    }
    catch(err)
    {
        res.json({"message":"Error"});
    }
};


const remove = async(req,res)=>{
    try
    {
        const blogId = Number(req.body.blogId);
        const deletedObject = await Blog.deleteOne({id:blogId});
        const deletedCounter = deletedObject.deletedCount;
        if(deletedCounter === 1)
        {
            res.json({"message":"Blog deleted!"});
        }
        else
        {
            res.json({"message":"No blog found to be deleted"});
        }
    }
    catch(err)
    {
        res.json({"message":"Error"});
    }
};

module.exports = BlogsControllers;