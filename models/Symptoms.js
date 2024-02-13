const mongoose = require("mongoose");

const SymptomsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  category: {
    type: String,
    required: false,
  },
  story: {
    type: Array,
    required: false,
  },
});

const Symptoms = mongoose.model("Symptoms", SymptomsSchema);

module.exports = Symptoms;
