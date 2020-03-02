const Counter = require("../models/counterSchema");

/**
 * @param {string} counterId
 */
module.exports = async function autoIncrement(counterId) {
  const counter = await Counter.findOneAndUpdate(
    {
      _id: counterId,
    },
    {
      $inc: {
        current: 1,
      },
    },
    {
      new: true,
    },
  );
  return counter.current;
};
