const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const credentials = require("../config/credentials");
const User = require("../models/user");
const Attendance = require("../models/attendance");
const Profile = require("../models/profile");
const validateTempUser = require("../validation/temp-signup");
const validateSignup = require("../validation/signup");
const validateLogin = require("../validation/login");
/* GET test api */
router.get("/", function(req, res) {
	res.send("respond with a resource");
});

//POST register for tempUser
router.post("/signup/temp", (req, res) => {
	const { errors, isValid, } = validateTempUser(req.body);
	const { firstName, lastName, email, } = req.body;
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({ email, }).then(user => {
		if (user) {
			if (user.accepted) {
				if (user.password === "not generated") {
					return res.status(409).json({
						msg:
							"You have registered. An email verification has been sent to your email",
					});
				}
				return res.status(409).json({
					msg:
						"You have already register with a password. Please go to login page to use the service",
				});
			}
			return res.status(400).json({
				msg:
					"Your sign-up request has not either been approved or declined by the admin. Please wait!",
			});
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
			.catch(() => res.status(400).json({ msg: "Failed to save new data", }));
	});
});

//GET all tempUsers
router.get("/signup/temp", (req, res) => {
	User.find({ accepted: false, })
		.sort({ date: -1, })
		.then(users => res.json(users))
		.catch(() => res.status(404).json({ msg: "No sign-up request found", }));
});

//DELETE tempUser declined by admin
router.delete("/signup/temp/:id", (req, res) => {
	const { id, } = req.params;
	User.findByIdAndRemove(id)
		.then(() => res.json({ msg: "User has been removed successfully", }))
		.catch(() =>
			res.status(404).json({ msg: "No temporary user with that id found", })
		);
});

//POST send email verification to tempUser accepted by admin
router.post("/signup/temp/:id", (req, res) => {
	const { id, } = req.params;
	const { username, pass, } = credentials;
	const { role, batch, } = req.body;
	if (!role) {
		return res.status(400).json({ role: "Roles is required", });
	}
	if (!batch) {
		return res.status(400).json({ batch: "Batch is required", });
	}
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
				.catch(() =>
					res.status(400).json({ msg: "Failed to send email verification", })
				);
		})
		.catch(() => res.status(404).json({ msg: "No user found with that id", }));
});

//GET tempUser is verified and asked for a password
router.get("/verify", (req, res) => {
	const link = `${req.protocol}://${req.get("host")}`;
	const dev_link = "http://localhost:3000";
	const prod_link = "https://integrify.network";
	if (link === dev_link || link === prod_link) {
		const extractToken = req.query.token;
		const decoded = jwt.verify(extractToken, credentials.secretOrKey);
		User.findById(decoded.id)
			.then(user => {
				if (user.password !== "not generated") {
					return res.status(404).json({ msg: "Page not found", });
				}

				return res.json(decoded);
			})
			.catch(() => res.status(404).json({ msg: "No user found", }));
	}
});

//PUT set password
router.put("/signup/:id", (req, res) => {
	const { errors, isValid, } = validateSignup(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const { id, } = req.params;
	let { password, role, } = req.body;
	User.findById(id)
		.then(user => {
			if (user.password !== "not generated") {
				return res.status(409).json({
					msg:
						"You have already register with a password. Please go to login page to use the service",
				});
			}
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) throw err;
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
						.catch(() =>
							res.status(400).json({ msg: "Password cannot be updated", })
						);
				});
			});
		})
		.catch(() => res.status(404).json({ msg: "No user found", }));
});

//GET all users
router.get("/signup", (req, res) => {
	User.find({ accepted: true, })
		.sort({ date: -1, })
		.then(users => res.json(users))
		.catch(() => res.status(404).json({ msg: "No sign-up users found", }));
});

//POST login user
router.post("/login", (req, res) => {
	const { email, password, } = req.body;
	const { errors, isValid, } = validateLogin(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({ email, })
		.then(user => {
			const regex = /[$a-zA-Z]/g;
			if (!regex.test(user.password)) {
				return res
					.status(401)
					.json({ email: "Email has not either been verified or approved", });
			}
			bcrypt.compare(password, user.password).then(isMatch => {
				if (isMatch) {
					const { id, firstname, role, } = user;
					const payload = { id, firstname, role, };
					const token = jwt.sign(payload, credentials.secretOrKey, {
						expiresIn: "1d",
					});
					res.cookie("jwt_token", token);
					return res.json({ msg: "cookie is set", });
				} else {
					return res.status(403).json({ password: "Password incorrect", });
				}
			});
		})
		.catch(() => res.status(404).json({ email: "User not found", }));
});

//GET logout user
router.get("/logout", (req, res) => {
	res.clearCookie("jwt_token");
	res.send("cleared cookie");
});

//POST reset password
router.put("/password/reset/:id", (
	req,
	res /* next  add it when we have error handling*/
) => {
	const { currentPassword, password, } = req.body;
	const { id, } = req.params;
	if (!currentPassword) {
		// err = new Error('Current password is required')
		// err.statusCode = 400
		// next(err)
		return res.status(400).json({ msg: "Current password is required", });
	}
	const { errors, isValid, } = validateSignup(req.body);
	//id, currentPassword, password, password2
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findById(id)
		.then(user => {
			if (!user) {
				return res.status(404).json({ msg: "No user found with that id", });
			}
			bcrypt.compare(currentPassword, user.password).then(isMatch => {
				if (!isMatch) {
					return res.status(403).json({ password: "Password incorrect", });
				}
				bcrypt.genSalt(10, (err, salt) => {
					// TODO handle errors
					bcrypt.hash(password, salt, (err, hash) => {
						//if(err) next(err); TODO add it when we have error handling
						if (err) throw err;
						User.findByIdAndUpdate(id, { password: hash, }, { new: true, })
							.then(user => res.json(user))
							.catch(() =>
								res.status(400).json({ msg: "Password cannot be updated", })
							);
					});
				});
			});
		})
		.catch(() => res.status(400).json({ msg: "Id is in wrong format", }));
});

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
					const { timeIn, } = studentInfo.timeStamp;
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
