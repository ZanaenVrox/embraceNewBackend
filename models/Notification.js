const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    user_id: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

module.exports = Notification;
