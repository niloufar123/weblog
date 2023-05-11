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

//@desc editpost
//@rout get /dashboard/edit-post
router.get("/edit-post/:id", authenticated, admincontroller.getEditpost);

//@desc deletepost
//@rout get /dashboard/delete-post
router.get("/delete-post/:id", authenticated, admincontroller.Deletepost);

//@desc handle post editpost
//@rout POST /dashboard/edit-post
router.post("/edit-post/:id", authenticated, admincontroller.editPost);


//@desc handle post addpost
//@rout POST /dashboard/add-post
router.post("/add-post",authenticated,  admincontroller.createPost);

//@desc handle post Image upload
//@rout POST /dashboard/image-upload
router.post("/image-upload",  admincontroller.uploadImage);

module.exports = router;
