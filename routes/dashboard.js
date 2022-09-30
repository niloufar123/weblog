const {Router}=require('express');

const router=new Router;



//@desc dashboard
//@rout GET /login    
router.get("/", (req, res) => {
    res.render("dashboard", { pageTitle: "Dashboard", path: "/lashboard" ,layout:'./layouts/dashLayout' });
  });

module.exports=router;