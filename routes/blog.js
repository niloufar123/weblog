const { Router } = require("express");

const router = new Router();

//@desc weblog landing page
//@rout Get /
router.get("/", (req, res) => {
  res.render("blog", { pageTitle: "Weblog", path: "/" });
});

module.exports = router;
