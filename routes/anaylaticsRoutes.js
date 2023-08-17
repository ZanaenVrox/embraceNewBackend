const express = require("express");
const router = express.Router();
const {
  dailyActiveUsers,
  getAllDauData,
} = require("../controller/anyalaticsController");

router.get("/dau", dailyActiveUsers);

router.get("/getAllDauData", getAllDauData);

module.exports = router;
