const multer = require("multer");
const {storage,fileFilter}=require('../utils/multer')
const Blog=require("../models/Blog");
const {get500}=require('./errorController')
uuid

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
        // get500(req,res)
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
    let errors=[];
    try {
        await Blog.postValidation(req.body);
        await Blog.create({...req.body,user:req.user.id })
        console.log('post body',req.body)
        res.redirect("/dashboard")
    } catch (err) {
        console.log(err)
        // get500(req,res)
        err.inner.forEach((e) => {
            errors.push({
              name: e.path,
              message: e.message,
            });
        })
        
    res.render("private/addPost",{
        pageTitle:"add new post",
        path:"/dashboard/add-post",
        layout:"./layouts/dashLayout",
        fullname:'req.user.fullname',
        errors:errors

    })
}}


exports.uploadImage = (req, res) => {
    // let fileName = `${uuid()}.jpg`;


  
    const upload = multer(
                {
                 limits:{fileSize:4000000000},
                 dest: 'uploads/',
                 storage:storage,
                 fileFilter:fileFilter
                }).single("image")
        
            upload(req,res,err=>{
                if(err){
                    res.send(err);
                }else{
                    if(res.file){
                         
                        res.status(200).send("The upload was successful")
                    }else{
                        
                        res.send("please select an image")

                    }
                }
            })
};