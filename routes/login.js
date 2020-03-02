const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post(
  "/google/authcode",
  passport.authenticate("google-authcode"),
  (req, res) => {
    res.send(req.user);
  },
);

router.post(
  "/facebook/token",
  passport.authenticate("facebook-token"),
  (req, res) => {
    res.send(req.user);
  },
);

module.exports = router;
