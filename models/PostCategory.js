const mongoose = require("mongoose");

const postcategorySchema = new mongoose.Schema(
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
    colourCode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const PostCategory =
  mongoose.models.PostCategory ||
  mongoose.model("PostCategory", postcategorySchema);

module.exports = PostCategory;
