const multer = require("multer");
const {  fileFilter } = require('../utils/multer')
const Blog = require("../models/Blog");
const { formatDate } = require("../utils/formatDate");

const { get500 } = require('./errorController')
const sharp = require("sharp")
const uuid = require("uuid").v4;

exports.getDashboard = async (req, res) => {
    console.log('da', req.body, req.user, req.body.id)
    try {
        const blogs = await Blog.find({ user: req.user.id })
        res.render("private/blogs", {
            pageTitle: "admin ~ dashboard",
            path: "/dashboard",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            blogs,
            formatDate
        })
    } catch (error) {
        console.log(error)
        // get500(req,res)
    }


}

exports.getAddpost = (req, res) => {

    res.render("private/addPost", {
        pageTitle: "add new post",
        path: "/dashboard/add-post",
        layout: "./layouts/dashLayout",
        fullname: req.user.fullname

    })
}
exports.getEditpost =async (req, res) => {
    const post=await Blog.findOne({
        _id:req.params.id 
    })

    if(!post){
        return res.redirect("errors/404")
    }
    if(post.user.toString()!==req.user.id){
        return res.redirect("/dashboard")
    }
    else{
        res.render("private/editPost", {
            pageTitle: "Edit post",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: req.user.fullname,
            post
    
        })
    }
    
}
exports.Deletepost=async (req,res)=>{
    try{

        const result=await Blog.findByIdAndRemove(req.params.id);//delete doen't show item deleted
        console.log(result)
        res.redirect("/dashboard")
    }catch(err){
        res.render("errors/500s")
    }
}
exports.editPost=async(req,res)=>{
    let errors = [];
    const post=await Blog.findOne({_id:req.params.id})
            const {title,status,body}=req.body;
    try {
        await Blog.postValidation(req.body);
        if(!post){
            return res.redirect("errors/404")
        }else
            if(post.user.toString()!=req.user._id){
                console.log('posd11111', req.body)

                return res.redirect("/dashboard")

            }
        else{
            console.log('posdt', req.body)

            const {title,status,body}=req.body;
            post.title=title;
            post.body=body;
            post.status=status;
            await post.save();
            res.redirect("/dashboard")

        }
        
    } catch (err) {
        err.inner.forEach((e) => {
            errors.push({
                name: e.path,
                message: e.message,
            });
        })

        res.render("private/editPost", {
            pageTitle: "edit post",
            path: "/dashboard/edit-post",
            layout: "./layouts/dashLayout",
            fullname: 'req.user.fullname',
            errors: errors,
            post

        })
    }
}

exports.createPost = async (req, res) => {
    let errors = [];
    try {
        await Blog.postValidation(req.body);
        await Blog.create({ ...req.body, user: req.user.id })
        console.log('post body', req.body)
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

        res.render("private/addPost", {
            pageTitle: "add new post",
            path: "/dashboard/add-post",
            layout: "./layouts/dashLayout",
            fullname: 'req.user.fullname',
            errors: errors

        })
    }
}


exports.uploadImage = (req, res) => {
    // let fileName = `${uuid()}.jpg`;



    const upload = multer(
        {
            limits: { fileSize: 40000000000 },
            //  dest: 'uploads/',
            //  storage:storage,
            fileFilter: fileFilter
        }).single("image")

    upload(req, res, async (err) => {

        if (err) {
            if (err.code == "LIMIT_FILE_SIZE") {
                return res
                .status(400)
                .send("file value should be lower than 4MG")
            }
            res.status(400).send(err);
        } else {
            if (req.file) {
                const fileName = `${uuid()}_${req.file.originalname}`

                await sharp(req.file.buffer).jpeg({
                    quality: 60
                })
                    .toFile(`./public/uploads/${fileName}`)
                    .catch(err => console.log(err))

                res.status(200).send(`http://localhost:3000/uploads/${fileName}`)
            } else {

                res.send("please select an image")

            }
        }
    })
};