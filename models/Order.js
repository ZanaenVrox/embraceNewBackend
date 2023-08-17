const mongoose = require("mongoose");
const AutoIncrement = require("mongoose-sequence")(mongoose);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: false,
    },
    orderId: {
      type: Number,
      required: false,
    },
    cart: [{}],
    name: {
      type: String,
      required: false,
    },
    email: {
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
    contact: {
      type: String,
      required: false,
    },

    country: {
      type: String,
      required: false,
    },
    zipCode: {
      type: String,
      required: false,
    },
    subTotal: {
      type: Number,
      required: false,
    },
    shippingCost: {
      type: Number,
      required: false,
    },
    discount: {
      type: Number,
      required: false,
      default: 0,
    },
    total: {
      type: Number,
      required: false,
    },
    shippingOption: {
      type: String,
      required: false,
    },
    paymentMethod: {
      type: String,
      required: false,
    },
    cardInfo: {
      type: Object,
      required: false,
    },
    subscriptionType: {
      type: String,
      required: false,
    },
    status: {
      type: String,
      default: "Pending",
    },
    token: {
      type: String,
      required: false,
    },
    trackingnumber: {
      type: String,
      required: false,
    },
    rejection_reason: {
      type: String,
      required: false,
    },
    usedPromoCode: {
      type: String,
      required: false,
    },
    swyft_status: {
      type: String,
      default: "",
    },

  },
  {
    timestamps: true,
  }
);

// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
const Order =
  mongoose.models.Order ||
  mongoose.model(
    "Order",
    orderSchema.plugin(AutoIncrement, {
      inc_field: "orderId",
      start_seq: 100,
    })
  );

module.exports = Order;
