const Validator = require("validator");

module.exports = data => {
	let { firstname, lastname, email, } = data;
	const errors = {
		firstname: !firstname ? "First name is required" : "",
		lastname: !lastname ? "Last name is required" : "",
		email: !email ? "Email address is required" : "",
	};
	if (!errors.firstname) {
		errors.firstname = !Validator.isLength(firstname, { min: 2, max: 20, })
			? "First name must be between 2 and 20 characters"
			: "";
	}
	if (!errors.lastname) {
		errors.lastname = !Validator.isLength(lastname, { min: 2, max: 20, })
			? "Last name must be between 2 and 20 characters"
			: "";
	}
	if (!errors.email) {
		errors.email = !Validator.isEmail(email) ? "Email is invalid" : "";
	}

	return {
		errors,
		isValid: Object.values(errors).every(val => !val),
	};
};
