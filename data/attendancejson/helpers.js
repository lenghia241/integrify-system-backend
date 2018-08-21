const constants = require("./constants");

module.exports = {
	checkStatusToday: function (today) {
		const { attendance_data, } = today;
		const att_list = attendance_data.map(stud => {
			return {
				name: stud.name,
				presence: stud.times_stamp.time_in === "" ? false : stud.presence,
			};
		});

		return {
			date: today.date,
			attendance_data: att_list,
		}
	},
	checkStatusTodayById: function (today, id) {
		const { attendance_data, } = today;
		const att_stud = attendance_data.filter(stud => stud.name === id)[0];
		let presence = (att_stud.times_stamp.time_in === "" || att_stud.times_stamp.time_out !== "") ? false : true;

		return {
			date: today.date,
			...att_stud,
			presence
		};
	},
	assessTodayStatus: function (student, time_now) {
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
	assessHistoryStatus: function(history) {
		return history.map(day => {
			const att_data = day.attendance_data.map(att => {
				let attendance;
				if(!att.times_stamp.late && !att.times_stamp.left_early){
					attendance = constants.FULL;
				} else {
					if(att.times_stamp.time_in === "") {
						attendance = constants.ABSENT;
					} else {
						attendance = constants.PARTIAL;
					}
				}
				return {
					...att,
					attendance
				}
			})
			return {
				...day,
				attendance_data: att_data,
			}
		} 
	)}
};