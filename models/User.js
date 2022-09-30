const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: { type: String, require: true, trim: true },
  email: { type: String, require: true, unique: true },
  password: { type: String, require: true, minLength: 4, maxLegth: 255 },
  createAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
