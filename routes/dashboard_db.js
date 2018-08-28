const express = require("express");
const router = express.Router();
const multer = require("multer");
const upload = multer({ dest: "./uploads", });

const dashboardController = require("./dashboard_controller");

router.get("/", (req, res) => {
	res.send("this is dashboard");
});

//Routes for events
router
	.route("/events")
	.get(dashboardController.eventsIndex)
	.post(upload.any(), dashboardController.newEvent);
router
	.route("/events/:id")
	.get(dashboardController.singleEvent)
	.delete(dashboardController.deleteEvent)
	.put(upload.any(),dashboardController.editEvent);

//Routes for assignments
router
	.route("/assignments")
	.get(dashboardController.assignmentsIndex)
	.post(upload.any(),dashboardController.newAssignment);
router
	.route("/assignments/:id")
	.get(dashboardController.singleAssignment)
	.delete(dashboardController.deleteAssignment)
	.put(upload.any(),dashboardController.editAssignment);

//Routes for studysync
router
	.route("/studysync")
	.get(dashboardController.studysyncIndex)
	.post(upload.any(),dashboardController.newStudysync);
router
	.route("/studysync/:id")
	.get(dashboardController.singleStudysync)
	.delete(dashboardController.deleteStudysync)
	.put(upload.any(),dashboardController.editStudysync);

module.exports = router;