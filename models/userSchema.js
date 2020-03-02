const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  facebookId: String,
  googleId: String,
  email: String,
  birthday: Date,
});

module.exports = mongoose.model("users", userSchema);
