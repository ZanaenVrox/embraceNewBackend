const SymptomsCategory = require("../models/SymptomsCategory");

const createCategory = async (req, res) => {
  try {
    const newSymptomsCategory = new SymptomsCategory({
      name: req.body.name,
      description: req.body.description,
    });

    const symptomsCategory = await newSymptomsCategory.save();

    res.status(200).send({
      data: symptomsCategory,
      message: "Category Created Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCategory = async (req, res) => {
  try {
    const symptomsCategory = await SymptomsCategory.find({}).sort({ _id: -1 });
    res.send({ data: symptomsCategory });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const symptomsCategory = await SymptomsCategory.findById(req.params.id);
    res.send(symptomsCategory);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const symptomsCategory = await SymptomsCategory.findById(req.params.id);
    if (symptomsCategory) {
      symptomsCategory.name = req.body.name;
      symptomsCategory.description = req.body.description;

      const updatedSymptomsCategory = await symptomsCategory.save();
      res.send({
        _id: updatedSymptomsCategory._id,
        name: updatedSymptomsCategory.name,
        description: updatedSymptomsCategory.description,
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const deleteCategory = async (req, res) => {
  SymptomsCategory.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Category Deleted Successfully!",
      });
    }
  });
};

module.exports = {
  createCategory,
  getAllCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
};
