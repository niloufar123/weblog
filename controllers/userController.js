const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const { sendEmail } = require("../utils/mailer");
const jwt=require("jsonwebtoken")

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));


exports.login = (req, res) => {
  res.render("login", {
    pageTitle: "login",
    path: "/login",
    message: req.flash("success_msg"),
    error: req.flash("error"),
  });
};

exports.handleLogin =async (req, res, next) => {
  console.log(req.body["g-recaptcha-response"]);
  if (!req.body["g-recaptcha-response"]) {
    req.flash("error", "Captcha is required");
    return res.redirect("/users/login");
  }

  const secretKey = process.env.CAPTCHA_SECRET;
  
  const verifyURL = `https://google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${req.body["g-recaptcha-response"]}
    &remoteip=${req.connection.remoteAddress}`;
  const response = await fetch(verifyURL, {
	method: 'post',
	headers: {Accept:'application/json',
   'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'}
});
const data = await response.json();
console.log('data',data)
if(data.success){

  passport.authenticate("local", {
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
  }else{
  req.flash("error","captcha authentication failed")
  res.redirect("/users/login")
}
};

exports.rememberMe = (req, res) => {
  if (req.body.remember) {
    req.session.cookie.originalMaxAge = 24 * 60 * 60 * 1000; // one day
  } else {
    req.session.cookie.expire = null;
  }
  res.redirect("/dashboard");
};
exports.logout = (req, res) => {
  req.session=null
  req.logout(function (err) {
    // if (err) {
    //   return next(err);
    // }
    // req.flash("success_msg", "You have successfully logged out!");because session is null
    res.redirect("/users/login");
  });
};

exports.register = (req, res) => {
  res.render("register", {
    pageTitle: "Add user",
    path: "/register",
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
exports.forgetPassword = async (req, res) => {
  res.render("forgetPass",{
    pageTitle:'forget password',
    path:"/login",
    message:req.flash("success-msg"),
    error:req.flash("error")
  })
}

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
  const resetLink=`http://localhost:3000/user/reset-password/${token}`
  // sendEmail(user.email,user.fullname,
  //   'forget password',`for change your password click on this link
  // <a href="${resetLink}">reset password</a>
  // `)
  sendEmail(user.email,user.fullname,'forget password','We are delighted to have you as a bloger')

  req.flash("success-msg", " forget pass email has been sent")

    res.render("forgetPass",{
    pageTitle:'forget password',
    path:"/login",
    message:req.flash("success-msg"),
    error:req.flash("error")
  })
}