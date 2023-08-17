const Promotion = require("../models/Promotion");

const getActivePromotions = async (req, res) => {
  try {
    const propmotion = await Promotion.findOne({ isActive: true });

    res.status(200).json(propmotion);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const getAllPromotions = async (req, res) => {
  try {
    const propmotion = await Promotion.find();

    res.status(200).json(propmotion);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const createPromotion = async (req, res) => {
  try {
    const { name, image } = req.body;
    // Set isActive to true for the new promotion
    const newPromotion = new Promotion({
      name,
      image,
      isActive: true,
    });

    // Mark all other promotions as inactive
    await Promotion.updateMany(
      { isActive: true },
      { $set: { isActive: false } }
    );

    // Save the new promotion
    const savedPromotion = await newPromotion.save();

    res.status(200).json(savedPromotion);
  } catch (err) {
    res.status(500).send({
      message: err.message,
    });
  }
};

const deletePromotion = async (req, res) => {
  try {
    const { id } = req.params;

    Promotion.deleteOne({ _id: id }, (err) => {
      if (err) {
        res.status(500).send({
          message: err.message,
        });
      } else {
        res.status(200).send({
          message: "Promotion Deleted Successfully!",
        });
      }
    });
  } catch (error) {
    res.status(500).send({
      message: err.message,
    });
  }
};

module.exports = {
  getActivePromotions,
  getAllPromotions,
  createPromotion,
  deletePromotion,
};
