/**
 * @param  {number} current
 * @return {number}
 */
function shardCost(current) {
  return Math.floor(400 * Math.pow(1.028, current) - 127);
}

module.exports = { shardCost };
