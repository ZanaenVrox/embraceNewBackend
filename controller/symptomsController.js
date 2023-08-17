const Symptoms = require("../models/Symptoms");

const createSymptoms = async (req, res) => {
  try {
    const symptom = new Symptoms({
      name: req.body.name,
      category: req.body.category,
      image: req.body.image,
      story: req.body.story,
    });
    await symptom.save();
    res.send("Symptoms created successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

const getSymptoms = async (req, res) => {
  try {
    const symptoms = await Symptoms.find();
    res.send(symptoms);
  } catch (err) {
    res.status(500).send(err);
  }
};

const getSymptomById = async (req, res) => {
  try {
    const symptom = await Symptoms.findById(req.params.id);
    if (!symptom) {
      return res.status(404).send("Symptoms not found");
    }
    res.send(symptom);
  } catch (err) {
    res.status(500).send(err);
  }
};

const updateSymptom = async (req, res) => {
  try {
    const symptom = await Symptoms.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!symptom) {
      return res.status(404).send("Symptoms not found");
    }
    res.send("Symptoms updated successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

const deleteSymptom = async (req, res) => {
  try {
    const symptom = await Symptoms.findByIdAndRemove(req.params.id);
    if (!symptom) {
      return res.status(404).send("Symptoms not found");
    }
    res.send("Symptoms deleted successfully");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = {
  createSymptoms,
  getSymptoms,
  getSymptomById,
  updateSymptom,
  deleteSymptom,
};
