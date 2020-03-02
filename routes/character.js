const express = require("express");
const router = express.Router();
const Titan = require("../models/altertitanSchema");

router.get("/", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  console.log("character req.user", req.user);
  Titan.findOne(
    {
      // findById queries Titan model's _id instead of userId
      userId: req.user._id,
    },
    (err, titan) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (titan === null) {
        res.sendStatus(401);
      } else {
        res.send(titan.character);
      }
    },
  );
});

module.exports = router;
