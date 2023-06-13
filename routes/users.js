const { Router } = require("express");
const yup=require('yup')

const userController=require('../controllers/userController');


const router = new Router();




//  @desc   Login handle
//  @route  POST /users/login
router.post("/login",userController.handleLogin);




//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register",userController.createUser);



//  @desc   handleForgetPassword
//  @route  POST /users/forget-password
router.post("/forget-password",userController.handleForgetPassword);




//  @desc   reset pass   
//  @route  Post /users/reset-password/:token
router.post("/reset-password/:token",userController.handleResetPassword);



module.exports = router;
