const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dashboardSchema = new Schema({
	_id: Schema.Types.ObjectId,
	user_id: [{ type: Schema.Types.ObjectId, ref: "User", },],
	user_fullname: String, //more fields can be denormalized if needed
});

module.exports = mongoose.model("Dashboard", dashboardSchema);
