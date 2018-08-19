module.exports = data => {
	let { id, password, password2, } = data;
	const errors = {
		id: !id ? "User ID is required" : "",
		password: !password ? "Password is required" : "",
		password2: !password2 ? "Password confirmation is required" : "",
	};
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
