const express = require("express");
const router = express.Router();
const {
  createCities,
  getCities,
  changeCityStatus,
} = require("../controller/citiesController");

router.post("/create", createCities);

router.get("/", getCities);

router.get("/status/:id", changeCityStatus);

module.exports = router;
