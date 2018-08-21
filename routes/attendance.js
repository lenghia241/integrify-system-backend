const express = require("express");
const router = express.Router();
const moment = require("moment");

const history = require("../data/attendancejson/history.json");
const helpers = require("../data/attendancejson/helpers");

router.get("/", (req, res) => {
	const current_status = helpers.checkStatusToday(history[0]);
	res.json(current_status);
});


router.get("/today/:student_id", (req, res) => {
	const { student_id, } = req.params;
	const current_status = helpers.checkStatusTodayById(history[0], student_id);
	res.send(current_status);
});

router.get("/history", (req, res) => {
	const history_data = helpers.assessHistoryStatus(history.slice(1));
	res.send(history_data);
});

router.put("/today/:studentId", (req, res) => {
	const reqStud = {
		name: req.params.studentId, //ObjectId of student
		time: moment().format("HH:mm:ss"), //default
	};

	// check attendance
	let studentStatus = { msg: "Student is not found", };
	const { attendance_data, } = history[0];
	attendance_data.forEach(stud => {
		if (stud.name === reqStud.name) {
			studentStatus = helpers.assessTodayStatus(stud, reqStud.time);
		}
	});

	res.send(studentStatus);
});

module.exports = router;