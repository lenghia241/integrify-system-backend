const prod_mongoURI = require("./prod");
const dev_mongoURI = require("./dev");

if (process.env.NODE_ENV === "production") {
	module.exports = prod_mongoURI;
} else {
	module.exports = dev_mongoURI;
}
