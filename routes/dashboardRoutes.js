const express = require("express");
const router = express.Router();
const { getTotalData } = require("../controller/dasboardController");
const { getAddressById } = require("../controller/addressController");

router.get("/totaldata", getTotalData);

router.get("/customer/:id", getAddressById);

module.exports = router;
