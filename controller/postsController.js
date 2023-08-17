const Posts = require("../models/Posts");
const PostCategory = require("../models/PostCategory");

const createPosts = async (req, res) => {
  try {
    const newPosts = new Posts({
      title: req.body.title,
      meta_title: req.body.meta_title,
      description: req.body.description,
      meta_description: req.body.meta_description,
      image: req.body.image,
      author: req.body.author,
      category: req.body.category,
    });

    const posts = await newPosts.save();

    res.status(200).send({
      data: posts,
      message: "Posts Created Successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Posts.find({}).sort({ _id: -1 });
    res.send({ data: posts });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getPostsById = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    res.send(post);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updatePosts = async (req, res) => {
  try {
    const post = await Posts.findById(req.params.id);
    if (post) {
      post.title = req.body.title;
      post.meta_title = req.body.meta_title;
      post.description = req.body.description;
      post.meta_description = req.body.meta_description;
      post.image = req.body.image;
      post.author = req.body.author;
      post.category = req.body.category;

      const updatedPost = await post.save();
      res.send({
        _id: updatedPost._id,
        title: updatedPost.title,
        meta_title: updatedPost.meta_title,
        description: updatedPost.description,
        meta_description: updatedPost.meta_description,
        image: updatedPost.image,
        author: updatedPost.author,
        category: updatedPost.category,
      });
    }
  } catch (err) {
    res.status(404).send(err.message);
  }
};

const deletePosts = async (req, res) => {
  Posts.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Post Deleted Successfully!",
      });
    }
  });
};

module.exports = {
  createPosts,
  getAllPosts,
  getPostsById,
  updatePosts,
  deletePosts,
};
