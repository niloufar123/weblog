const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");
const admincontroller=require("../controllers/adminController")

const router = new Router();

//@desc dashboard index
//@rout get /dashboard
router.get("/", authenticated, admincontroller.getDashboard);



//@desc addpost
//@rout get /dashboard/add-post
router.get("/add-post", authenticated, admincontroller.getAddpost);

//@desc handle post addpost
//@rout POST /dashboard/add-post
router.post("/add-post",  admincontroller.createPost);

//@desc handle post Image upload
//@rout POST /dashboard/image-upload
router.post("/image-upload",  admincontroller.uploadImage);

module.exports = router;
