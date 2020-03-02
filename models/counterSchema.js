const mongoose = require("mongoose");

const counterSchema = mongoose.Schema({
  _id: {
    type: String,
  },
  current: {
    type: Number,
  },
});

module.exports = mongoose.model("counter", counterSchema);
