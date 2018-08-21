const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const moment = require("moment");

const rule = "*/30 * * * *";
const attendence = schedule.scheduleJob(rule, function() {
	const history = JSON.parse(
		fs.readFileSync(
			path.join(`${__dirname}/../data/attendencejson/history.json`)
		)
	);
	const date = moment().format("MMM Do YY");
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
	fs.writeFileSync(
		path.join(`${__dirname}/../data/attendencejson/history.json`), JSON.stringify(history, undefined, 2)
	);

});

module.exports = attendence;
