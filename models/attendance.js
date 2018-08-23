const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeStampSchema = new Schema({
	timeIn: Date,
	timeOut: Date,
});

const attendanceSchema = new Schema({
	date: {
		type: new Date("<YYYY-mm-dd>"),
		default: Date.now,
	},
	attendance_data: [
		{
			studentId: { type: Schema.Types.ObjectId, ref: "User", },
			timesStamp: timeStampSchema,
		},
	],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
