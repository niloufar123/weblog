const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");

const router = new Router();

//@desc dashboard index
//@rout get /dashboard
router.get("/", authenticated, (req, res) => {
  res.render("dashboard", {
    pageTitle: "dashboard",
    path: "/dashboard",
    layout: "./layouts/dashLayout",
    fullname:req.user.fullname
  });
});



module.exports = router;
