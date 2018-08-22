const express = require("express");
const router = express.Router();

let profiles = require("../data/profilejson/profiles.json");

// show all profiles
router.get("/", (req, res) => {
	res.send(profiles);
});

// show form to edit 1 profile
router.get("/:id/edit", (req, res) => {
	const id = req.params.id;
	const targetedProfile = profiles.filter((profile) => profile._id === id)[0];
	res.send(`Edit Profile Form for user ${targetedProfile.firstname} ${targetedProfile.lastname}`);
});

// edit 1 profile
router.put("/:id", (req, res) => {
	const id = req.params.id;
	const new_data = req.body;
	profiles = profiles.map((profile) => {
		if (profile._id === id) {
			profile = { ...profile, ...new_data };
		}
		return profile;
	});
	const editedProfile = profiles.filter((profile) => profile._id === id)[0];
	res.send(editedProfile);
});

// show profile of 1 user
router.get("/:id", (req, res) => {
	const id = req.params.id;
	const targetedProfile = profiles.filter((profile) => profile._id === id)[0];
	res.send(targetedProfile);
});

// delete 1 profile
router.delete("/:id", (req, res) => {
	const id = req.params.id;
	profiles = profiles.filter((profile) => profile._id !== id);
	res.send(profiles);
});

module.exports = router;
