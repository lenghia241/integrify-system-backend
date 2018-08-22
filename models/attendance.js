const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeStampSchema = new Schema({
	time_in: Date,
	time_out: Date,
	late: Boolean,
	left_early: Boolean,
});

const attendanceSchema = new Schema({
	date: {
		type: Date,
		default: Date.now,
	},
	attendance_data: [
		{
			name: { type: Schema.Types.ObjectId, ref: "User", },
			time_stamps: timeStampSchema,
		},
	],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
