const express = require("express");
const router = express.Router();
// no need user validation in this api
// const User = require("../models/userSchema");
const Titan = require("../models/altertitanSchema");

router.get("/:currencies", (req, res) => {
  if (!req.user || !req.user._id) {
    res.sendStatus(401);
    return;
  }
  console.log("bank req.user", req.user);
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
        switch (req.params.currencies) {
          case "all":
            res.send(titan.currencies);
            break;
          case "token":
            res.send({
              token: titan.currencies.token,
            });
            break;
          case "shard":
            res.send({
              shard: titan.currencies.shard,
            });
            break;
          case "medal":
            res.send({
              medal: titan.currencies.medal,
            });
            break;
          case "augment":
            res.send({
              augment: titan.currencies.augment,
            });
            break;
          case "showmethemoney":
            Titan.findOne(
              {
                userId: req.user._id,
              },
              "currencies",
              async (err, titan) => {
                const { currencies } = titan;
                const bank = Object.keys(currencies);
                for (i = 1; i < Object.keys(currencies).length; i++) {
                  currencies[`${bank[i]}`] = 100000;
                }
                titan.save((err, titan) => {
                  console.log("show you the money");
                });
                res.send(currencies);
              },
            );
            break;
          default:
            res.sendStatus(404).send("currency not found");
        }
      }
    },
  );
});

// router.get("/showmethemoney", (req, res) => {
//   if (!req.user || !req.user._id) {
//     res.sendStatus(401);
//     return;
//   }
//   Titan.findOne(
//     {
//       // findById queries Titan model's _id instead of userId
//       userId: req.user._id,
//     },
//     "currencies",
//     // query in Titan schema will always return titan object
//     // no matter what filters are
//     async (err, titan) => {
//       const { currencies } = titan;
//       const bank = Object.keys(currencies);
//       for (i = 1; i < Object.keys(currencies).length; i++) {
//         currencies[`${bank[i]}`] = 100000;
//       }
//       titan.save((err, titan) => {
//         console.log("show you the money");
//       });
//       res.send(currencies);
//     },
//   );
//   // console.log({
//   //   // msg: `you're in ${req.params.test} router`,
//   //   httpmethod: req.method,
//   //   baseUrl: req.baseUrl,
//   //   originalUrl: req.originalUrl,
//   //   // params: req.params,
//   // });
// });

module.exports = router;
