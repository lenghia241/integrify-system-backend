const express = require("express");
const router = express.Router();

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
	res.send(history);
});

router.put("/today/:studentId", (req, res) => {
	const reqStud = {
		name: req.params.studentId, //ObjectId of student
		time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`, //default
	};

	// check attendance
	let studentStatus = { msg: "Student is not found", };
	const { attendance_data, } = history[0];
	attendance_data.forEach(stud => {
		if (stud.name === reqStud.name) {
			studentStatus = helpers.assessAttendanceStatus(stud, reqStud.time);
		}
	});

	res.send(studentStatus);
});

module.exports = router;