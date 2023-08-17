const Reviews = require("../models/Reviews");
const Products = require("../models/Products");
//
const listAllReviews = async (req, res) => {
  try {
    const allReviews = await Reviews.find({});

    // Fetch product details for each review
    const reviewsWithProductNames = await Promise.all(
      allReviews.map(async (review) => {
        const product = await Products.findById(review.productId);
        return {
          ...review.toObject(),
          productName: product?.productName,
        };
      })
    );

    // console.log(reviewsWithProductNames);

    res.status(200).send(reviewsWithProductNames);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const changeReviewStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const review = await Reviews.findById(id);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    review.isApproved = !review.isApproved;
    await review.save();

    res.status(200).json({ message: "Review status updated successfully" });
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

const listApprovedReviews = async (req, res) => {
  try {
    const approvedReviewseview = await Reviews.find({ isApproved: true });

    res.status(200).send(approvedReviewseview);
  } catch (error) {
    res.status(500).send({
      message: error.message,
    });
  }
};

module.exports = {
  listAllReviews,
  changeReviewStatus,
  listApprovedReviews,
};
