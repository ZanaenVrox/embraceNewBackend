const express = require("express");
const router = express.Router();
const {
  createSubscription,
  subscriptionCheckerJob,
  getAllSubscriptions,
  getSubscriptionOfUser,
  editSubscription,
} = require("../controller/subscriptionController");

router.post("/add", createSubscription);

router.get("/show", subscriptionCheckerJob);

router.get("/all", getAllSubscriptions);

router.get("/user/:userId", getSubscriptionOfUser);

router.put("/editSubscription/:id", editSubscription);

module.exports = router;
