const Blog=require("../models/Blog");

exports.getDashboard=async (req,res)=>{
    console.log('da',req.body,req.user,req.body.id)
    try {
        const blogs= await Blog.find({user:req.user.id})
        res.render("private/blogs",{
            pageTitle:"admin ~ dashboard",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname:req.user.fullname,
            blogs
        })
    } catch (error) {
        console.log(error)
    }
    
    
}

exports.getAddpost=(req,res)=>{
    res.render("private/addPost",{
        pageTitle:"add new post",
        path:"/dashboard/add-post",
        layout:"./layouts/dashLayout",
        fullname:'req.user.fullname'

    })
}

exports.createPost=async(req,res)=>{
    try {
        await Blog.create({...req.body,user:req.user.id })
        console.log('post body',req.body)
        res.redirect("/dashboard")
    } catch (error) {
        console.log(error)
    }
}