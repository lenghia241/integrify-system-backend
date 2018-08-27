const validator = require("validator");

module.exports = data => {
	let { firstName, lastName, email, } = data;
	const errors = {
		firstName: !firstName ? "First name is required" : "",
		lastName: !lastName ? "Last name is required" : "",
		email: !email ? "Email address is required" : "",
	};
	if (!errors.firstName) {
		errors.firstName = !validator.isLength(firstName, { min: 2, max: 20, })
			? "First name must be between 2 and 20 characters"
			: "";
	}
	if (!errors.firstName) {
		errors.firstName = /\d/g.test(firstName)
			? "First name cannot contain number"
			: "";
	}
	if (!errors.lastName) {
		errors.lastName = !validator.isLength(lastName, { min: 2, max: 20, })
			? "Last name must be between 2 and 20 characters"
			: "";
	}
	if (!errors.lastName) {
		errors.lastName = /\d/g.test(lastName)
			? "Last name cannot contain number"
			: "";
	}
	if (!errors.email) {
		errors.email = !validator.isEmail(email) ? "Email is invalid" : "";
	}

	return {
		errors,
		isValid: Object.values(errors).every(val => !val),
	};
};
