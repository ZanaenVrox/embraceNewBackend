const rateLimit = require("express-rate-limit");
const moment = require("moment");

//limit email verification and forget password
const minutes = 30;
const emailVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

const passwordVerificationLimit = rateLimit({
  windowMs: minutes * 60 * 1000,
  max: 3,
  handler: (req, res) => {
    res.status(429).send({
      success: false,
      message: `You made too many requests. Please try again after ${minutes} minutes.`,
    });
  },
});

//handle amount format for stripe
const formatAmountForStripe = (amount, currency) => {
  let numberFormat = new Intl.NumberFormat(["en-US"], {
    style: "currency",
    currency: currency,
    currencyDisplay: "symbol",
  });
  const parts = numberFormat.formatToParts(amount);
  let zeroDecimalCurrency = true;
  for (let part of parts) {
    if (part.type === "decimal") {
      zeroDecimalCurrency = false;
    }
  }
  return zeroDecimalCurrency ? amount : Math.round(amount * 100);
};

const generateOrderId = (isSubscription) => {
  const prefix = isSubscription ? "SUB" : "ORD"; // Use a prefix to indicate if it's a subscription order or a normal order
  const timestamp = moment().format("MMDD"); // Use the last 6 digits of the current timestamp as part of the order ID
  const random = Math.floor(Math.random() * 1000)
    .toString()
    .padStart(3, "0"); // Generate a random 3-digit number and pad it with zeroes if necessary

  return `${prefix}-${timestamp}-${random}`;
};

module.exports = {
  emailVerificationLimit,
  passwordVerificationLimit,
  formatAmountForStripe,
  generateOrderId,
};
