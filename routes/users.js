const { Router } = require("express");
const Yup = require("yup");
const validator = require("fastest-validator");
const User=require('../models/User')
const v = new validator();

const router = new Router();

const schema = {
  name: {
    type: "string",
    min: 3,
    max: 255,
    trim: true,
    messages: {
      required: "Name is required",
      stringMax:"It should not be 255 character"
    },
  },
  email:{
    type:"email",
    normalize:true,
    messages:{
      required:'Email is required',
      string:'check your email'
    }
  },
  password: {
    type: "string",
    min: 3,
    max: 255,
    messages: {
      required: "password is required",
      stringMax:"It should not be 255 character"
    },
  },
  confirmPassword:{
    type: "string",
    min: 3,
    max: 255,
    messages: {
      required: "confirmPassword is required",
      stringMax:"It should not be 255 character"
    },
  }
};



//@desc login page
router.get("/login", (req, res) => {
  res.render("login", { pageTitle: "Login", path: "/login" });
});

//@desc register page
router.get("/register", (req, res) => {
  res.render("register", { pageTitle: "Register new user", path: "/register" });
});

//@desc register handle
router.post("/register", async(req, res) => {
  
    //------------------------------fastest validator example
    const validate=v.validate(req.body,schema);
    const errArr=[];
    if(validate===true){
      console.log('not eqal2345')

      const {name,email,password,confirmPassword}=req.body;
      if(password!==confirmPassword){
        errArr.push({message:"Passwords do not match "});
        console.log(errArr)
        return  res.render("register", {
          pageTitle: "Register new user",
          path: "/register",
          errors:errArr,
        });
        
      }
      res.redirect("/users/login");
    }else{
      return  res.render("register", {
        pageTitle: "Register new user",
        path: "/register",
        errors:validate,
      });
    }
});
module.exports = router;