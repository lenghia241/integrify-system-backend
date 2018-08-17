const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeStampSchema = new Schema({
	checkIn: Date,
	checkOut: Date,
});

const attendanceSchema = new Schema({
	_id: Schema.Types.ObjectId,
	date: Date,
	attendance_data: [
		{
			name: { type: Schema.Types.ObjectId, ref: "User", },
			timestamps: [timeStampSchema,],
		},
	],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
