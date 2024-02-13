const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    couponCode: {
      type: String,
      required: true,
    },
    discountIn: {
      type: String,
      required: true,
    },
    endTime: {
      type: Date,
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
    },
    minimumAmount: {
      type: Number,
      required: true,
    },
    maximumUsage: {
      type: Number,
      required: true,
    },
    totalUsed: {
      type: Number,
      default: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    multi: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Coupon = mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
