const Yup=require('yup');

const captchaPng=require("captchapng")
const Blog = require("../models/Blog");
const { formatDate } = require('../utils/formatDate');
const { trunCate } = require('../utils/helpers');
const { sendEmail } = require('../utils/mailer');
const captchapng = require('captchapng');


let CAPTCHA_NUM;


exports.getIndex = async (req, res) => {
    const page = +req.query.page || 1;
    const postPerPage = 5;
    try {
        const numberOfPosts = await Blog.find({ status: "public" }).countDocuments();

        const posts = await Blog.find({ status: "public" })
            .sort({ createdAt: "desc" })
            .skip((page - 1) * postPerPage)
            .limit(postPerPage);

        res.render("blog", {
            pageTitle: " weblog",
            path: "/",
            posts,
            formatDate,
            trunCate,

            currentPage: page,
            nextPage: page + 1,
            previousPage: page - 1,
            hasNextPage: postPerPage * page < numberOfPosts,
            hasPreviousPage: page > 1,
            lastPage: Math.ceil(numberOfPosts / postPerPage),
        })
    } catch (err) {
        console.log(err)
        res.render("errors/500");
    }
}

exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate("user")

        if (!post) return res.redirect("errors/404")

        res.render("private/post", {
            pageTitle: post.title,
            path: "/dashboard/post",

            post,
            formatDate,


        })

    } catch (err) {
        console.log(err)
        res.render("errors/500");
    }

}

exports.getContactPage=(req,res)=>{
    res.render("contact",{
        pageTitle:"contactUs",
        path:"/contact",
        message:req.flash("success_msg"),
        error:req.flash("error"),
        errors:[]

    })
}

exports.handleContactPage=async(req,res)=>{
    const errorArr=[]
    const {fullname,email,message,captcha}=req.body;

    const schema=Yup.object().shape({
        fullname:Yup.string()
        .required("fullname is required"),
        email:Yup.string().email("email isn't correct")
        .required("email is required"),       
        message:Yup.string()
        .required("Your message should have body"),
        })

        // console.log('fff',errorArr)
        try {
            await schema.validate(req.body,{abortEarly:false})
            // schema.validate(req.body, { abortEarly: false });

            //captcha validation
            if(parseInt(captcha)==CAPTCHA_NUM){

                sendEmail(email,fullname,"weblog message",`${message} user email ${email}`)
                req.flash("success_msg","your message successfuly sent")
     
                return res.render("contact",{
                    pageTitle:"contactUs",
                    path:"/contact",
                    message:req.flash("success_msg"),
                    error:req.flash("error"),
                    errors:errorArr
            
                })
            }

            req.flash("error","captcha is wrong")
            return res.render("contact",{
                pageTitle:"contactUs",
                path:"/contact",
                message:req.flash("success_msg"),
                error:req.flash("error"),
                errors:errorArr
        
            })
        } catch (err ) {
            // console.log('err',err.inner)
            err.inner.forEach((e) => {
                console.log(errorArr)
                errorArr.push({
                    name: e.path,
                    message: e.message,
                });
            })
            res.render("contact",{
                pageTitle:"contactUs",
                path:"/contact",
                message:req.flash("success_msg"),
                error:req.flash("error"),
                errors:errorArr
        
            })
            
        }
    
    
    
}

exports.getCaptcha=(req,res)=>{
    CAPTCHA_NUM=parseInt(Math.random()*9000+1000);
    const p=new captchapng(80,30,CAPTCHA_NUM);
    p.color(0,0,0,0);
    p.color(80,80,80,255);

    const img=p.getBase64();
    const imgBase64=Buffer.from(img,'base64');

    res.send(imgBase64)
}