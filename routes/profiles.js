const express = require("express");
const router = express.Router();

const profiles = require("../data/profilejson/profiles.json");

router.get("/", (req, res) => {
	res.send(profiles);
});


module.exports = router;