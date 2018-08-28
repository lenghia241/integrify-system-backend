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
const profilesRouterV2 = require("./routes/profiles-v2");
const attendanceRouter = require("./routes/attendance");
const baseRouter = require("./routes/base");

const keys = require("./config/keys");
const attendance = require("./schedule/cron");

const app = express();
// cors setup
app.use(cors());

// mongoDB connection
mongoose.connect(
	keys.mongoURI,
	{ useNewUrlParser: true, }
);

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
app.use("/v2/profiles", profilesRouterV2);
app.use("/api/attendance", attendanceRouter);
app.use("/v1/attendance", attendanceRouter);
app.use("*", baseRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
	// set locals, only providing error in development
	// res.locals.message = err.message;
	// res.locals.error = req.app.get("env") === "development" ? err : {};
	if (res.headersSent) {
		next(err);
	}
	switch (err.constructor.name) {
		case "ValidationError":
			return res.status(422).json(err.message);
		case "ConflictError":
			return res.status(409).json({ msg: err.message, });
		case "NotFoundError":
			return res.status(404).json({ msg: err.message, });
		case "ForbiddenError":
			return res.status(403).json({ msg: err.message, });
		case "UnauthorizedError":
			return res.status(401).json({ msg: err.message, });
		case "InternalError":
			return res.status(500).json({ msg: err.message, });
		case "BadRequestError":
			return res.status(400).json({ msg: err.message, });
		default:
			return res.status(400).json({ msg: "Unknow errors", });
	}
});

module.exports = app;
