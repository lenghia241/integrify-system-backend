const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
	firstName: {
		type: String,
		required: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
		index: true,
	},
	password: {
		type: String,
		required: true,
	},
	accepted: {
		type: Boolean,
		required: true,
		default: false,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

userSchema.index({ views: -1, });

module.exports = mongoose.model("User", userSchema);
