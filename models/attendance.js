const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const timeStampSchema = new Schema({
	timeIn: Date,
	timeOut: Date,
});

const attendanceSchema = new Schema({
	date: {
		type: Date,
		default: Date.now, //new Date("<YYYY-mm-dd>")
	},
	attendanceData: [
		{
			studentId: { type: Schema.Types.ObjectId, ref: "User", },
			timeStamp: timeStampSchema,
		},
	],
});

module.exports = mongoose.model("Attendance", attendanceSchema);
