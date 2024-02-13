const express = require("express");
const router = express.Router();
const {
    createMenstrualCycle,
    nextCycle,
    Detail,
    Get, DaysLeft
} = require("../controller/menstrualController")

router.post("/create", createMenstrualCycle);
router.get("/nextCycle", nextCycle);
router.get("/daysLeft", DaysLeft);
router.get("/all", Get);
router.get("/details", Detail);


module.exports = router;
