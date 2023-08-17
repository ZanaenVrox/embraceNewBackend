const express = require("express");
const router = express.Router();
const {
  createPosts,
  getAllPosts,
  getPostsById,
  updatePosts,
  deletePosts,
} = require("../controller/postsController");

const { isAuth } = require("../config/auth");

// Create Posts
router.post("/create", isAuth, createPosts);

// Get All Posts
router.get("/", getAllPosts);

// Get Posts By ID
router.get("/:id", getPostsById);

//  Update Posts
router.put("/:id", isAuth, updatePosts);

//  Delete Posts
router.delete("/:id", isAuth, deletePosts);

module.exports = router;
