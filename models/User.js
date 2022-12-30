const mongoose=require("mongoose")
const { Schema } = mongoose;

const Yup = require("yup");



const userSchema = new Schema({
  name: { type: String, require: [true,"you should add Name and Family"] ,trim: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, minLength: 4, maxLegth: 255 },
  createAt: { type: Date, default: Date.now },
});

const schema = Yup.object().shape({
  name: Yup.string()
    .required("name is required")
    .min(3, "It should be 3 character")
    .max(255, "It should be 3 character"),
  email: Yup.string().email("email is required").required("email is required"),
  password: Yup.string()
    .min(3, "It should be 3 character")
    .max(255, "It should be 3 character")
    .required("password is required"),
    confirmPassword: Yup.string()
    .required("confirmPassword is required")
    .oneOf([Yup.ref("password"), null]),
});


userSchema.statics.userValidation = function (body) {
  console.log(body)
  // return schema.validate(body, { abortEarly: false });
};


const User = mongoose.model("User", userSchema);
module.exports = User;
