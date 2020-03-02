const mongoose = require("mongoose");

module.exports = () => {
  mongoose.connect(
    process.env.DB_CONNECTION,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      dbName: process.env.DB_NAME,
    },
    () => {
      console.log("connected to db");
    },
  );
};
