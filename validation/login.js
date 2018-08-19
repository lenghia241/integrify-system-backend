const Validator = require("validator");

module.exports = data => {
	let { email, password, } = data;
	const errors = {
		email: !email ? "Email is required" : "",
		password: !password ? "Password is required" : "",
	};
	if (!errors.email) {
		errors.email = !Validator.isEmail(email) ? "Email is invalid" : "";
	}
	return {
		errors,
		isValid: Object.values(errors).every(val => !val),
	};
};
