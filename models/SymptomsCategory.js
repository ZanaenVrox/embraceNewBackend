const mongoose = require("mongoose");

const SymptomsCategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
});

const SymptomsCategory = mongoose.model(
  "SymptomsCategory",
  SymptomsCategorySchema
);

module.exports = SymptomsCategory;
