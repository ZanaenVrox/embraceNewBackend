const express = require("express");
const router = express.Router();
const {
  listAllReviews,
  changeReviewStatus,
  listApprovedReviews,
} = require("../controller/reviewsController");

router.get("/listAllReviews", listAllReviews);

router.get("/status/:id", changeReviewStatus);

module.exports = router;
