const mongoose = require("mongoose");
// TODO: gears default value needed
const alterTitanSchema = mongoose.Schema({
  userId: { type: String, index: true },
  timezone: { type: Number, default: -1 },
  workoutSurvey: {
    workoutPlace: { type: Number, min: 0, max: 2 },
    currentExercisePerWeek: Number,
    targetExercisePerWeek: Number,
    lengthPerSession: Number,
    focus: { type: Number, min: 0, max: 4 },
    motivation: { type: Number, min: 0, max: 4 },
  },
  currencies: {
    token: { type: Number, default: 10000 },
    shard: { type: Number, default: 10000 },
    medal: { type: Number, default: 10000 },
    augment: { type: Number, default: 10000 },
  },
  character: {
    nickname: String,
    soldierId: Number,
    faction: { type: Number, min: 0, max: 2 },
    gender: { type: Number, min: 0, max: 1 },
    level: { type: Number, default: 1 },
    experience: { type: Number, default: 0 },
    traits: {
      dexterity: { type: Number, default: 10 },
      intelligence: { type: Number, default: 10 },
      strength: { type: Number, default: 10 },
      constitution: { type: Number, default: 10 },
      reflex: { type: Number, default: 10 },
      luck: { type: Number, default: 10 },
    },
    gears: {
      helmet: Number,
      jacket: Number,
      pants: Number,
      shoes: Number,
      suit: Number,
      bag: Number,
      mainHand: Number,
      offHand: Number,
    },
    abilities: [{ id: Number, level: Number }],
  },
  workoutSession: [
    {
      screenshot: { type: String, default: "" },
      selfie: { type: String, default: "" },
      start: { type: Number, default: 0 },
      length: { type: Number, default: 0 },
      type: { type: Number, default: -1 },
      location: { type: String, default: "" },
      notes: { type: String, default: "" },
      rewards: {
        exp: { type: Number, default: 0 },
        hp: { type: Number, default: 0 },
        token: { type: Number, default: 0 },
        shard: { type: Number, default: 0 },
        medal: { type: Number, default: 0 },
        augment: { type: Number, default: 0 },
      },
    },
  ],
  workoutStreak: { type: Number, min: 0, max: 7, default: 0 },
});

module.exports = mongoose.model("titans", alterTitanSchema);
