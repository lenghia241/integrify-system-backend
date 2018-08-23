const fs = require("fs");
const path = require("path");
const schedule = require("node-schedule");
const moment = require("moment");
const holidays = require("finnish-holidays-js");

const rule = "0 0 0 * * 1-5"; //00:00:00 every mon-fri
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
				timeStamp: {
					timeIn: "",
					timeOut: "",
				},
			},
			{
				studentId: "5b7ab1952cc5b5a552cfda72",
				timeStamp: {
					timeIn: "",
					timeOut: "",
				},
			},
			{
				studentId: "5b7ab1953129baf45fac3a05",
				timeStamp: {
					timeIn: "",
					timeOut: "",
				},
			},
			{
				studentId: "5b7ab195f176fd2767d3a954",
				timeStamp: {
					timeIn: "",
					timeOut: "",
				},
			},
		],
	};

	const holiday = holidays.next()[0];
	const {year, month, day,} = holiday;
	const holidayDate = `${year}-${month}-${day}`;

	if(date !== holidayDate) {
		history.unshift(today);
		console.log("Day is changing, appending today to history.");
		fs.writeFileSync(
			path.join(`${__dirname}/../data/attendancejson/history.json`), JSON.stringify(history, undefined, 2)
		);
	}

});

module.exports = attendance;
