const { Router } = require("express");
const  blogController= require("../controllers/blogController");

const router = new Router();

//@desc weblog landing page
//@rout Get /
// router.get("/", (req, res) => {
//   res.render("blog", { pageTitle: "Weblog", path: "/" });
// });

router.get("/",blogController.getIndex);

//@desc editpost
//@rout get /post/id
router.get("/post/:id", blogController.getSinglePost);





//@desc contact us
//@rout post /contact
router.post("/contact", blogController.handleContactPage);



//@desc captcha
//@rout get captcha
router.get("/captcha.png", blogController.getCaptcha);


module.exports = router;
