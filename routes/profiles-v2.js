const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Profile = require("../models/profile");

// @route   get v2/profiles
// @desc    Get all user profiles
// @access   Private: *TODO*
router.get("/", (req, res) => {
	Profile.find().then(profiles => {
		if (profiles.length === 0) {
			res.status(400).send("There is no profile");
		} else {
			res.json(profiles);
		}
	});
});

// @route   get v2/profiles:id
// @desc    Get user profile by ID
// @access   Private: *TODO*
router.get("/:id", (req, res) => {
	let errors = {};
	Profile.findOne({ user: req.params.id, })
		.then(profile => {
			if (!profile) {
				errors.noprofile = "There is no profile for this user";
				res.status(404).json(errors);
			}
			res.json(profile);
		})
		.catch(() =>
			res.status(404).json({ profile: "There is no profile for this user", })
		);
});

// @route   post v2/profiles
// @desc    Post new user profile
// @access   Private: *TODO*
router.post("/", (req, res) => {
	// Get field

	const profileFields = req.body;

	//Save profile
	profileFields._id = new mongoose.mongo.ObjectID();
	Profile.create(profileFields);
	res.json(profileFields);
});

// @route   put v2/profiles
// @desc    Edit user profile by ID
// @access   Private: *TODO*
router.put("/:id", (req, res) => {
	const editedProfile = req.body;
	Profile.findOneAndUpdate({ _id: req.params.id, }, editedProfile, {
		new: true,
	}).then(() => res.json({ msg: "Update profile successfully", }));
});

// @route   delete v2/profiles
// @desc    Delete user profile by ID
// @access   Private: *TODO*
router.delete("/:id", (req, res) => {
	Profile.findOneAndRemove({ _id: req.params.id, }).then(() =>
		res.json({ msg: "Profile deleted", })
	);
});

module.exports = router;
