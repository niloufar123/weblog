const { Router } = require("express");
const Yup = require("yup");
const validator = require("fastest-validator");
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


// const schema = Yup.object().shape({
//   fullname: Yup.string()
//     .required("name is required")
//     .min(4, "It should be 4 character")
//     .max(255, "It should be 4 character"),
//   email: Yup.string().email("email is required").required("email is required"),
//   password: Yup.string()
//     .min(4, "It should be 4 character")
//     .max(255, "It should be 4 character")
//     .required("password is required"),
//   confirmPassword: Yup.string()
//     .required("confirmPassword is required")
//     .oneOf([Yup.ref("password"), null]),
// });

//@desc login page
router.get("/login", (req, res) => {
  res.render("login", { pageTitle: "Login", path: "/login" });
});

//@desc register page
router.get("/register", (req, res) => {
  res.render("register", { pageTitle: "Register new user", path: "/register" });
});

//@desc register handle
router.post("/register", (req, res) => {
  // --------------------------Yup example
  // schema
  //   .validate(req.body)
  //   .then((result) => {
  //     res.redirect("/users/login");
  //   })
  //   .catch((err) => {
  //     console.log("err", err.errors);
  //     res.render("register", {
  //       pageTitle: "Register new user",
  //       path: "/register",
  //       errors: err.errors,
  //     });
  //   });
    //------------------------------fastest validator example
    const validate=v.validate(req.body,schema);
    const errArr=[];
    if(validate===true){
      const {name,email,password,confirmPassword}=req.body;
      if(password!==confirmPassword){
        errArr.push({messages:'passwords are not equal'})
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
