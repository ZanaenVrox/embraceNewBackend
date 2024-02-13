const mongoose = require("mongoose");

const usersymptomsSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: false,
    },
    current_date: {
      type: Date,
      required: false,
    },
    sympton: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserSymptoms =
  mongoose.models.UserSymptoms ||
  mongoose.model("UserSymptoms", usersymptomsSchema);

module.exports = UserSymptoms;
