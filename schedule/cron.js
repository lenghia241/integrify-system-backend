const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const moment = require("moment");

const rule = "0 0 0 * * *";
const attendance = schedule.scheduleJob(rule, function() {
	const history = JSON.parse(
		fs.readFileSync(
			path.join(`${__dirname}/../data/attendancejson/history.json`)
		)
	);
	const date = moment().format("YYYY-MM-DD");
	const today = {
		date: date,
		attendanceData: [
			{
				studentId: "5b7ab1957c9b3c63007d5c8c",
				timesStamp: {
					timeIn: "",
					timeOut: "",
					late: false,
					leftEarly: false,
				},
			},
			{
				studentId: "5b7ab1952cc5b5a552cfda72",
				timesStamp: {
					timeIn: "",
					timeOut: "",
					late: false,
					leftEarly: false,
				},
			},
			{
				studentId: "5b7ab1953129baf45fac3a05",
				timesStamp: {
					timeIn: "",
					timeOut: "",
					late: false,
					leftEarly: false,
				},
			},
			{
				studentId: "5b7ab195f176fd2767d3a954",
				timesStamp: {
					timeIn: "",
					timeOut: "",
					late: false,
					leftEarly: false,
				},
			},
		],
	};

	history.unshift(today);
	console.log("Day is changing, appending today to history.");
	fs.writeFileSync(
		path.join(`${__dirname}/../data/attendancejson/history.json`), JSON.stringify(history, undefined, 2)
	);

});

module.exports = attendance;
