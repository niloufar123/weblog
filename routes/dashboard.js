const {Router}=require('express');
const {authenticated}=require("../middlewares/auth")

const router=new Router;

//@desc dashboard index
//@rout get /dashboard
router.get("/",authenticated,(req,res)=>{
  res.render("dashboard",{pageTitle:"dashboard",path:'/dashboard',layout:'./layouts/dashLayout'})
})
//@desc login page
//@rout GET /dashboard/login    
router.get("/login", (req, res) => {
    res.render("login", { pageTitle: "Dashboard", path: "/login" ,layout:'./layouts/dashLayout' });
  });

module.exports=router;