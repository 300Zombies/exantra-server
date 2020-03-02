const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const Titan = require("../models/altertitanSchema");
// why does sdk needs region for s3 bucket?
const s3 = new AWS.S3({ region: "us-west-2" });
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.get("/:content", (req, res) => {
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
      } else {
        // determine the upload content via url param
        const { content } = req.params;
        let ext;
        switch (content) {
          case "screenshot":
          case "selfie":
            ext = "jpg";
            break;
          case "video":
            ext = "mp4";
            break;
          default:
            res.send(400);
            return;
        }
        // access to the last workout session and update the url
        const session = titan.workoutSession;
        const lastOne = session.length - 1 < 0 ? 0 : session.length - 1;
        // prepare the strings
        const key = `${req.user._id}/${content}-${session[lastOne]._id}.${ext}`;
        const url = `https://exantra-image-storage.s3-us-west-2.amazonaws.com/${key}`;
        // prepare pre-signed post params
        const params = {
          // Expires in seconds
          Expires: 300,
          Bucket: "exantra-image-storage",
          Conditions: [["content-length-range", 1048576, 10485760]],
          Fields: {
            key: key,
          },
        };
        s3.createPresignedPost(params, function(err, data) {
          if (err) {
            console.error("Presigning post data encountered an error", err);
            res.sendStatus(500);
          } else {
            console.log("The post data is", data);
            res.send(data);
            session[lastOne][`${content}`] = url;
            titan.save((err, titan) => {
              if (err) throw err;
              console.log(titan.workoutSession[lastOne]);
            });
          }
        });
      }
    },
  );
  // console.log({
  //   msg: `you're in ${req.params.content} router`,
  //   httpmethod: req.method,
  //   baseUrl: req.baseUrl,
  //   originalUrl: req.originalUrl,
  //   params: req.params,
  // });
});

module.exports = router;
