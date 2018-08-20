const express = require("express");
const router = express.Router();
let today = require("../data/attendance/today.json");
const history = require("../data/attendance/history.json");

const constants = require("../data/attendance/constants");
const helpers = require("../data/attendance/helpers");

const to_date = new Date().toDateString();

router.get("/test", (req, res) => {
    res.send(`${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`);
});

router.get("/", (req, res) => {
    const { attendance_data, } = today[0];
    const current_status = attendance_data.map(stud => {
        return {
            name: stud.name,
            presence: stud.presence,
        };
    });

    res.json(current_status);
});


router.get("/today", (req, res) => {
    const foundIndex = helpers.checkTodayInHistory(today, history);
    today = helpers.refreshToday(foundIndex, today, to_date);

    res.send(today);
});

router.get("/history", (req, res) => {
    const foundIndex = helpers.checkTodayInHistory(today, history);
    helpers.saveTodayInHistory(foundIndex, today, history, to_date);

    res.send(history);
});

router.post("/today", (req, res) => {
    const foundIndex = helpers.checkTodayInHistory(today, history);

    helpers.saveTodayInHistory(foundIndex, today, history, to_date);
    today = helpers.refreshToday(foundIndex, today, to_date);
    // function firstFunc(_callback) {
    //     _callback(today, to_date);
    // }   
    // firstFunc(helpers.testingRefreshToday);

    const reqStud = {
        name: req.body.name, //ObjectId of student
        time: `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`, //default
    };
    // check attendance
    let index = -1;
    const { attendance_data, } = today[0];
    attendance_data.forEach(stud => {
        if (stud.name === reqStud.name) {
            index = 1;
            if (stud.timesStamp) {
                stud.presence = false;
                stud.timesStamp = {
                    ...stud.timesStamp,
                    time_out: reqStud.time,
                    left_early:
                        reqStud.time < constants.CHECK_OUT_TIME ? true : false,
                };
            } else {
                stud.presence = true;
                stud.timesStamp = {
                    time_in: reqStud.time,
                    late: reqStud.time > constants.CHECK_IN_TIME ? true : false,
                };
            }
        }
    });

    index === -1
        ? res.status(404).json({ msg: "Student is not found", })
        : res.send(today);
});

module.exports = router;