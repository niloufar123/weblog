const Yup=require('yup');

const Blog = require("../models/Blog");
const { sendEmail } = require('../utils/mailer');
const captchapng = require('captchapng');


let CAPTCHA_NUM;


exports.getIndex = async (req, res,next) => {
 
    try {
        const numberOfPosts = await Blog.find({ status: "public" }).countDocuments();

        const posts = await Blog.find({ status: "public" })
            .sort({ createdAt: "desc" })

            res.status(200).json({
                posts,total:numberOfPosts   
            })

        if(!posts){
            const error=new Error("there is no post in our database")
            error.statusCode=404;
            throw error;
        }

       
    } catch (err) {
        next(err)
    }
}

exports.getSinglePost = async (req, res,next) => {
    try {
        const post = await Blog.findOne({ _id: req.params.id }).populate("user")

        
        if(!post){
            const error=new Error("there is no post with this id")
            error.statusCode=404;
            throw error;
        }
        res.status(200).json({post})

    } catch (err) {
       
        next(err)
    }

}



exports.handleContactPage=async(req,res,next)=>{
    const errorArr=[]
    const {fullname,email,message}=req.body;

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

           

                sendEmail(email,fullname,"weblog message",`${message} user email ${email}`)
                res.status(200).json({message:"your message submited"})
     
        } catch (err ) {
            // console.log('err',err.inner)
            err.inner.forEach((e) => {
                console.log(errorArr)
                errorArr.push({
                    name: e.path,
                    message: e.message,
                });
            })
          const error=new Error("error in validate")
          error.statusCode=422;
          error.data=errorArr
          next(error)
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

exports.handleSearch=async(req,res)=>{
    const page = +req.query.page || 1;
    const postPerPage = 5;
    try {
        const numberOfPosts = await Blog.find({ status: "public",
        $text:{$search:req.body.search}
    }).countDocuments();

        const posts = await Blog.find({ status: "public",$text:{$search:req.body.search} })
            .sort({ createdAt: "desc" })
            .skip((page - 1) * postPerPage)
            .limit(postPerPage);

        res.render("blog", {
            pageTitle: "search results",
            path: "/",
            posts,
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
        get500(req,res)
    }
   
}