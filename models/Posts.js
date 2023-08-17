const mongoose = require("mongoose");

const postsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    meta_title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    meta_description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    category: {
      type: Array,
      required: true,
    },
    author: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Posts = mongoose.models.Posts || mongoose.model("Posts", postsSchema);

module.exports = Posts;
