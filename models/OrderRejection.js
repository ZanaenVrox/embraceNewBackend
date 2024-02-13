const mongoose = require("mongoose");

const rejectionSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const RejectionResons = mongoose.models.RejectionResons || mongoose.model("RejectionResons", rejectionSchema);
module.exports = RejectionResons;
