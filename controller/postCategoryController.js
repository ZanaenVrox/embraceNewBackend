const PostCategory = require("../models/PostCategory");

const createCategory = async (req, res) => {
  try {
    const newCategory = new PostCategory({
      title: req.body.title,
      meta_title: req.body.meta_title,
      description: req.body.description,
      meta_description: req.body.meta_description,
      image: req.body.image,
    });

    const category = await newCategory.save();

    res.status(200).send({
      data: category,
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
    const categories = await PostCategory.find({}).sort({ _id: -1 });
    res.send({ data: categories });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const category = await PostCategory.findById(req.params.id);
    res.send(category);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const category = await PostCategory.findById(req.params.id);
    if (category) {
      category.title = req.body.title;
      category.meta_title = req.body.meta_title;
      category.description = req.body.description;
      category.meta_description = req.body.meta_description;
      category.image = req.body.image;

      const updatedCategory = await category.save();
      res.send({
        _id: updatedCategory._id,
        title: updatedCategory.title,
        meta_title: updatedCategory.meta_title,
        description: updatedCategory.description,
        meta_description: updatedCategory.meta_description,
        image: updatedCategory.image,
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const deleteCategory = async (req, res) => {
  PostCategory.deleteOne({ _id: req.params.id }, (err) => {
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
