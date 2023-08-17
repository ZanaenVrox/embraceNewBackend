const mongoose = require("mongoose");

const productCategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    meta_title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: true,
    },
    meta_description: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const productCategory =
  mongoose.models.productCategory ||
  mongoose.model("productCategory", productCategorySchema);

module.exports = productCategory;
