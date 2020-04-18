const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const staticAsset = require("static-asset");
const mongoose = require("mongoose");
const config = require("./config");

//database
mongoose.Promise = global.Promise;
mongoose.set("debug", config.IS_PRODUCTION);
mongoose.connection
  .on("error", (error) => console.log(error))
  .on("close", () => console.log("Database connection..."))
  .once("open", () => {
    const info = mongoose.connections[0];
    console.log(
      `Connected to Host:${info.host} to:${info.port} MyDB:${info.name}`
    );
  });
mongoose.connect(config.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});
//EXPRESS
const app = express();

//status and uses
app.set("view engine", "ejs");
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(staticAsset(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "pablic")));
app.use("/css", express.static(__dirname + "/node_modules/bootstrap/dist/css"));
app.use(
  "/javascripts",
  express.static(path.join(__dirname, "node_modules", "jquery", "dist"))
);

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.render("error", {
    message: error.message,
    error: !config.IS_PRODUCTION ? error : {},
  });
});

app.listen(config.PORT, () => {
  console.log(`Server started on port ${config.PORT}!`);
});
