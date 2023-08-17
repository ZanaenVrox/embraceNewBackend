const express = require("express");
const router = express.Router();
const {
  getAllOrders,
  getOrderById,
  getOrderByUser,
  updateOrder,
  deleteOrder,
  bestSellerProductChart,
  getDashboardOrders,
  addOrderParcelId,
  addOrderRejectionReason,
  updateStatus,
  updateSwyftStatus,
  updateSwyftOrderStatus,
  updateSwyftOrderTracking
} = require("../controller/orderController");

//get all orders
router.get("/", getAllOrders);


router.get("/updateSwyftStatus", updateSwyftStatus);

router.post("/updateSwyftOrderTracking/:oid/", updateSwyftOrderTracking);
router.post("/updateSwyftOrderStatus/:oid/:tr", updateSwyftOrderStatus);


// get dashboard orders data
router.get("/dashboard", getDashboardOrders);

// chart data for product
router.get("/best-seller/chart", bestSellerProductChart);

//get all order by a user
router.get("/user/:id", getOrderByUser);

//get a order by id
router.get("/:id", getOrderById);

//update a order
router.put("/status/:id", updateStatus);
//update a order
router.put("/:id", updateOrder);

//delete a order
router.delete("/:id", deleteOrder);

//add parcel id to orders
router.put("/parcel/:id", addOrderParcelId);

//add parcel id to orders
router.put("/rejection/:orderId", addOrderRejectionReason);

module.exports = router;
