const express = require("express");
const router = express.Router();
const events = require("../data/dashboardjson/events.json");
const assignments = require("../data/dashboardjson/assignments.json");
const studysync = require("../data/dashboardjson/studysync.json");
const multer = require("multer");
const upload = multer({ dest: "./uploads", });
const uuid = require("uuid");
const fs = require("fs");

router.get("/", (req, res) => {
	res.send("this is dashboard");
});

//Show all events
router.get("/events", (req, res) => {
	res.send(events);
});

//Show all assignments
router.get("/assignments", (req, res) => {
	res.send(assignments);
});

//Adding one assignment
router.post("/assignments", upload.any(), (req, res) => {
	const newAssignment = {
		_id: uuid(),
		date: req.body.date,
		dueDate: req.body.dueDate,
		titleOfAssignment: req.body.titleOfAssignment,
		description: req.body.description,
		submitted: req.body.submitted,
	};
	assignments.push(newAssignment);
	fs.writeFile(
		"./data/dashboardjson/assignments.json",
		JSON.stringify(assignments),
		function(err) {
			if (err) throw err;
			res.json("added assignment successfully");
		}
	);
	// res.send(assignments);
});

//Deleting one  assignment based on id
router.delete("/assignments/:id", function(req, res) {
	const indexOfCouseInJson = assignments
		.map(function(assignment) {
			return assignment._id;
		})
		.indexOf(req.params.id); //find the index of :id
	if (indexOfCouseInJson === -1) {
		res.statusCode = 404;
		return res.send("Error 404: No assignment found");
	}
	const result = assignments.splice(indexOfCouseInJson, 1);

	const remainingAssignments = assignments.filter(
		assignment => assignment._id !== result._id
	);
	fs.writeFile(
		"./data/dashboardjson/assignments.json",
		JSON.stringify(remainingAssignments),
		function(err) {
			if (err) throw err;
			res.json("deleted successfully");
		}
	);
});

//Edit and update of assignment
router.put("/assignments/:id", (req, res) => {
	const id = req.params.id;
	const assignment = assignments.filter(assignment => {
		return assignment._id === id;
	})[0];
	const index = assignments.indexOf(assignment);
	const keys = Object.keys(req.body);
	keys.forEach(key => {
		assignment[key] = req.body[key];
	});
	assignments[index] = assignment;
	fs.writeFile(
		"./data/dashboardjson/assignments.json",
		JSON.stringify(assignments),
		function(err) {
			if (err) throw err;
			res.json("update is success");
		}
	);
	// res.send(assignments);
});

//List of studysynch
router.get("/studysync", (req, res) => {
	res.send(studysync);
});
//Adding one studysync
router.post("/studysync", upload.any(), (req, res) => {
	const _id = uuid();
	const newstudy = {
		_id: _id,
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		date: req.body.date,
		title: req.body.title,
		description: req.body.description,
	};
	studysync.push(newstudy);
	fs.writeFile(
		"./data/dashboardjson/studysync.json",
		JSON.stringify(studysync),
		function(err) {
			if (err) throw err;
			res.json("added studysync successfully");
		}
	);
	// res.send(studysync);
});
//Deleting one studysync
router.delete("/studysync/:id", function(req, res) {
	let indexOfCouseInJson = studysync
		.map(function(study) {
			return study._id;
		})
		.indexOf(req.params.id); //find the index of :id
	if (indexOfCouseInJson === -1) {
		res.statusCode = 404;
		return res.send("Error 404: No studysync found");
	}
	let result = studysync.splice(indexOfCouseInJson, 1);

	const remainingstudysync = studysync.filter(
		studysync => studysync._id !== result._id
	);
	fs.writeFile(
		"./data/dashboardjson/studysync.json",
		JSON.stringify(remainingstudysync),
		function(err) {
			if (err) throw err;
			res.json("Deleted successfully");
		}
	);
});
//Edit and upadte studysync
router.put("/studysync/:id", (req, res) => {
	const id = req.params.id;
	const study = studysync.filter(study => {
		return study._id === id;
	})[0];
	const index = studysync.indexOf(study);
	const keys = Object.keys(req.body);
	keys.forEach(key => {
		study[key] = req.body[key];
	});
	studysync[index] = study;
	fs.writeFile(
		"./data/dashboardjson/studysync.json",
		JSON.stringify(studysync),
		function(err) {
			if (err) throw err;
			res.json("updated studysync successfully");
		}
	);
	// res.send(studysync);
});

module.exports = router;
