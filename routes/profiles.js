const express = require("express");
const router = express.Router();

let profiles = require("../data/profilejson/profiles.json");
let functions = require("../view_functions/profiles_functions");

// show all profiles
router.get("/", (req, res) => {
	res.send(profiles);
});

// show form to edit 1 profile
router.get("/:id/edit", (req, res) => {
	const id = req.params.id;
	const targetedProfile = profiles.filter((profile) => profile._id === id)[0];
	res.send(`Edit Profile Form for user ${targetedProfile.firstName} ${targetedProfile.lastName}`);
});

// edit 1 profile
router.put("/:id", (req, res) => {
	const id = req.params.id;
	const new_data = req.body;
	const result = functions.editProfile(id, new_data, profiles);
	res.send(result);
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
	result = functions.deleteProfile(id, profiles);
	res.send(result);
});

module.exports = router;
