const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.login = (req, res) => {
  res.render("login", {
    pageTitle: "login",
    path: "/login",
    message: req.flash("success_msg"),
    error:req.flash("error")
  });
};

exports.handleLogin=(req,res,next)=>{
  passport.authenticate("local",{
    successRedirect:"/dashboard",
    failureRedirect:"/users/login",
    failureFlash:true
  })(req,res,next);
}

exports.logout=(req,res)=>{
  req.logout(function(err) {
    if (err) { return next(err); }
    req.flash("success_msg","You have successfully logged out!")
    res.redirect("/users/login")
  });
 
}

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
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      fullname,
      email,
      password: hash,
    });

    req.flash("success_msg", "Registration was successful");
    res.redirect("/users/login");
  } catch (err) {
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
