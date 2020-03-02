const passport = require("passport");
const GoogleAuthCodeStrategy = require("passport-google-authcode").Strategy;
const FacebookTokenStrategy = require("passport-facebook-token");
const User = require("../models/userSchema");

module.exports = (app) => {
  // passport middlewares
  app.use(passport.initialize());
  // plug cookieSession into passport AFTER cookieSession initiation (in app.js)
  app.use(passport.session());
  passport.serializeUser((user, done) => {
    done(null, user);
  });
  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  // Google APP config
  passport.use(
    new GoogleAuthCodeStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("google profile", profile);
        User.findOne(
          {
            googleId: profile.id,
          },
          (err, user) => {
            if (user === null) {
              user = new User({
                googleId: profile.id,
                email: profile.emails[0].value,
              });
              // TODO: change cookie content to userId and titanId
              user.save((err, savedUser) => {
                console.log("saved user", savedUser);
                return done(err, savedUser);
              });
            } else {
              console.log("user", user);
              return done(err, user);
            }
          },
        );
      },
    ),
  );

  // FB APP config
  passport.use(
    new FacebookTokenStrategy(
      {
        clientID: process.env.FB_CLIENT_ID,
        clientSecret: process.env.FB_CLIENT_SECRET,
        fbGraphVersion: "v3.0",
      },
      (accessToken, refreshToken, profile, done) => {
        console.log("fb profile", profile);
        User.findOne(
          {
            facebookId: profile.id,
          },
          (err, user) => {
            if (user === null) {
              user = new User({
                facebookId: profile.id,
                email: profile.emails[0].value,
              });
              user.save((err, savedUser) => {
                console.log("saved user", savedUser);
                return done(err, savedUser);
              });
            } else {
              console.log("user", user);
              return done(err, user);
            }
          },
        );
      },
    ),
  );
};
