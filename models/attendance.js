const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timesStampSchema = new Schema({
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
	attendanceData: [
		{
			studentId: { type: Schema.Types.ObjectId, ref: "User", },
			timesStamp: timesStampSchema,
		},
	],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
