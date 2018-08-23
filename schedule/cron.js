const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");

const rule = "0 0 * * *";
const attendance = schedule.scheduleJob(rule, function() {
	const history = JSON.parse(
		fs.readFileSync(
			path.join(`${__dirname}/../data/attendancejson/history.json`)
		)
	);
	const date = new Date().toJSON();
	const today = {
		date: date,
		attendance_data: [
			{
				name: "5b7ab1957c9b3c63007d5c8c",
				timesStamp: {
					time_in: "",
					time_out: "",
					late: false,
					left_early: false,
				},
			},
			{
				name: "5b7ab1952cc5b5a552cfda72",
				timesStamp: {
					time_in: "",
					time_out: "",
					late: false,
					left_early: false,
				},
			},
			{
				name: "5b7ab1953129baf45fac3a05",
				timesStamp: {
					time_in: "",
					time_out: "",
					late: false,
					left_early: false,
				},
			},
			{
				name: "5b7ab195f176fd2767d3a954",
				timesStamp: {
					time_in: "",
					time_out: "",
					late: false,
					left_early: false,
				},
			},
		],
	};

	history.unshift(today);
	console.log("Day is changing, appending today to history.");
	fs.writeFileSync(
		path.join(`${__dirname}/../data/attendancejson/history.json`), JSON.stringify(history)
	);

});

module.exports = attendance;
