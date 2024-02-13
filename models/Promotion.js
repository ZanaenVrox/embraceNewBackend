const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Promotion =
  mongoose.models.Promotion || mongoose.model("Promotion", promotionSchema);

module.exports = Promotion;
