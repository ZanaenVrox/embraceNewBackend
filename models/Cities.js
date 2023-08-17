const mongoose = require("mongoose");

const citiesSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Cities = mongoose.models.Cities || mongoose.model("Cities", citiesSchema);
module.exports = Cities;
