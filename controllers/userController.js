const User = require("../models/User");
const { sendEmail } = require("../utils/mailer");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcryptjs')




exports.handleLogin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('we could not find this user');
      error.statusCode = 404;
      throw error;
    }

    const isEqual = await bcrypt.compare(password, user.password);

    if (isEqual) {
      const token = jwt.sign({
        user: {
          userId: user._id.toString(),
          email: user.email,
          fullname: user.fullname
        }
      }, process.env.JWT_SECRET,
      );
      res.status(200).json({ token, userId: user._id.toString() })
    }
    else {
      const error = new Error("email address or password is incorrect");
      error.statusCode = 422;
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
  req.session = null
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



exports.createUser = async (req, res, next) => {

  try {
    await User.userValidation(req.body);
    const { fullname, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      const error = new Error("there is a user with the same email");
      error.statusCode = 422;
      throw error;

    } else {

      await User.create({
        fullname,
        email,
        password,
      });
      sendEmail(email, fullname, 'Wellcom', 'We are delighted to have you as a bloger');
      //created successfully
      res.status(201).json({ message: "user created successfully" })




    }
  } catch (err) {
    next(err)
  }


};


exports.handleForgetPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email: email })

    if (!user) {
      const error = new Error("this username doesn't exist");
      error.statusCode = 404;
      throw error
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    const resetLink = `https://nilobang.ir/users/reset-password/${token}`
    sendEmail(user.email, user.fullname,
      'forget password', `to change your password click on this link
    <a href="${resetLink}">reset password</a>
    `)
   

   res.status(200).json({message:"reset like was sent"})

  } catch (error) {
    next(error)
  }

}



exports.handleResetPassword = async (req, res,next) => {
  const token=req.params.token;
  const { password, confirmPassword } = req.body;

  
  
  try {
  const decodedToken=jwt.verify(token,process.env.JWT_SECRET)
  if(!decodedToken){
    const error=new Error({message:"you don't have access the operation"});
    error.statusCode=401;
    throw error;
  }
  
  if (password != confirmPassword) {
    const error=new Error({message:"password and confirmPassword aren't equal"});
    error.statusCode=422;
    throw error;
  } else {

    const user = await User.findOne({ _id: decodedToken.userId });
    if (!user) {
      const error=new Error({message:"this user doesn't found "});
      error.statusCode=404;
      throw error;
    }
    user.password = password;
    await user.save();
    res.status(200).json({message:"the operation have done successfully"})
  }

} catch (err) {
  next(err)
}
}