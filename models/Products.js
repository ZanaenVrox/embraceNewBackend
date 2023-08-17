const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: true,
    },
    sku: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    pieces: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    salePrice: {
      type: Number,
      required: true,
    },
    productImage: {
      type: Array,
      required: true,
    },
    productCategory: {
      type: String,
      required: true,
    },
    quantity: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "Published",
    },
    reviews: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

module.exports = Product;
