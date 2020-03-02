const express = require("express");
const router = express.Router();
const User = require("../models/userSchema");
const Titan = require("../models/altertitanSchema");
const autoIncrement = require("../util/increment");

router.get("/signin", (req, res) => {
  // check cookie to see if user already registered
  if (!req.user || !req.user._id) {
    // no cookie == not registered user == unauthorized
    res.sendStatus(401);
    return;
  }
  console.log("signin req.user", req.user);
  User.findById(req.user._id, (err, user) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if (user === null) {
      // some how you got cookie but didn't registered in user document
      res.sendStatus(401);
    } else {
      // valid user, query titan data
      Titan.findOne(
        {
          // findById queries Titan model's _id instead of userId
          userId: req.user._id,
        },
        "character currencies workoutSession workoutStreak",
        (err, titan) => {
          if (err) {
            res.sendStatus(500);
            return;
          }
          if (titan === null) {
            // not registered in altertitan
            res.sendStatus(401);
          } else {
            // titan found, calculate workout streak
            // user login time minus last session
            // if greater than 4 days then workout streak = 0
            // in smaller than 4 days then workout streak stay unchanged
            const session = titan.workoutSession;
            const last = session.length - 1 < 0 ? 0 : session.length - 1;
            const oneDay = 24 * 60 * 60 * 1000;
            const gap = Date.now() - session[last].start;
            if (!session[last] || gap / oneDay > 4) {
              titan.workoutStreak = 0;
              titan.save((err, titan) => {
                if (err) {
                  res.sendStatus(500);
                  return;
                }
                console.log("workout streak reset", titan.workoutStreak);
              });
            }
            res.send(titan);
          }
        },
      );
    }
  });
});

router.post("/signup", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  console.log("signup req.user", req.user);
  const data = req.body;
  User.findById(req.user._id, (err, user) => {
    if (err) {
      res.sendStatus(500);
      return;
    }
    if (user === null) {
      res.sendStatus(401);
    } else {
      // populating user document with birthday and titan document with data
      user.birthday = new Date(data.birthday);
      user.save((err, user) => {
        if (err) {
          // something went wrong
          res.sendStatus(500);
          return;
        }
      });
      // validation of titan existence
      Titan.findOne(
        {
          userId: req.user._id,
        },
        async (err, titan) => {
          if (err) {
            res.sendStatus(500);
            return;
          }
          // if titan doesn't exist
          if (!titan) {
            // re-use titan variable
            titan = new Titan({
              userId: req.user._id,
              workoutSurvey: {
                workoutPlace: data.workoutPlace,
                currentExercisePerWeek: data.currentExercisePerWeek,
                targetExercisePerWeek: data.targetExercisePerWeek,
                lengthPerSession: data.lengthPerSession,
                focus: data.focus,
                motivation: data.motivation,
              },
              character: {
                nickname: data.nickname,
                soldierId: await autoIncrement("counter"), // auto increment
                faction: data.faction, // 0: Pacific, 1: Myahara, 2: Twilight
                gender: data.gender, // 0: Female, 1: Male
              },
            });
            titan.save((err, newTitan) => {
              if (err) {
                res.status(500);
                return;
              }
              res.send({
                character: newTitan.character,
                currencies: newTitan.currencies,
                workoutSession: newTitan.workoutSession,
              });
            });
          } else {
            // titan already exists
            res.sendStatus(403);
          }
        },
      );
    }
  });
});

module.exports = router;
