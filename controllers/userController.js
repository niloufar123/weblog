const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");
const jwt=require("jsonwebtoken")
const bcrypt=require('bcryptjs')




exports.handleLogin =async (req, res, next) => {
  const {email,password}=req.body;
  try {
    const user=await User.findOne({email});
    if(!user){
      const error=new Error('we could not find this user');
      error.statusCode=404;
      throw error;
    }

    const isEqual=await bcrypt.compare(password,user.password);

    if(isEqual){
      const token=jwt.sign({user:{
        userId:user._id.toString(),
        email:user.email,
        fullname:user.fullname
      }
    },process.env.JWT_SECRET,
    );
    res.status(200).json({token,userId:user._id.toString()})
    }
else{
  const error=new Error("email address or password is incorrect");
  error.statusCode=422;
  throw error
}

  } catch (error) {
    next(error)
  }

  // passport.authenticate("local", {
  //   failureRedirect: "/users/login",
  //   failureFlash: true,
  // })(req, res, next);
  
};

exports.logout = (req, res) => {
  req.session=null
  req.logout(function (err) {
    // if (err) {
    //   return next(err);
    // }
    // req.flash("success_msg", "You have successfully logged out!");because session is null
    res.set(
      "Cache-Control",
      "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
    res.redirect("/users/login");
  });
};



exports.createUser = async (req, res) => {
  const errors = [];

  try {
    await User.userValidation(req.body);
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      errors.push({ message: "we have a user with this Email" });
      return res.render("register", {
        pageTitle: "user register",
        path: "/register",
        errors,
      });
    }
    // const hash = await bcrypt.hash(password, 10);
    // await User.create({
    //   fullname,
    //   email,
    //   password: hash,
    // });
    await User.create({
      fullname,
      email,
      password,
    });
    console.log('email',email)
    sendEmail(email,fullname,'Wellcom','We are delighted to have you as a bloger')

    req.flash("success_msg", "Registration was successful");
    res.redirect("/users/login");
  } catch (err) {
    console.log('errr---> ',err.inner[0].message)
    err.inner.forEach((e) => {
      errors.push({
        name: e.path,
        message: e.message,
      });
    });
    return res.render("register", {
      pageTitle: "user register",
      path: "/register",
      errors,
    });
  }
};


exports.handleForgetPassword = async (req, res) => {
  const {email}=req.body;
  const user=await User.findOne({email:email})

  if(!user){
    req.flash("error","we don't have this email in our database")
    return  res.render("forgetPass",{
      pageTitle:'forget password',
      path:"/login",
      message:req.flash("success-msg"),
      error:req.flash("error")
    })
  }
  const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"1h"});
  const resetLink=`https://nilobang.ir/ users/reset-password/${token}`
  sendEmail(user.email,user.fullname,
    'forget password',`to change your password click on this link
  <a href="${resetLink}">reset password</a>
  `)
  // sendEmail(user.email,user.fullname,'forget password','We are delighted to have you as a bloger')

  req.flash("success-msg", " forget pass email has been sent")

    res.render("forgetPass",{
    pageTitle:'forget password',
    path:"/login",
    message:req.flash("success-msg"),
    error:req.flash("error")
  })
}

exports.resetPassword=async(req,res)=>{
  const token=req.params.token;

  let decodedToken;
  try{
    decodedToken=await jwt.verify(token,process.env.JWT_SECRET)
  }catch (err){
    if(!decodedToken){
      return res.redirect("/404")
    }

  }

  res.render("resetPass",{
    pageTitle:'change password',
    path:"/login",
    message:req.flash("success-msg"),
    error:req.flash("error"),
    userId:decodedToken.userId
  })
}

exports.handleResetPassword=async(req,res)=>{
  const {password,confirmPassword}=req.body;
  if(password!=confirmPassword){
    req.flash("error","password and confirmPass aren't equal")

    res.render("resetPass",{
      pageTitle:'change password',
      path:"/login",
      message:req.flash("success-msg"),
      error:req.flash("error"),
      userId:req.params.userId
    })
  }else{

    const user=await User.findOne({_id:req.params.userId});
    if(!user){
      return res.redirect("/404")
    }
    user.password=password;
    await user.save();
    req.flash("success_msg","your password updated successfuly");
    res.redirect("/users/login")
  }
}