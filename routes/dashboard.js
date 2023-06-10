const { Router } = require("express");
const { authenticated } = require("../middlewares/auth");
const admincontroller=require("../controllers/adminController")

const router = new Router();



//@desc deletepost
//@rout get /dashboard/delete-post
router.delete("/delete-post/:id", authenticated, admincontroller.Deletepost);

//@desc handle post editpost
//@rout POST /dashboard/edit-post
router.put("/edit-post/:id", authenticated, admincontroller.editPost);


//@desc handle post addpost
//@rout POST /dashboard/add-post
router.post("/add-post",authenticated,  admincontroller.createPost);

//@desc handle post Image upload
//@rout POST /dashboard/image-upload
router.post("/image-upload",  admincontroller.uploadImage);

module.exports = router;
