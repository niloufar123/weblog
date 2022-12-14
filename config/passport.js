const passport=require("passport");
const {Strategy}=require("passport-local");
const bcrypt=require("bcryptjs");
const { use } = require("passport");


const User=require("../models/User");

passport.use(new Strategy({usernameField:"email"},async(email,password,done)=>{
    try{
        const user=await User.findOne({email})
        if(!user){
            return done(null,false,{message:"User is not registered with this email"})
        }
        const isMatch=await bcrypt.compare(password,user.password);
        if(isMatch){
            return done(null,user)//req.user
        }else{
            return done(null,false,{message:"userName or password is incorrect"})

        }
    }catch(err){
        console.log('passport error',err)

    }
}))

passport.serializeUser((user,done)=>{
    done(null,user)
});

passport.deserializeUser((id,done)=>{
    User.findById(id,(err,user)=>{
        done(err,user)
    })
})


  
