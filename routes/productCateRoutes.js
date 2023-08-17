const express = require("express");
const router = express.Router();
const {
  getProductCategory,
  createProductCategory,
  getProductCategoryById,
  deleteCategory,
  updateCategory,
} = require("../controller/productCategoryController");

router.get("/all", getProductCategory);

router.post("/add", createProductCategory);

router.get("/:id", getProductCategoryById);

router.put("/:id", updateCategory);

router.delete("/:id", deleteCategory);

module.exports = router;
