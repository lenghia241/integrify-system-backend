const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const assignmentSchema = new Schema({
	date: {
		type: Date,
	},
	dueDate: {
		type: Date,
	},
	titleOfAssignment: {
		type: String,
	},
	description: {
		type: String,
	},
	githubLink: {
		type: String,
	},
	submitted: {
		type: Boolean,
	},
});
const eventSchema = new Schema({
	title: {
		type: String,
	},
	description: {
		type: String,
	},
	venue: {
		address: {
			type: String,
		},
		zip: {
			type: String,
		},
		name: {
			type: String,
		},
		state: {
			type: String,
		},
		city: {
			type: String,
		},
		country: {
			type: String,
		},
	},
	eventUrl: {
		type: String,
	},
	time: {
		type: String,
	},
	status: {
		type: String,
	},
});
const studysyncSchema = {
	firstName: {
		type: String,
	},
	lastName: {
		type: String,
	},
	date: {
		type: Date,
	},
	title: {
		type: String,
	},
	description: {
		type: String,
	},
};
const dashboardSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: [{ type: Schema.Types.ObjectId, ref: "User", },],
	assignments: [assignmentSchema,],
	events: [eventSchema,],
	studysync: [studysyncSchema,],
});

module.exports.DashBoard = mongoose.model("Dashboard", dashboardSchema);
module.exports.Assignments = mongoose.model("Assignments", assignmentSchema);
module.exports.Events = mongoose.model("Events", eventSchema);
module.exports.Studysync = mongoose.model("Studysync", studysyncSchema);