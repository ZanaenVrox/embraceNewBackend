const ProductCategory = require("../models/ProductCategory");

const getProductCategory = async (req, res) => {
  try {
    const productsCategory = await ProductCategory.find({}).sort({ _id: -1 });
    res.send(productsCategory);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const createProductCategory = async (req, res) => {
  try {
    const newCategory = new ProductCategory(req.body);
    await newCategory.save();
    res.status(200).send({
      message: "Product Category Added Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getProductCategoryById = async (req, res) => {
  try {
    const ProductCategory = await ProductCategory.findById(req.params.id);
    res.send(ProductCategory);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deleteCategory = (req, res) => {
  ProductCategory.deleteOne({ _id: req.params.id }, (err) => {
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

const updateCategory = async (req, res) => {
  try {
    const category = await ProductCategory.findById(req.params.id);
    if (category) {
      category.title = req.body.title;
      category.meta_title = req.body.meta_title;
      category.description = req.body.description;
      category.meta_description = req.body.meta_description;
      category.image = req.body.image;
      await category.save();
      res.send({ message: "Category Updated Successfully!" });
    }
  } catch (err) {
    res.status(404).send({ message: "Category not found!" });
  }
};

module.exports = {
  getProductCategory,
  createProductCategory,
  getProductCategoryById,
  deleteCategory,
  updateCategory,
};
