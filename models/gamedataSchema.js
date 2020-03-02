const mongoose = require("mongoose");
// TODO: auto increment function for gamedata
const gamedataSchema = mongoose.Schema({
  items: [
    {
      id: String,
      name: String,
      type: Number, // 0. equipment, 2. consumable, ...
      cost: Number,
    },
  ],
  abilities: [
    {
      id: String,
      name: String,
      cost: Number,
    },
  ],
  skills: [
    {
      id: String,
      name: String,
      cost: Number,
    },
  ],
});

module.exports = mongoose.model("gamedata", gamedataSchema);
