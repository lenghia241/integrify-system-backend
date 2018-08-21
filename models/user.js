const mongoose = require("mongoose");
const Schema = mongoose.Schema;

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
	accepted: {
		type: Boolean,
		required: true,
		index: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

userSchema.index({ views: -1, });

module.exports = mongoose.model("User", userSchema);
