const dashboard = require("../models/dashboard");
const events = require("../data/dashboardjson/events.json");
// const assignments = require("../data/dashboardjson/assignments.json");
// const studysync = require("../data/dashboardjson/studysync.json");


const Events = dashboard.Events;
const Assignments = dashboard.Assignments;
const Studysync = dashboard.Studysync;

// To create events database (working)
exports.eventsIndex = function(req, res) {
	// events.forEach(event => {
	// 	Events.create(event, (err, new_event) => {
	// 		if (err) return console.error(err);
	// 		events.push(new_event);
	// 		new_event.save();
	// 	});
	// });
	Events.find(function(err, result) {
		if (err) throw err;
		res.json({
			message: "events retrieved successfully",
			data: result,
		});
	});
};
//To get single event depending on Id
exports.singleEvent = function(req, res) {
	const id = req.params.id;
	Events.findById(id)
		.then(event => res.json(event))
		.catch(err => res.status(404).json({ success: false, err, }));
};
//To add new event
exports.newEvent = function(req, res) {
	const data = req.body;
	console.log(data);
	Events.insertMany(data)
		.then(() =>
			res.json({ success: true, message: "added event successfully", })
		)
		.catch(err => res.status(404).json({ success: false, err, }));
};

//To delete one event based on id
exports.deleteEvent = function(req, res) {
	const id = req.params.id;
	Events.findById(id)
		.then(item =>
			item.remove().then(() =>
				res.json({
					success: true,
					message: "deleted event successfully",
				})
			)
		)
		.catch(err => res.status(404).json({ success: false, err, }));
};

//To edit and update one assignment based on id
exports.editEvent = function(req, res) {
	const id = req.params.id;
	const data = req.body;
	Events.findByIdAndUpdate(id, data)
		.then(() =>
			res.json({ success: true, message: "event updated successfully", })
		)
		.catch(err =>
			res.sendStatus(status).json({
				success: false,
				err,
			})
		);
};

// To create assignments database (working)
exports.assignmentsIndex = function(req, res) {
	// assignments.forEach(assignment => {
	// 	Assignments.create(assignment, (err, new_assignment) => {
	// 		assignments.push(new_assignment);
	// 		new_assignment.save();
	// 	});
	// });
	Assignments.find(function(err, result) {
		if (err) throw err;
		res.json({
			message: "Assignments retrieved successfully",
			data: result,
		});
	});
};

//To get single assignment depending on Id
exports.singleAssignment = function(req, res) {
	const id = req.params.id;
	Assignments.findById(id)
		.then(assignment => res.json(assignment))
		.catch(err => res.status(404).json({ success: false, err, }));
};
//To add new assignment
exports.newAssignment = function(req, res) {
	const data = {
		date: req.body.date,
		dueDate: req.body.dueDate,
		titleOfAssignment: req.body.titleOfAssignment,
		description: req.body.description,
		submitted: req.body.submitted,
	};
	Assignments.insertMany(data)
		.then(() =>
			res.json({ success: true, message: "added assignment successfully", })
		)
		.catch(err => res.status(404).json({ success: false, err, }));
};

//To delete one assignment based on id
exports.deleteAssignment = function(req, res) {
	const id = req.params.id;
	Assignments.findById(id)
		.then(item =>
			item.remove().then(() =>
				res.json({
					success: true,
					message: "deleted assignment successfully",
				})
			)
		)
		.catch(err => res.status(404).json({ success: false, err, }));
};

//To edit and update one assignment based on id
exports.editAssignment = function(req, res) {
	const id = req.params.id;
	const data = req.body;
	Assignments.findByIdAndUpdate(id, data)
		.then(() =>
			res.json({ success: true, message: "assignment updated successfully", })
		)
		.catch(err =>
			res.sendStatus(status).json({
				success: false,
				err,
			})
		);
};

//To create studysync database(working)
exports.studysyncIndex = function(req, res) {
	// studysync.forEach(study => {
	// 	Studysync.create(study, (err, new_study) => {
	// 		if (err) return console.log(err);
	// 		new_study.save();
	// 	});
	// });
	Studysync.find(function(err, result) {
		if (err) throw err;
		res.json(result);
	});
};

//To get single studysync depending on Id
exports.singleStudysync = function(req, res) {
	const id = req.params.id;
	Studysync.findById(id)
		.then(study => res.json(study))
		.catch(err => res.status(404).json({ success: false, err, }));
};
//To create new studysync
exports.newStudysync = function(req, res) {
	const data = {
		firstName: req.body.firstName,
		lastName: req.body.lastName,
		date: req.body.date,
		title: req.body.title,
		description: req.body.description,
	};
	Studysync.insertMany(data)
		.then(() =>
			res.json({ success: true, message: "added studysync successfully", })
		)
		.catch(err => res.status(404).json({ success: false, err, }));
};

exports.deleteStudysync = function(req, res) {
	const id = req.params.id;
	Studysync.findById(id)
		.then(item =>
			item
				.remove()
				.then(() =>
					res.json({ success: true, message: "deleted studysync successfully", })
				)
		)
		.catch(err => res.status(404).json({ success: false, err, }));
};

//to edit studysync
exports.editStudysync = function(req, res) {
	const id = req.params.id;
	const data = req.body;
	Studysync.findByIdAndUpdate(id, data)
		.then(() =>
			res.json({ success: true, message: "updated studysync successfully", })
		)
		.catch(err =>
			res.sendStatus(status).json({
				success: false,
				err,
			})
		);
};