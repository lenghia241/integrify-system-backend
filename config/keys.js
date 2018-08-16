const credentials = require("./credentials");

if (process.env.NODE_ENV === "production") {
	module.exports = `mongodb+srv://${credentials}@cluster0-lukex.mongodb.net/integrify-prod`;
} else {
	module.exports = `mongodb+srv://${credentials}@cluster0-lukex.mongodb.net/integrify-dev`;
}
