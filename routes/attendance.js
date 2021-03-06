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

const resetToday = (today) => {
	const { attendanceData, } = today;
	attendanceData.forEach(student => {
		student.timesStamp = {
			timeIn: "",
			timeOut: "",
			late: true,
			leftEarly: true,
		}
	});
}

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
	const student = isStudent(attendanceData, id);

	if(!student) {
		return {
			msg: "Student is not found",
		}
	}
	
	const presence = (student.timesStamp.timeIn === "" || student.timesStamp.timeOut !== "") ? false : true;

	return {		
		date,
		...student,	
		presence
	};
}

const updateStudentTodayStatus = (today, reqStudent) => {
	const {id, time} = reqStudent;
	const {attendanceData} = today;
	const student = isStudent(attendanceData, id);
	if(!student) {
		return {
			msg: "Student is not found",
		}
	}

	let currentStudentStatus;
	if (student.timesStamp.timeIn !== "") {
		student.timesStamp = {
			...student.timesStamp,
			timeOut: time,
			leftEarly: time < CHECK_OUT_TIME ? true : false,
		};
		currentStudentStatus = {
			...student,
			presence: false
		}
	} else {
		student.timesStamp = {
			...student.timesStamp,
			timeIn: time,
			late: time > CHECK_IN_TIME ? true : false,
		};
		currentStudentStatus = {
			...student,
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

router.put("/today/reset", (req, res) => {
	resetToday(history[0]);
	res.json(history[0]);
})

router.get("/today/:studentId", (req, res) => {
	const { studentId, } = req.params;
	const student = checkStatusTodayById(history[0], studentId);
	res.send(student);
});

router.get("/history", (req, res) => {
	const history_data = assessHistoryStatus(history.slice(1));
	res.send(history_data);
});

router.put("/today/:studentId", (req, res) => {
	const reqStudent = {
		id: req.params.studentId, //ObjectId of student
		time: moment().utcOffset("+03:00").format("HH:mm:ss"), //default
	};

	// Check attendance
	let currentStudentStatus = updateStudentTodayStatus(history[0], reqStudent);

	res.send(currentStudentStatus);
});

module.exports = router;