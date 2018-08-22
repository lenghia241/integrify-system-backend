const express = require("express");
const router = express.Router();
const events = require("../data/dashboardjson/events.json");
const assignments = require("../data/dashboardjson/assignments.json");
const studysync = require("../data/dashboardjson/studysync.json");
const multer = require("multer");
const upload = multer({ dest: "./uploads", });
const uuid = require("uuid");

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
	res.send(assignments);
});

//Deleting one  assignment based on id
router.delete("/assignments/:id", function(req, res) {
	const id = req.params.id;
	// const remaining_assignments = assignments.filter(assignment => {
	// 	return assignment._id !== id;
	// });
	res.json(null);
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
	res.send(assignments);
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
	res.send(studysync);
});
//Deleting one studysync
router.delete("/studysync/:id", function(req, res) {
	const id = req.params.id;
	// const remaining_studysync = studysync.filter(study => {
	// 	return study._id !== id;
	// });
	res.json(null);
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
	res.send(studysync);
});

module.exports = router;