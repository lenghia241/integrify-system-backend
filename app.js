const createError = require("http-errors");
const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const mongoose = require("mongoose");

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const dashboardRouter = require("./routes/dashboard");
const profilesRouter = require("./routes/profiles");
const baseRouter = require("./routes/base");

const keys = require("./config/keys");

const app = express();

// cors setup
app.use(cors());

// mongoDB connection
mongoose.connect(keys.mongoURI, { useNewUrlParser: true, });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
	console.log(`Connected to ${keys.mongoURI}`);
});

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false, }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/v1/dashboard", dashboardRouter);
app.use("/api/profiles", profilesRouter);
app.use("/v1/profiles", profilesRouter);
app.use("*", baseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
