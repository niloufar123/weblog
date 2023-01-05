const User = require("../models/User");

exports.login = (req, res) => {
  res.render("login", { pageTitle: "login", path: "/login" });
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
    const user = await User.findOne({email});

    if(user){
        errors.push({message:"we have a user with this Email"})
        return res.render("register", {
            pageTitle: "user register",
            path: "/register",
            errors,
          });
    }
    await User.create(req.body);
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
