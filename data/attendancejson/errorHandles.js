module.exports = {
	isStudent: function(attendanceData, personId) {
		return attendanceData.find(student => student.studentId === personId);
	},
};