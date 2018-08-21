const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workSchema = new Schema({
	title: String,
	company: String,
	location: String,
	start_time: String,
	end_time: String,
	details: String,
});

const educationSchema = new Schema({
	school: String,
	degree: String,
	study_field: String,
	start_time: String,
	end_time: String,
	details: String,
});

const assignmentSchema = new Schema({
	title: String,
	status: Boolean,
	github_link: String,
});
const userSchema = new Schema({
	firstname: {
		type: String,
		required: true,
	},
	lastname: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
	},
	role: {
		type: String,
		required: true,
	},
	batch: {
		type: String,
		required: true,
	},
	bio: String,
	competencies: [String,],
	skills: [String,],
	github: String,
	linkedin: String,
	education: [educationSchema,],
	experience: [workSchema,],
	example_of_work: [assignmentSchema,],
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Users", userSchema);
