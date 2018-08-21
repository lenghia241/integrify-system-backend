const validator = require("validator");

module.exports = data => {
	let { email, password, password2, } = data;
	const errors = {
		email: !email ? "Email is required" : "",
		password: !password ? "Password is required" : "",
		password2: !password2 ? "Password confirmation is required" : "",
	};
	if (!errors.email) {
		errors.email = !validator.isEmail(email) ? "Email is invalid" : "";
	}
	const regex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/g;
	if (!errors.password) {
		errors.password = !regex.test(password)
			? "Password must be at least 8 characters in length, in which contain at least 1 number, 1 capitalized character and 1 symbol"
			: "";
	}
	if (!errors.password) {
		errors.password2 =
			password !== password2 ? "Password confirm must match" : "";
	}
	return {
		errors,
		isValid: Object.values(errors).every(val => !val),
	};
};
