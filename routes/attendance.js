const express = require("express");
const router = express.Router();
const moment = require("moment");
//mockup json file
const history = require("../data/attendancejson/history.json");
//constants
const CHECK_IN_TIME = "10:00:00";
const CHECK_OUT_TIME = "17:00:00";
const FULL = "full";
const PARTIAL = "partial";
const ABSENT= "absent";

//error handler
const isStudent = (attendanceData, personId) => {
	return attendanceData.find(student => student.studentId === personId);
};

const checkStatusToday = (today) => {
	const { attendanceData, } = today;
	const attendanceList = attendanceData.map(student => {
		return {
			studentId: student.studentId,
			presence: (student.timesStamp.timeIn === "" || student.timesStamp.timeOut !== "") ? false : true,
		};
	});

	return {
		date: today.date,
		attendanceData: attendanceList,
	}
}

const checkStatusTodayById = (today, id) => {
	const { attendanceData, date} = today;
	const studentOrNot = isStudent(attendanceData, id);

	if(!studentOrNot) {
		return {
			msg: "Student is not found",
		}
	}
	const attendanceStudent = studentOrNot;		
	const presence = (attendanceStudent.timesStamp.timeIn === "" || attendanceStudent.timesStamp.timeOut !== "") ? false : true;

	return {		
		date,
		...attendanceStudent,	
		presence
	};
}

const updateStudentTodayStatus = (today, reqStudent) => {
	const {id, time} = reqStudent;
	const {attendanceData} = today;
	const studentOrNot = isStudent(attendanceData, id);
	if(!studentOrNot) {
		return {
			msg: "Student is not found",
		}
	}

	let currentStudentStatus;
	if (studentOrNot.timesStamp.timeIn !== "") {
		studentOrNot.timesStamp = {
			...studentOrNot.timesStamp,
			timeOut: time,
			leftEarly: time < CHECK_OUT_TIME ? true : false,
		};
		currentStudentStatus = {
			...studentOrNot,
			presence: false
		}
	} else {
		studentOrNot.timesStamp = {
			...studentOrNot.timesStamp,
			timeIn: time,
			late: time > CHECK_IN_TIME ? true : false,
		};
		currentStudentStatus = {
			...studentOrNot,
			presence: true
		}
	}
	return currentStudentStatus;
}

const assessHistoryStatus = (history) => {
	return history.map(day => {
		const attendanceList = day.attendanceData.map(student => {
			let attendance;
			if(!student.timesStamp.late && !student.timesStamp.leftEarly){
				attendance = FULL;
			} else {
				if(student.timesStamp.timeIn === "") {
					attendance = ABSENT;
				} else {
					attendance = PARTIAL;
				}
			}
			return {
				...student,
				attendance
			}
		})
		return {
			...day,
			attendanceData: attendanceList,
		}
	} 
)}

//ROUTING 
router.get("/test/today", (req, res) => {
	res.send(history[0]);
});

router.get("/test/history", (req, res) => {
	res.send(history.slice(1));
});

router.get("/", (req, res) => {
	const currentListStatus = checkStatusToday(history[0]);
	res.json(currentListStatus);
});

router.get("/today/:studentId", (req, res) => {
	const { studentId, } = req.params;
	const attendanceStudent = checkStatusTodayById(history[0], studentId);
	res.send(attendanceStudent);
});

router.get("/history", (req, res) => {
	const history_data = assessHistoryStatus(history.slice(1));
	res.send(history_data);
});

router.put("/today/:studentId", (req, res) => {
	const reqStudent = {
		id: req.params.studentId, //ObjectId of student
		time: moment().format("HH:mm:ss"), //default
	};

	// Check attendance
	let currentStudentStatus = updateStudentTodayStatus(history[0], reqStudent);

	res.send(currentStudentStatus);
});

module.exports = router;