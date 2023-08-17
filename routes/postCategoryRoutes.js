const express = require("express");
const router = express.Router();
const {
  createCategory,
  getAllCategory,
  getCategoryById,
  deleteCategory,
  updateCategory,
} = require("../controller/postCategoryController");

const { isAuth } = require("../config/auth");

// Create Category
router.post("/create", isAuth, createCategory);

// Get All Category
router.get("/", getAllCategory);

// Get All Category By ID
router.get("/:id", getCategoryById);

//  Update Category
router.put("/:id", isAuth, updateCategory);

//  Delete Category
router.delete("/:id", isAuth, deleteCategory);

module.exports = router;
