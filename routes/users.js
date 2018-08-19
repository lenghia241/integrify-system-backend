const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const credentials = require("../config/credentials");
const TempUser = require("../models/tempUser");
const PersistentUser = require("../models/persistentUser");
const validateTempUser = require("../validation/temp-signup");
const validateSignup = require("../validation/signup");
const validateLogin = require("../validation/login");

/* GET users listing. */
router.get("/", function(req, res) {
	res.send("respond with a resource");
});

//POST register for tempUser
router.post("/temp-signup", (req, res) => {
	const { errors, isValid, } = validateTempUser(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	const { firstname, lastname, email, } = req.body;
	TempUser.findOne({ email, }).then(tempUser => {
		if (tempUser) {
			errors.email = "Email already exists";
			return res.status(400).json(errors);
		}
		const newTempUser = new TempUser({
			firstname,
			lastname,
			email,
		});
		newTempUser
			.save()
			.then(tempUser => res.json(tempUser))
			.catch(e => res.status(400).json({ msg: "Failed to save new data", }));
	});
});

//GET all tempUsers
router.get("/temp-signup", (req, res) => {
	TempUser.find()
		.sort({ date: -1, })
		.then(tempUsers => res.json(tempUsers))
		.catch(() =>
			res.status(404).json({ msg: "No temporary sign-up request found", })
		);
});

//DELETE tempUser declined by admin
router.delete("/temp-signup/:id", (req, res) => {
	const { id, } = req.params;
	TempUser.findByIdAndRemove(id)
		.then(() => res.json({ success: true, }))
		.catch(() =>
			res.status(404).json({ msg: "No temporary user with that id found", })
		);
});

//POST send email verifycation to tempUser accepted by admin
router.post("/temp-signup/:id", (req, res) => {
	const { id, } = req.params;
	const { user, pass, } = credentials;
	const { roles, } = req.body;
	if (!roles) {
		return res.status(400).json({ roles: "Roles is required", });
	}
	TempUser.findById(id)
		.then(tempUser => {
			const { firstname, email, } = tempUser;
			const newPersistentUser = new PersistentUser({
				user: id,
				password: "not generated",
				roles,
			});
			newPersistentUser
				.save()
				.then(() => {
					const link = `${req.protocol}://${req.get(
						"host"
					)}/users/verify?id=${id}&roles=${roles}`;
					const transporter = nodemailer.createTransport({
						service: "Gmail",
						auth: {
							user,
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
						<p>Hello ${firstname}!</p>
						<p>You are granted a role as a ${roles}. Please verify your email address by clicking the link below. You can generate your own password by then: 
								<br/>
								<a href=${link}>link</a>
						</p>
						<br/>
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
				.catch(() =>
					res.status(400).json({ msg: "Failed to save new user data", })
				);
		})
		.catch(() =>
			res.status(404).json({ msg: "No temporary user found with that ID", })
		);
});

//GET tempUser is verified and asked for a password
router.get("/verify", (req, res) => {
	const link = `${req.protocol}://${req.get("host")}`;
	const dev_link = "http://localhost:3000";
	const prod_link = "https://integrify.network";
	if (link === dev_link || link === prod_link) {
		const { id, } = req.query;
		PersistentUser.findOne({ user: id, })
			.then(user => res.json(user))
			.catch(() => res.status(404).json({ msg: "No user found", }));
	}
});

//PUT persistent user, with password
router.put("/signup", (req, res) => {
	const { errors, isValid, } = validateSignup(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	let { id, password, } = req.body;
	PersistentUser.findOne({ user: id, })
		.then(user => {
			if (user.password !== "not generated") {
				errors.msg = "You have already registered";
				return res.status(400).json(errors);
			}
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) throw err;
					PersistentUser.findByIdAndUpdate(
						user._id,
						{ password: hash, },
						{ new: true, }
					)
						.then(user => res.json(user))
						.catch(e =>
							res.status(400).json({ msg: "Password cannot be updated", })
						);
				});
			});
		})
		.catch(() => res.status(404).json({ msg: "No user found", }));
});

//GET all persistent users
router.get("/signup", (req, res) => {
	PersistentUser.find()
		.populate("user", ["firstname", "lastname", "email",])
		.sort({ date: -1, })
		.then(users => res.json(users))
		.catch(() => res.status(400).json({ msg: "No sign-up users found", }));
});

//LOGIN user
router.post("/login", (req, res) => {
	const { email, password, } = req.body;
	const { errors, isValid, } = validateLogin(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}

	TempUser.findOne({ email, })
		.then(tempuser => {
			const { _id, firstname, } = tempuser;
			PersistentUser.findOne({ user: _id, }).then(persistent_user => {
				if (!persistent_user) {
					return res
						.status(401)
						.json({ email: "Email has not either been verified or approved", });
				}
				bcrypt.compare(password, persistent_user.password).then(isMatch => {
					if (isMatch) {
						const { id, roles, } = persistent_user;
						const payload = {
							id,
							firstname,
							roles,
						};
						jwt.sign(payload, credentials.secretOrKey, (err, token) =>
							res.json({ token: `Bearer ${token}`, })
						);
					} else {
						return res.status(400).json({ password: "Password incorrect", });
					}
				});
			});
		})
		.catch(() => res.status(404).json({ email: "User not found", }));
});

module.exports = router;
