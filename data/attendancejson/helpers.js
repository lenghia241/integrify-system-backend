const constants = require("./constants");
const errorHandles = require('./errorHandles')

module.exports = {
	checkStatusToday: function (today) {
		const { attendanceData, } = today;
		const attendanceList = attendanceData.map(student => {
			return {
				studentId: student.studentId,
				presence: student.timesStamp.timeIn === "" ? false : student.presence,
			};
		});

		return {
			date: today.date,
			attendanceData: attendanceList,
		}
	},
	checkStatusTodayById: function (today, id) {
		const { attendanceData, date} = today;
		const studentOrNot = errorHandles.isStudent(attendanceData, id);

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
	},
	updateStudentTodayStatus: function (today, reqStudent) {
		const {id, time} = reqStudent;
		const {attendanceData} = today;
		const studentOrNot = errorHandles.isStudent(attendanceData, id);
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
				leftEarly: time < constants.CHECK_OUT_TIME ? true : false,
			};
			currentStudentStatus = {
				...studentOrNot,
				presence: false
			}
		} else {
			studentOrNot.timesStamp = {
				...studentOrNot.timesStamp,
				timeIn: time,
				late: time > constants.CHECK_IN_TIME ? true : false,
			};
			currentStudentStatus = {
				...studentOrNot,
				presence: true
			}
		}
		return currentStudentStatus;
	},
	assessHistoryStatus: function(history) {
		return history.map(day => {
			const attendanceList = day.attendanceData.map(student => {
				let attendance;
				if(!student.timesStamp.late && !student.timesStamp.leftEarly){
					attendance = constants.FULL;
				} else {
					if(student.timesStamp.timeIn === "") {
						attendance = constants.ABSENT;
					} else {
						attendance = constants.PARTIAL;
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
};