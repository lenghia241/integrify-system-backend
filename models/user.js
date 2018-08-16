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

const userSchema = new Schema({
	_id: Schema.Types.ObjectId,
	email: String,
	password: String,
	fullname: String,
	roles: String,
	bio: String,
	competencies: [String,],
	technologies: [String,],
	github_url: String,
	linkedin_url: String,
	education: [educationSchema,],
	work_experience: [workSchema,],
});

module.exports = mongoose.model("User", userSchema);
