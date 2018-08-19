const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const persistentUserSchema = new Schema({
	user: {
		type: Schema.Types.ObjectId,
		ref: "tempUsers",
	},
	password: {
		type: String,
		required: true,
	},
	roles: {
		type: String,
		required: true,
	},
	date: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model("persistentUsers", persistentUserSchema);
