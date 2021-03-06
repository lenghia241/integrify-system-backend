const express = require("express");
const router = express.Router();

let profiles = require("../data/profilejson/profiles.json");
let functions = require("./profiles_functions/profiles_functions");

// show all profiles
router.get("/", (req, res) => {
	res.send(profiles);
});

// edit 1 profile
router.put("/:id", (req, res) => {
	const id = req.params.id;
	const newData = req.body;
	const result = functions.editProfile(id, newData, profiles);
	res.send(result);
});

// create new profile. temporary for JSON version
router.post("/", (req, res) => {
	profiles.unshift(req.body);
	res.send("New profile added!");
});

// show profile of 1 user
router.get("/:id", (req, res) => {
	const id = req.params.id;
	const targetedProfile = profiles.find((profile) => profile._id === id);
	res.send(targetedProfile);
});

// delete 1 profile
router.delete("/:id", (req, res) => {
	const id = req.params.id;
	const result = functions.deleteProfile(id, profiles);
	res.send(result);
});

module.exports = router;
