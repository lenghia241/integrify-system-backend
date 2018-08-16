const credentials = require("./credentials");

if (process.env.NODE_ENV === "production") {
	module.exports = {
		mongoURI: `mongodb+srv://${credentials}@cluster0-lukex.mongodb.net/integrify-prod`,
	};
} else {
	module.exports = {
		mongoURI: `mongodb+srv://${credentials}@cluster0-lukex.mongodb.net/integrify-dev`,
	};
}
