const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    subscriptionType: {
      type: String,
      required: false,
    },
    products: {
      type: Array,
    },
    lastOrderDate: {
      type: String,
      required: false,
    },
    nextOrderDate: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    status: {
      type: Boolean,
      defalut: true,
    },
  },
  {
    timestamps: true,
  }
);

const Subscription =
  mongoose.models.Subscription ||
  mongoose.model("Subscription", subscriptionSchema);

module.exports = Subscription;
