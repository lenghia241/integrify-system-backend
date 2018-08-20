const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const axios = require("axios");
const credentials = require("../config/credentials");
const TempUser = require("../models/tempUser");
const User = require("../models/user");
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
			return res.status(409).json(errors);
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
	const { role, batch, } = req.body;
	if (!role) {
		return res.status(400).json({ role: "Roles is required", });
	}
	if (!batch) {
		return res.status(400).json({ batch: "Batch is required", });
	}
	const rand = Math.random();
	TempUser.findById(id)
		.then(tempUser => {
			const { firstname, lastname, email, } = tempUser;
			const newUser = new User({
				firstname,
				lastname,
				email,
				password: rand,
				role,
				batch,
			});
			newUser
				.save()
				.then(() => {
					const link = `${req.protocol}://${req.get(
						"host"
					)}/users/verify?id=${id}&role=${role}&email=${email}&rand=${rand}`;
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
						<p>You are granted a role as a ${role}. Please verify your email address by clicking the link below. You can generate your own password by then: 
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
		const { email, rand, } = req.query;
		User.findOne({ email, password: rand, })
			.then(user => res.json(user))
			.catch(() => res.status(404).json({ msg: "No user found", }));
	}
});

//PUT user, with password provided by user
router.put("/signup", (req, res) => {
	const { errors, isValid, } = validateSignup(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	let { email, password, } = req.body;
	User.findOne({ email, })
		.then(user => {
			const regex = /[$a-zA-Z]/g;
			if (regex.test(user.password)) {
				errors.msg = "You have already registered";
				return res.status(409).json(errors);
			}
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(password, salt, (err, hash) => {
					if (err) throw err;
					User.findByIdAndUpdate(user._id, { password: hash, }, { new: true, })
						.then(user => {
							// axios
							// 	.post(`${req.protocol}://${req.get("host")}/users/login`, {
							// 		email,
							// 		password,
							// 	})
							// 	.then(data => res.send(data.data));
							return res.json(user);
						})
						.catch(e =>
							res.status(400).json({ msg: "Password cannot be updated", })
						);
				});
			});
		})
		.catch(() => res.status(404).json({ msg: "No user found", }));
});

//GET all users
router.get("/signup", (req, res) => {
	User.find()
		.sort({ date: -1, })
		.then(users => res.json(users))
		.catch(() => res.status(404).json({ msg: "No sign-up users found", }));
});

//POST login user
router.post("/login", (req, res) => {
	console.log(req.body);
	const { email, password, } = req.body;
	const { errors, isValid, } = validateLogin(req.body);
	if (!isValid) {
		return res.status(400).json(errors);
	}
	User.findOne({ email, })
		.then(user => {
			console.log(user.password);
			const regex = /[$a-zA-Z]/g;
			if (!regex.test(user.password)) {
				return res
					.status(401)
					.json({ email: "Email has not either been verified or approved", });
			}
			bcrypt.compare(password, user.password).then(isMatch => {
				if (isMatch) {
					console.log(isMatch);
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

module.exports = router;
