const Blog=require("../models/Blog");
const {formatDate}=require('../utils/formatDate');


exports.getIndex=async(req,res)=>{
    try{
        const posts=await Blog.find({status:"public"}).sort({createdAt:"desc"});

        res.render("blog",{
            pageTitle:" weblog",
            path:"/",
            posts,
            formatDate
        })
    }catch(err){
        console.log(err)
        res.render("errors/500");
    }
}

exports.post=async(req,res)=>{
    const post=await Blog.findOne({
        _id:req.params.id 
    })

    if(!post){
        return res.redirect("errors/404")
    }
    
    else{
        res.render("private/post", {
            pageTitle: "post detail",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            post,
            formatDate
    
        })
    }
    
}