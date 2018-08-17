const express = require("express");
const router = express.Router();

const profile = require("../data/profilejson/profile.json");

router.get("/", (req, res) => {
	res.send(profile);
});


module.exports = router;