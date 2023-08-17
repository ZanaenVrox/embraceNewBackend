const mongoose = require("mongoose");

const activityLogSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    screenName: {
      type: String,
      required: false,
    },
    eventName: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const ActivityLog =
  mongoose.models.ActivityLog ||
  mongoose.model("ActivityLog", activityLogSchema);

module.exports = ActivityLog;
