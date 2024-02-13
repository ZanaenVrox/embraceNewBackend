const mongoose = require("mongoose");

const dailyDAUSchema = new mongoose.Schema(
  {
    date: {
      type: Date,
    },
    uniqueUsers: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const DailyDAU =
  mongoose.models.DailyDAU || mongoose.model("DailyDAU", dailyDAUSchema);

module.exports = DailyDAU;
