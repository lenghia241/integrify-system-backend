const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeStampSchema = new Schema({
	timeIn: Date,
	timeOut: Date,
	late: Boolean,
	leftEarly: Boolean,
});

const attendanceSchema = new Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	attendance_data: [
		{
			studentId: { type: Schema.Types.ObjectId, ref: "User", },
			timeStamps: timeStampSchema,
		},
	],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
