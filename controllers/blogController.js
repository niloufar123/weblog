const Yup=require('yup');

const Blog = require("../models/Blog");
const { sendEmail } = require('../utils/mailer');
const captchapng = require('captchapng');


let CAPTCHA_NUM;


exports.getIndex = async (req, res) => {
 
    try {
        const numberOfPosts = await Blog.find({ status: "public" }).countDocuments();

        const posts = await Blog.find({ status: "public" })
            .sort({ createdAt: "desc" })

            res.status(200).json({
                posts,total:numberOfPosts   
            })

       
    } catch (err) {
        console.log(err)
        res.status(400).json({error:err})
    }
}

exports.getSinglePost = async (req, res) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate("user")

        if (!post) return res.status(404).json({message:"not Found"})

        res.status(200).json({post})

    } catch (err) {
        console.log(err)
        res.status(400).json({error:err})
    }

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