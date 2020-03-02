const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
const loginRouter = require("./routes/login");
const rosterRouter = require("./routes/roster");
const bankRouter = require("./routes/bank");
const characterRouter = require("./routes/character");
const uploadRouter = require("./routes/upload");
const sessionRouter = require("./routes/session");
const traitsRouter = require("./routes/traits");
require("dotenv").config();
// db connection
require("./services/database")();
// middlewares
app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000, // cookie valid for 1 day
    keys: [process.env.COOKIE_SESSION_KEYS],
  }),
);
// make sure this line is always after cookieSession initiation
require("./services/authenticate")(app);
app.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
app.use(bodyParser.json());
// routes
app.use("/auth", loginRouter);
app.use("/altertitan", rosterRouter);
app.use("/altertitan/bank", bankRouter);
app.use("/altertitan/character", characterRouter);
app.use("/altertitan/session", sessionRouter);
app.use("/altertitan/upload", uploadRouter);
app.use("/altertitan/character/traits", traitsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}!`);
});
