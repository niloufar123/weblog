const { Router } = require("express");
const yup=require('yup')

const userController=require('../controllers/userController');
const { authenticated } = require("../middlewares/auth");


const router = new Router();

//  @desc   Login Page
//  @route  GET /users/login
router.get("/login",userController.login);


//  @desc   Login handle
//  @route  POST /users/login
router.post("/login",userController.handleLogin,userController.rememberMe);

//@desc Logout
router.get("/logout",authenticated,userController.logout)

//  @desc   Register Page
//  @route  GET /users/register
router.get("/register",userController.register);

//  @desc   Register Handle
//  @route  POST /users/register
router.post("/register",userController.createUser);

//  @desc   Register Handle   
//  @route  POST /users/register
router.get("/forget-password",userController.forgetPassword);

//  @desc   handleForgetPassword
//  @route  POST /users/forget-password
router.post("/forget-password",userController.handleForgetPassword);


//  @desc   reset pass   
//  @route  GET /users/reset-password
router.get("/reset-password/:token",userController.resetPassword);


//  @desc   reset pass   
//  @route  Post /users/reset-password
router.post("/reset-password/:userId",userController.handleResetPassword);



module.exports = router;
