const express = require("express");
const router = express.Router();

const profiles = require("../data/profilejson/profiles.json");

router.get("/", (req, res) => {
	res.send(profiles);
});

router.get("/:id", (req, res) => {
	const id = req.params.id;
	const targeted_profile = profiles.filter((profile) => {
		return profile._id === id;
	});
	res.send(targeted_profile);
});

module.exports = router;
