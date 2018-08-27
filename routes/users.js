const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const credentials = require("../config/credentials");
const User = require("../models/user");
const Attendance = require("../models/attendance");
const Profile = require("../models/profile");
const { check, validationResult, } = require("express-validator/check");
const CustomError = require("custom-error-instance");
const InternalError = CustomError("InternalError", {
	message: "Internal error",
});
const ValidationError = CustomError("ValidationError", {
	message: "Wrong input data",
});
const ConflictError = CustomError("ConflictError", {
	message: "Conflict error",
});
const NotFoundError = CustomError("NotFoundError", {
	message: "Not found error",
});
const ForbiddenError = CustomError("ForbiddenError", {
	message: "Forbidden error",
});
const UnauthorizedError = CustomError("UnauthorizedError", {
	message: "Unauthorized error",
});
const BadRequestError = CustomError("BadRequestError", {
	message: "Bad request error",
});
let e;

/* GET test api */
router.get("/", function(req, res) {
	res.send("respond with a resource");
});

//POST register for tempUser
router.post(
	"/signup/temp",
	[
		check("firstName")
			.exists({ checkFalsy: true, })
			.withMessage("First name is required")
			.isLength({ min: 2, max: 20, })
			.withMessage("First name must be between 2 and 20 characters")
			.not()
			.matches("[0-9]")
			.withMessage("First name cannot contain number"),
		check("lastName")
			.not()
			.isEmpty()
			.withMessage("Last name is required")
			.isLength({ min: 2, max: 20, })
			.withMessage("Last name must be between 2 and 20 characters")
			.not()
			.matches("[0-9]")
			.withMessage("Last name cannot contain number"),
		check("email")
			.not()
			.isEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Email is invalid"),
	],
	(req, res, next) => {
		const errors = validationResult(req).formatWith(({ msg, param, }) => ({
			[param]: msg,
		}));
		if (!errors.isEmpty()) {
			e = ValidationError({message: errors.array(),});
			return next(e);
		}
		const { firstName, lastName, email, } = req.body;
		User.findOne({ email, }).then(user => {
			if (user) {
				if (user.accepted) {
					if (user.password === "not generated") {
						e = ConflictError({message: "You have registered. An email verification has been sent to your email",});
						return next(e);
					}
					e = ConflictError({message: "You have already register with a password. Please go to login page to use the service",});
					return next(e);
				}
				e = BadRequestError({message: "Your sign-up request has not either been approved or declined by the admin. Please wait!",});
				return next(e);
			}
			const newUser = new User({
				firstName,
				lastName,
				email,
				password: "not generated",
			});
			newUser
				.save()
				.then(user => res.json(user))
				.catch(() => {
					e = InternalError();
					return next(e);
				});
		});
	}
);

//GET all tempUsers
router.get("/signup/temp", (req, res, next) => {
	User.find({ accepted: false, })
		.sort({ date: -1, })
		.then(users => res.json(users))
		.catch(() => {
			e = NotFoundError({message: "No sign-up request found",});
			return next(e);
		});
});

//DELETE tempUser declined by admin
router.delete("/signup/temp/:id", (req, res, next) => {
	const { id, } = req.params;
	User.findByIdAndRemove(id)
		.then(() => res.json({ msg: "User has been removed successfully", }))
		.catch(() => {
			e = NotFoundError({message: "No temporary user with that id found",});
			return next(e);
		});
});

//POST send email verification to tempUser accepted by admin
router.post(
	"/signup/temp/:id",
	[
		check("role")
			.exists({ checkFalsy: true, })
			.withMessage("Role is required"),
		check("batch")
			.exists({ checkFalsy: true, })
			.withMessage("Batch is reuired"),
	],
	(req, res, next) => {
		const errors = validationResult(req).formatWith(({ msg, param, }) => ({
			[param]: msg,
		}));
		if (!errors.isEmpty()) {
			e = ValidationError({message: errors.array(),});
			return next(e);
		}
		const { id, } = req.params;
		const { username, pass, } = credentials;
		const { role, batch, } = req.body;
		User.findByIdAndUpdate(id, { accepted: true, }, { new: true, })
			.then(user => {
				const { email, firstName, } = user;
				const payload = { id, firstName, role, batch, };
				const token = jwt.sign(payload, credentials.secretOrKey);
				const link = `${req.protocol}://${req.get(
					"host"
				)}/users/verify?token=${token}`;
				const transporter = nodemailer.createTransport({
					service: "Gmail",
					auth: {
						user: username,
						pass,
					},
					tls: {
						rejectUnauthorized: false,
					},
				});
				const mailOptions = {
					to: email,
					subject: "Please confirm your email account",
					html: `<small>Do not reply to this email</small>
						<p>Hello ${firstName}!</p>
						<p>You are granted a role as a ${role}. Please verify your email address by clicking the link below. You can generate your own password by then: 
								<br/>
								<a href=${link}>link</a>
						</p>
						<div>
							<strong>Integrify Oy</strong>
							<p>Helsinki, FI</p>
						</div>`,
				};
				transporter
					.sendMail(mailOptions)
					.then(info => res.json(info))
					.catch(() => {
						e = InternalError();
						return next(e);
					});
			})
			.catch(() => {
				e = NotFoundError({message: "No user found with that id", });
				return next(e);
			});
	}
);

//GET tempUser is verified and asked for a password
router.get("/verify", (req, res, next) => {
	const link = `${req.protocol}://${req.get("host")}`;
	const devLink = "http://localhost:3000";
	const prodLink = "https://integrify.network";
	if (link === devLink || link === prodLink) {
		const extractToken = req.query.token;
		const decoded = jwt.verify(extractToken, credentials.secretOrKey);
		User.findById(decoded.id)
			.then(user => {
				if (user.password !== "not generated") {
					e = NotFoundError({message: "Page not found",});
					return next(e);
				}

				return res.json(decoded);
			})
			.catch(() => {
				e = NotFoundError({message: "No user found",});
				return next(e);
			});
	}
});

//PUT set password
router.put(
	"/signup/:id",
	[
		check("role")
			.exists({ checkFalsy: true, })
			.withMessage("Role is required"),
		check("password")
			.exists({ checkFalsy: true, })
			.withMessage("Password is required")
			.matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
			.withMessage(
				"Password must be at least 8 characters in length, in which contain at least 1 number, 1 capitalized character and 1 symbol"
			),
		check("password2")
			.exists({ checkFalsy: true, })
			.withMessage("Password confirmation is required")
			.custom((value, { req, }) => {
				return value !== req.body.password ? false : value;
			})
			.withMessage("Password confirm must match"),
	],
	(req, res, next) => {
		const errors = validationResult(req).formatWith(({ msg, param, }) => ({
			[param]: msg,
		}));
		if (!errors.isEmpty()) {
			e = ValidationError({message: errors.array(),});
			return next(e);
		}
		const { id, } = req.params;
		let { password, role, } = req.body;
		User.findById(id)
			.then(user => {
				if (user.password !== "not generated") {
					e = ConflictError({message: "You have already register with a password. Please go to login page to use the service",});
					return next(e);
				}
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(password, salt, (err, hash) => {
						if (err){
							return next(err);
						}
						User.findByIdAndUpdate(id, { password: hash, }, { new: true, })
							.then(user => {
								const { firstName, } = user;
								const payload = { id, firstName, role, };
								const token = jwt.sign(payload, credentials.secretOrKey, {
									expiresIn: "1d",
								});
								res.cookie("jwt_token", token);
								return res.json({ msg: "cookie is set", });
							})
							.catch(() => {
								e = InternalError({message: "Password cannot be updated",});
								return next(e);
							});
					});
				});
			})
			.catch(() => {
				e = NotFoundError({message: "No user found",});
				return next(e);
			});
	}
);

//GET all users
router.get("/signup", (req, res, next) => {
	User.find({ accepted: true, })
		.sort({ date: -1, })
		.then(users => res.json(users))
		.catch(() => {
			e = NotFoundError({message: "No sign-up users found",});
			return next(e);
		});
});

//POST login user
router.post(
	"/login",
	[
		check("email")
			.not()
			.isEmpty()
			.withMessage("Email is required")
			.isEmail()
			.withMessage("Email is invalid"),
		check("password")
			.not()
			.isEmpty()
			.withMessage("Password is required"),
	],
	(req, res, next) => {
		const errors = validationResult(req).formatWith(({ msg, param, }) => ({
			[param]: msg,
		}));
		if (!errors.isEmpty()) {
			e = ValidationError({message: errors.array(),});
			return next(e);
		}
		const { email, password, } = req.body;
		User.findOne({ email, })
			.then(user => {
				const regex = /[$a-zA-Z]/g;
				if (!regex.test(user.password)) {
					e = UnauthorizedError({message: "Email has not either been verified or approved",});
					return next(e);
				}
				bcrypt.compare(password, user.password).then(isMatch => {
					if (isMatch) {
						const { id, firstname, } = user;
						const payload = { id, firstname, };
						const token = jwt.sign(payload, credentials.secretOrKey, {
							expiresIn: "1d",
						});
						res.cookie("jwt_token", token);
						return res.json({ msg: "cookie is set", });
					} else {
						e = ForbiddenError({message: "Password incorrect",});
						return next(e);
					}
				});
			})
			.catch(() => {
				e = NotFoundError({message: "User not found",});
				return next(e);
			});
	}
);

//GET logout user
router.get("/logout", (req, res) => {
	res.clearCookie("jwt_token");
	res.send("cleared cookie");
});

//POST reset password
router.put(
	"/password/reset/:id",
	[
		check("currentPassword")
			.not()
			.isEmpty()
			.withMessage("Current password is required"),
		check("password")
			.not()
			.isEmpty()
			.withMessage("Password is required")
			.matches("^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$")
			.withMessage(
				"Password must be at least 8 characters in length, in which contain at least 1 number, 1 capitalized character and 1 symbol"
			),
		check("password2")
			.not()
			.isEmpty()
			.withMessage("Password confirm is required")
			.custom((value, { req, }) => {
				return value !== req.body.password ? false : value;
			})
			.withMessage("Password confirm must match"),
	],
	(req, res, next) => {
		const errors = validationResult(req).formatWith(({ msg, param, }) => ({
			[param]: msg,
		}));
		if (!errors.isEmpty()) {
			e = ValidationError({message: errors.array(),});
			return next(e);
		}
		const { currentPassword, password, } = req.body;
		const { id, } = req.params;
		User.findById(id)
			.then(user => {
				if (!user) {
					e = NotFoundError({message: "No user found with that id",});
					return next(e);
				}
				bcrypt.compare(currentPassword, user.password).then(isMatch => {
					if (!isMatch) {
						e = ForbiddenError({message: "Password incorrect",});
						return next(e);
					}
					bcrypt.genSalt(10, (err, salt) => {
						bcrypt.hash(password, salt, (err, hash) => {
							if (err) {
								return next(err);
							}
							User.findByIdAndUpdate(id, { password: hash, }, { new: true, })
								.then(user => res.json(user))
								.catch(() => {
									e = InternalError({message: "Password cannot be updated",});
									return next(e);
								});
						});
					});
				});
			})
			.catch(() => {
				e = NotFoundError({message: "No user found with that id",});
				return next(e);
			});
	}
);

//test endpoint for front-end
router.get("/:id", (req, res) => {
	const { id, } = req.params;
	Profile.findOne({ user: id, })
		.populate("user", ["firstName",])
		.then(profile => {
			const { role, batch, user, } = profile;
			const { firstName, } = user;
			Attendance.findOne({})
				.sort({ date: -1, })
				.then(today => {
					const studentInfo = today.attendanceData.find(
						stud => stud.studentId.toString() === id
					);
					const { timeIn, } = studentInfo.timesStamp;
					const userData = {
						id,
						firstName,
						role,
						batch,
						present: timeIn ? true : false,
					};
					res.json(userData);
				});
		})
		.catch(e => console.log(e));
});

module.exports = router;
