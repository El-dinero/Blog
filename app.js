const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const staticAsset = require("static-asset");
const mongoose = require("mongoose");
const session = require("express-session");

const MongoStore = require("connect-mongo")(session);
const config = require("./config");
//EXPRESS
const app = express();

//database
mongoose.Promise = global.Promise;
mongoose.set("debug", config.IS_PRODUCTION);
mongoose.set("useCreateIndex", true);
mongoose.connection
  .on("error", (error) => console.log(error))
  .on("close", () => console.log("Database connection..."))
  .once("open", () => {
    const info = mongoose.connections[0];
    console.log(
      `Connected to Host:${info.host}:${info.port}/${info.name}`
    );
    //Autopost + 10
    // require("./mocks")();
    //Listen Express
    app.listen(config.PORT, () => {
      console.log(`Server started on port ${config.PORT}!`);
    });
  });
mongoose.connect(config.MONGO_URL, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

// sessions
app.use(
  session({
    secret: config.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }),
  })
);

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

//routes
app.use("/", require("./routes/index"));
app.use("/api/auth", require("./routes/auth"));
app.use("/post", require("./routes/post"));
app.use("/users", require("./routes/user"));

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
