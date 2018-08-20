module.exports = {
	checkTodayInHistory: function (today, history) {
		return history.map(val => val.date.indexOf(today[0].date)).some(val => val !== -1);
	},
	refreshToday: function (foundIndex, today, to_date) {
		let today_tempt = [{ ...today[0] }]; //deep clone 
		if (foundIndex && (to_date > today_tempt[0].date)) {
			const { attendance_data, } = today_tempt[0];
			today_tempt[0]._id = "6b7876271dd189054044765d";
			today_tempt[0].date = to_date.toString();
			attendance_data.forEach(stud => {
				delete stud.timesStamp;
				delete stud.attendance;
				stud.presence = false;
			});
		}
		return today_tempt;
	},
	testingRefreshToday: function (today, to_date) {
		const { attendance_data, } = today[0];
		today[0]._id = "6b7876271dd189054044765d";
		today[0].date = to_date.toString();
		attendance_data.forEach(stud => {
			delete stud.timesStamp;
			delete stud.attendance;
			stud.presence = false;
		});
	},
	saveTodayInHistory: function (foundIndex, today, history, to_date) {
		if (!foundIndex && (to_date > today[0].date)) {
			const { attendance_data, } = today[0];
			//Processing data of today, unshift to history
			attendance_data.forEach(stud => {
				if (!stud.timesStamp) {
					stud.attendance = "absent";
				} else {
					if (stud.timesStamp.late || stud.timesStamp.left_early) {
						stud.attendance = "partial";
					} else {
						stud.attendance = "full";
					}
				}
				return stud;
			});

			history.unshift(today[0]);
			console.log('SAVE TODAY IN HISTORY');
		}
	},
	noOneCheckIn: function (today) {
		return today[0].attendance_data.filter(stud => stud.presence === true).length === 0;
	},
};