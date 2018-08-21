const constants = require("./constants");

module.exports = {
	checkStatusToday: function (today) {
		const { attendance_data, } = today;
		const current_status = attendance_data.map(stud => {
			return {
				name: stud.name,
				presence: stud.times_stamp.time_in === "" ? false : stud.presence,
			};
		});

		return {
			date: today.date,
			attendance_data: current_status,
		}
	},
	checkStatusTodayById: function (today, id) {
		const { attendance_data, } = today;
		const current_status = attendance_data.filter(stud => stud.name === id)[0];
		let presence = (current_status.times_stamp.time_in === "" || current_status.times_stamp.time_out !== "") ? false : true;

		return {
			date: today.date,
			...current_status,
			presence
		};
	},
	assessAttendanceStatus: function (student, time_now) {
		let current_status;
		if (student.times_stamp.time_in !== "") {
			student.times_stamp = {
				...student.times_stamp,
				time_out: time_now,
				left_early: time_now < constants.CHECK_OUT_TIME ? true : false,
			};
			current_status = {
				...student,
				presence: false
			}
		} else {
			student.times_stamp = {
				...student.times_stamp,
				time_in: time_now,
				late: time_now > constants.CHECK_IN_TIME ? true : false,
			};
			current_status = {
				...student,
				presence: true
			}
		}
		return current_status;
	},
};