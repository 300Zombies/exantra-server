const express = require("express");
const router = express.Router();
const Titan = require("../models/altertitanSchema");
const { traitMap } = require("../util/cst");
const { shardCost } = require("../util/currencies");

router.post("/", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  const { trait } = req.body;
  // sth. in [], use array.includes(sth.)
  // sth. in {}, use (sth. in object), both return true / false
  if (!traitMap.includes(trait) || !trait) {
    // bad request
    res.sendStatus(400);
    return;
  }
  // query titan currencies and traits
  Titan.findOne(
    {
      // findById queries Titan model's _id instead of userId
      userId: req.user._id,
    },
    "currencies character.traits",
    // query in Titan schema will always return titan object
    // no matter what filters are
    async (err, titan) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (titan === null) {
        res.sendStatus(401);
      } else {
        // calculate the cost of trait upgrade
        const shard =
          titan.currencies.shard -
          shardCost(titan.character.traits[`${trait}`]);
        const medal = titan.currencies.medal - 1;
        if (shard < 0 || medal < 0) {
          // purchase invalid insufficient funds
          res.status(403).send("insufficient currencies");
        } else {
          // valid perchase, update currencies and traits
          titan.currencies.shard = shard;
          titan.currencies.medal = medal;
          titan.character.traits[`${trait}`] += 1;
          await titan.save((err, updatedTitan) => {
            if (err) throw err;
            res.send(updatedTitan);
          });
        }
      }
    },
  );
});

// traits query (this api may not be needed)
router.get("/", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  // console.log("traits req.user", req.user);
  Titan.findOne(
    {
      // findById queries Titan model's _id instead of userId
      userId: req.user._id,
    },
    "character.traits",
    // query in Titan schema will always return titan object
    // no matter what filters are
    (err, titan) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (titan === null) {
        res.sendStatus(401);
      } else {
        res.send(titan.character.traits);
      }
    },
  );
});

module.exports = router;
