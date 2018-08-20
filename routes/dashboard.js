const express = require("express");
const router = express.Router();
const events = require("../data/dashboardjson/events.json");
const assignments = require("../data/dashboardjson/assignments.json");
const studysync = require("../data/dashboardjson/studysync.json");

router.get("/", (req, res) => {
	res.send("this is dashboard");
});

router.get("/events", (req, res) => {
	res.send(events);
});

router.get("/assignments", (req, res) => {
	res.send(assignments);
});

router.get("/studysync", (req, res) => {
	res.send(studysync);
});

module.exports = router;
