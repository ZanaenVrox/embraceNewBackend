const express = require("express");
const router = express.Router();

const {
  getActivePromotions,
  getAllPromotions,
  createPromotion,
  deletePromotion,
} = require("../controller/promotionController");

router.get("/active", getActivePromotions);

router.get("/all", getAllPromotions);

router.post("/add", createPromotion);

router.delete("/delete/:id", deletePromotion);

module.exports = router;
