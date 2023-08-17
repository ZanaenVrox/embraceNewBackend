const mongoose = require("mongoose");

const customersSchema = new mongoose.Schema(
  {
    full_name: {
      type: String,
      required: false,
    },
    customerId: {
      type: String,
      required: false,
    },
    Street: {
      type: String,
      required: false,
    },
    Appartments: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    postalcode: {
      type: Number,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      unique: false,
      lowercase: false,
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: false,
    },
    notes: {
      type: String,
      required: false,
    },
    dob: {
      type: String,
      required: false,
    },
    periodStartDate: {
      type: String,
      required: false,
    },
    periodEndDate: {
      type: String,
      required: false,
    },
    favBlogs: {
      type: Array,
      required: false,
    },
    usedCouponCode: {
      type: String,
      required: false,
    },
    isActive: {
      type: Boolean,
      required: false,
      default: true,
    },
    token: {
      type: String,
      required: false,
    },
    applyedCoupon: {
      type: Array,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Customers =
  mongoose.models.Customers || mongoose.model("Customers", customersSchema);

module.exports = Customers;
