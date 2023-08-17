const Coupon = require("../models/Coupon");
const dayjs = require("dayjs");
const utc = require("dayjs/plugin/utc");
dayjs.extend(utc);

const addCoupon = async (req, res) => {
  try {
    console.log(req.body);
    const newCoupon = new Coupon(req.body);
    await newCoupon.save();
    res.send({ message: "Coupon Added Successfully!" });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

const addAllCoupon = async (req, res) => {
  try {
    await Coupon.insertMany(req.body);
    res.status(200).send({
      message: "Coupon Added successfully!",
    });
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ _id: -1 });
    res.send(coupons);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getCouponById = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    res.send(coupon);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (coupon) {
      coupon.couponCode = req.body.couponCode;
      coupon.discountIn = req.body.discountIn;
      coupon.endTime = dayjs().utc().format(req.body.endTime);
      coupon.discountValue = req.body.discountValue;
      coupon.minimumAmount = req.body.minimumAmount;
      coupon.maximumUsage = req.body.maximumUsage;

      await coupon.save();
      res.send({ message: "Coupon Updated Successfully!" });
    }
  } catch (err) {
    res.status(404).send({ message: "Coupon not found!" });
  }
};

const deleteCoupon = (req, res) => {
  Coupon.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).send({
        message: err.message,
      });
    } else {
      res.status(200).send({
        message: "Coupon Deleted Successfully!",
      });
    }
  });
};

const useCoupon = (req, res) => {
  Coupon.findOne({ code: req.body.code }, (err, coupon) => {
    if (err) return res.status(400).json({ error: "Coupon not found" });
    if (coupon.status !== true)
      return res.status(400).json({ error: "Coupon is not active" });
    if (coupon.counter >= coupon.usageLimit)
      return res.status(400).json({ error: "Coupon usage limit reached" });

    coupon.counter += 1;
    if (coupon.counter === coupon.usageLimit) coupon.status = "inactive";
    coupon.save((err, updatedCoupon) => {
      if (err) return res.status(400).json({ error: "Coupon update failed" });
      return res
        .status(200)
        .json({ message: "Coupon used successfully", updatedCoupon });
    });
  });
};

const changeStatus = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    coupon.status = !coupon.status;
    await coupon.save();
    return res
      .status(200)
      .json({ message: "Coupon status updated successfully", coupon });
  } catch (err) {
    res.status(404).send({ message: "Coupon not found!" });
  }
};
const changeMultiUse = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    coupon.multi = !coupon.multi;
    await coupon.save();
    return res
      .status(200)
      .json({ message: "Coupon multi updated successfully", coupon });
  } catch (err) {
    res.status(404).send({ message: "Coupon not found!" });
  }
};

module.exports = {
  addCoupon,
  addAllCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  changeStatus,
  changeMultiUse,
};
