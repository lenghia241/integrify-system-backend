const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const experienceSchema = new Schema({
	title: String,
	company: String,
	location: String,
	startTime: String,
	endTime: String,
	current: Boolean,
	details: String,
});

const educationSchema = new Schema({
	school: String,
	degree: String,
	studyField: String,
	startTime: String,
	endTime: String,
	current: Boolean,
	details: String,
});

const projectSchema = new Schema({
	title: String,
	status: Boolean,
	githubLink: String,
});
const profileSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "users",
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
	projects: [projectSchema,],
	experiences: [experienceSchema,],
	educations: [educationSchema,],
	created_date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("Profiles", profileSchema);
