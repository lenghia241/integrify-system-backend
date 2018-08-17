const express = require("express");
const router = express.Router();
const events = require("../data/dashboardjson/events.json");
const assignments = require("../data/dashboardjson/assignments.json");
const studysynch = require("../data/dashboardjson/studysynch.json");

router.get("/", (req, res) => {
	res.send("this is dashboard");
});

router.get("/events", (req, res) => {
	res.send(events);
});

router.get("/assignments", (req, res) => {
	res.send(assignments);
});

router.get("/studysynch", (req, res) => {
	res.send(studysynch);
});

module.exports = router;
