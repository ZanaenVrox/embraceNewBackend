const Notification = require("../models/Notification");

const createNotification = async (req, res) => {
  try {
    const newNotification = new Notification({
      user_id: req.body.user_id,
      message: req.body.message,
    });
    // const notification = await newNotification.save();
    // res.status(200).json(notification);
    res.status(200);
  } catch (err) {
    res.status(500).json(err.message);
  }
};
const createNotificationBack = async (user_id, message) => {
  try {
    const newNotification = new Notification({
      user_id: user_id,
      message: message,
    });

    const notification = await newNotification.save();
    console.log("notification saved");
  } catch (err) {
    console.log("notification error");
  }
};

const getNotification = async (req, res) => {
  try {
    const notification = await Notification.find({
      user_id: req.params.userId,
    }).sort({ _id: -1 });
    res.status(200).json(notification);
  } catch (err) {
    res.status(500).json(err.message);
  }
};

module.exports = {
  createNotification,
  getNotification,
  createNotificationBack,
};
