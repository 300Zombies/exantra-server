const express = require("express");
const router = express.Router();
const Titan = require("../models/altertitanSchema");

router.get("/start", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  const start = Date.now();
  Titan.findOne(
    {
      // findById queries Titan model's _id instead of userId
      userId: req.user._id,
    },
    "workoutSession",
    (err, titan) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (titan === null) {
        res.sendStatus(401);
        return;
      }
      // get access to last element of session array
      // function getCurr(param) {
      //   const curr = param - 1 < 0 ? 0 : param - 1;
      //   return curr;
      // }
      const session = titan.workoutSession;
      const curr = session.length - 1 < 0 ? 0 : session.length - 1;
      // user trying to create new session without closing last one
      if (!session[curr] || !session[curr].length) {
        // delete last one
        session.pop();
      }
      // create a workout session
      session.push({
        start: start,
      });
      // the following code is for reset session array
      // titan.workoutSession = [];
      // TODO: change callback to promise
      titan.save((err, titan) => {
        if (err) throw err;
        console.log(titan.workoutSession.length);
        console.log("session start");
        res.sendStatus(200);
      });
    },
  );
});
// client send session length in milliseconds
// server record Date.now() as session end when this api is called
// calculate session length using end minus start
// compare the lengths of server and client
// client length should always shorter than server length
// record valid length in milliseconds
router.post("/end", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  Titan.findOne(
    {
      // findById queries Titan model's _id instead of userId
      userId: req.user._id,
    },
    "workoutSession workoutStreak timezone",
    (err, titan) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (titan === null) {
        res.sendStatus(401);
        return;
      }
      const session = titan.workoutSession;
      const timezone = titan.timezone;
      const hour = 60 * 60 * 1000;
      const curr = session.length - 1 < 0 ? 0 : session.length - 1;
      const prev = curr - 1;
      // session[curr] will be undefined if there is no session at all
      // prevent direct api call (if session[curr] === undefined)
      // if (there's no session at all || session closed start new one)
      // if (!session[curr] || session[curr].length) {
      //   res.sendStatus(403);
      //   return;
      // }
      // check if daily reward reset or not
      let utc;
      switch (timezone) {
        case 0:
          utc = -5;
          break;
        case 1:
          utc = -6;
          break;
        case 2:
          utc = -7;
          break;
        case 3:
          utc = -8;
          break;
        case 4:
          utc = -9;
          break;
        case 5:
          utc = -10;
          break;
        default:
          res.sendStatus(400);
          return;
      }
      const tzOffset = utc * hour;
      console.log("hour in milliseconds", hour);
      console.log("curr session start", session[curr].start);
      console.log("prev session start", session[prev].start);
      console.log("tzOffset", tzOffset);
      // if (there's no prev session || it's a brand new day )
      // above statement have problems if user workout on same day next week
      // do timezone convertion and reset slot machine at 00:00
      let lastTime = new Date(session[prev].start + tzOffset);
      let thisTime = new Date(session[curr].start + tzOffset);
      console.log(thisTime > lastTime);
      lastTime = {
        date: lastTime.getDate(),
        month: lastTime.getMonth(),
        year: lastTime.getFullYear(),
      };
      thisTime = {
        date: thisTime.getDate(),
        month: thisTime.getMonth(),
        year: thisTime.getFullYear(),
      };
      const yyyy = lastTime.year === thisTime.year ? true : false;
      const mm = lastTime.month === thisTime.month ? true : false;
      const dd = lastTime.date === thisTime.date ? true : false;
      // const slotMachineReset;
      if (!session[prev] || yyyy || mm || dd) {
        // either user is doing the first workout or the daily reward resets
        // do slot machine in here
      }
      // do regular reward for the workout
      // combine slot machine and regular rewards
      // save in db and send to front-end
      /*
      const sessionEnd = Date.now();
      const clientLength = req.body.sessionLength;
      const serverLength = sessionEnd - session[curr].start;
      const validLength =
        clientLength > serverLength ? serverLength : clientLength;
      const { type, notes } = req.body;
      if (type < 0 || type > 8) {
        type = 8;
      }
      // url was saved in uploads api
      session[curr].length = validLength;
      session[curr].type = type;
      session[curr].notes = notes;
      titan.save((err, titan) => {
        if (err) throw err;
        console.log(titan.workoutSession.length);
        console.log("session end");
        res.sendStatus(200);
      });
      */
      res.send("haha");
    },
  );
});

// for developing purpose
router.get("/clear", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  Titan.findOne(
    {
      // findById queries Titan model's _id instead of userId
      userId: req.user._id,
    },
    "workoutSession",
    (err, titan) => {
      if (err) {
        res.sendStatus(500);
        return;
      }
      if (titan === null) {
        res.sendStatus(401);
        return;
      }
      titan.workoutSession = [];
      titan.save((err, titan) => {
        if (err) throw err;
        console.log("session cleared", titan.workoutSession);
        res.sendStatus(200);
      });
    },
  );
  console.log({
    msg: `you're in ${req.params} router`,
    httpmethod: req.method,
    baseUrl: req.baseUrl,
    originalUrl: req.originalUrl,
    params: req.params,
  });
});

module.exports = router;
