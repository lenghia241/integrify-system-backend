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

//[Testing] - Reset today as default 
const resetToday = (today) => {
	const { attendanceData, } = today;
	attendanceData.forEach(student => {
		student.timesStamp = {
			timeIn: "",
			timeOut: "",
		}
	});
}

//List today's date & all students' current presence 
const checkStatusToday = (today) => {
	const { attendanceData, } = today;
	const attendanceList = attendanceData.map(student => {
		const {timeIn, timeOut} = student && student.timesStamp;
		return {
			studentId: student.studentId,
			presence: !!(timeIn && !timeOut),
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
	
	const {timeIn, timeOut} = student.timesStamp;
	const todayStatus = assessTimesStampStatus(student.timesStamp);
	const presence = !!(timeIn && !timeOut);

	return {		
		date,
		...student,
		...todayStatus,	
		presence
	};
}

const assessTimesStampStatus = (timesStamp) => {
	const {timeIn, timeOut} = timesStamp;
	let todayStatus;
	if(timeIn && !timeOut) {	
		todayStatus = {
			late: timeIn > CHECK_IN_TIME ? true : false,
		}
	} else if(timeOut) {
		todayStatus = {
			late: timeIn > CHECK_IN_TIME ? true : false,
			leftEarly: timeOut < CHECK_OUT_TIME ? true : false,
		}
	}
	return todayStatus;
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
		};
		const currentStatus = assessTimesStampStatus(student.timesStamp);
		currentStudentStatus = {
			...student,
			...currentStatus,
			presence: false
		}
	} else {
		student.timesStamp = {
			...student.timesStamp,
			timeIn: time,
		};
		const currentStatus = assessTimesStampStatus(student.timesStamp);
		currentStudentStatus = {
			...student,
			...currentStatus,
			presence: true
		}
	}
	return currentStudentStatus;
}

const assessHistoryStatus = (history) => {
	return history.map(day => {
		const attendanceList = day.attendanceData.map(student => {
			let attendance;
			const status = assessTimesStampStatus(student.timesStamp);
			if(!status){
				attendance = ABSENT;
			} else {
				const {late, leftEarly} = status;
				attendance = (!late && !leftEarly && leftEarly !== undefined) ? FULL : PARTIAL;
			}
			return {
				...student,
				...status,
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