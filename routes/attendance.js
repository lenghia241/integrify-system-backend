const express = require("express");
const router = express.Router();
const moment = require("moment");

const history = require("../data/attendancejson/history.json");
const helpers = require("../data/attendancejson/helpers");

router.get("/test/today", (req, res) => {
	res.send(history[0]);
});

router.get("/test/history", (req, res) => {
	res.send(history.slice(1));
});

router.get("/", (req, res) => {
	const currentListStatus = helpers.checkStatusToday(history[0]);
	res.json(currentListStatus);
});

router.get("/today/:studentId", (req, res) => {
	const { studentId, } = req.params;
	const attendanceStudent = helpers.checkStatusTodayById(history[0], studentId);
	res.send(attendanceStudent);
});

router.get("/history", (req, res) => {
	const history_data = helpers.assessHistoryStatus(history.slice(1));
	res.send(history_data);
});

router.put("/today/:studentId", (req, res) => {
	const reqStudent = {
		id: req.params.studentId, //ObjectId of student
		time: moment().format("HH:mm:ss"), //default
	};

	// Check attendance
	let currentStudentStatus = helpers.updateStudentTodayStatus(history[0], reqStudent);

	res.send(currentStudentStatus);
});

module.exports = router;