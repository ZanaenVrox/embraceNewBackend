const express = require("express");
const router = express.Router();
const {
  createSymptoms,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom,
} = require("../controller/symptomsController");

router.post("/", createSymptoms);
router.get("/", getSymptoms);
router.get("/:id", getSymptomById);
router.put("/:id", updateSymptom);
router.delete("/:id", deleteSymptom);

module.exports = router;
