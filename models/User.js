const mongoose = require("mongoose");
const {schema}=require("./secure/userValidation");
const bcrypt=require("bcryptjs")

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, "you should add Name and Family"],
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 4,
        maxlength: 255,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});



userSchema.statics.userValidation = function (body) {
    console.log('model body',body)
    return schema.validate(body, { abortEarly: false });
};
userSchema.pre("save",function (next) {
    let user=this;
    if(!user.isModified("password")) return next();

    bcrypt.hash(user.password,10,(err,hash)=>{
        if(err) return next(err);
        user.password=hash;
        next()
    })
})

const User = mongoose.model("User", userSchema);

module.exports = User;
