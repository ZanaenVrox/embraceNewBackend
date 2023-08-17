const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    customerId: {
      type: String,
      required: false,
    },
    name: {
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
    state: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    contact: {
      type: String,
      required: false,
    },
    isDefault: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Address =
  mongoose.models.Address || mongoose.model("Address", addressSchema);

module.exports = Address;
