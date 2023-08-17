const express = require("express");
const router = express.Router();
const {
  couponAddtoCustomers,
  getPostsByCategory,
  getAllCategory,
  getPostsById,
  GetPostsBySingleCategory,
  Customerlogin,
  CustomersLastPeriodEnd,
  getProductByCategory,
  getProductsById,
  addNewOrder,
  getProductAll,
  createSubscription,
  deleteUser,
  createMenstrualCycle,
  nextCycle,
  Detail,
  Get,
  DaysLeft,
  favBlog,
  getFavBlogbyUserID,
  removeFavorite,
  getCycleHistorybyUserID,
  getCycleHistoryLast3byUserID,
  changeUsersStatus,
  getSymptoms,
  addSymptons,
  showSymptons,
  login,
  addLastPeriodDate,
  periodDateChecker,
  getAllBlogs,
  getAllProductsCategories,
  getAllProducts,
  couponCheck,
  symptonsDates,
  addAddress,
  getAddress,
  changeAddressStatus,
  getDefaultAddress,
  getActiveCities,
  getAddressById,
  updateAddressById,
  addPreviousCycle,
  getAllUserOrder,
  getOrderById,
  checkSubscrtiption,
  getSubscrtiption,
  editSubscription,
  changeSubscriptionStatus,
  getCustomerName,
  getUserById,
  getActivePromotions,
  editProfile,
  submitReview,
  getAllReviesofProduct,
  trackScreen,
} = require("../controller/appControllers");

const {
  createNotification,
  getNotification,
} = require("../controller/NotificationController");

const {
  exposendPushNotification,
} = require("../pushnotifications/expoNotifications");

const { isAuth } = require("../config/auth");

router.post("/pushNote", exposendPushNotification);

// Get All Posts BY Category
router.get("/post_by_category", getPostsByCategory);

// Get All Categories
router.get("/category", getAllCategory);

// Get All Products Category
router.get("/products/category", getAllProductsCategories);

// Get All Posts
router.get("/all_posts", getAllBlogs);

// Get All Posts
router.get("/all_products", getAllProducts);

// Get Post of Single Category
router.get("/post_of_category/:category", GetPostsBySingleCategory);

// GET Post By Id
router.get("/post_by_id/:id", getPostsById);

/// get customer name from id
router.get("/customer/:id", getCustomerName);

// Customer Login
router.post("/login", login);

// Customer Login
router.post("/addLastPeriodDate", addLastPeriodDate);

// Customer Period End Data
router.put("/period_end_data/:id", CustomersLastPeriodEnd);

// Get Product By Category
router.get("/product_by_category/:category", getProductByCategory);

// Get Product By Id
router.get("/product_by_id/:id", getProductsById);

// Place Order
router.post("/place_order", addNewOrder);

// All Products
router.get("/all_product", getProductAll);

// Create SubScription
router.post("/create_subscription", createSubscription);

// Delete Customer
router.delete("/delete_customer/:id", deleteUser);

router.post("/add_to_fav/:userid", favBlog);

router.post("/remove_fav/:userid", removeFavorite);

router.get("/get_fav/:userid", getFavBlogbyUserID);

router.get("/get_cycle_history/:userid", getCycleHistorybyUserID);

router.get("/get_cycle_history_last/:userid", getCycleHistoryLast3byUserID);

router.post("/createNotification", createNotification);

router.get("/getNotification/:userId", getNotification);

router.get("/change_customer_status/:userId", changeUsersStatus);

router.get("/getAllSymptoms", getSymptoms);

router.post("/mark_symptom/:user_id", addSymptons);

router.post("/show_symptom/:user_id", showSymptons);

// menstrualRoutes
router.post("/menstrualRoutes/create", createMenstrualCycle);
router.post("/menstrualRoutes/nextCycle/:user_id", nextCycle);
router.get("/menstrualRoutes/daysLeft/:current_date/:user_id", DaysLeft);
router.get("/menstrualRoutes/all", Get);
router.get("/menstrualRoutes/details", Detail);

router.post("/periodDateChecker", periodDateChecker);

router.post("/couponCheck", couponCheck);

router.get("/symptonsDates/:user_id", symptonsDates);

router.post("/addAddress", addAddress);

router.get("/getAddress/:user_id", getAddress);

router.post("/changeAddressStatus", changeAddressStatus);

router.get("/getDefaultAddress/:user_id", getDefaultAddress);

router.get("/getActiveCities", getActiveCities);

router.get("/getAddressById/:id", getAddressById);

router.put("/updateAddressById/:id", updateAddressById);

router.post("/addPreviousCycle", addPreviousCycle);

router.get("/getAllUserOrder/:userid", getAllUserOrder);

router.get("/getOrderById/:id", getOrderById);

router.get("/getUserById/:id", getUserById);

router.get("/checkSubscrtiption/:userId", checkSubscrtiption);

router.get("/getSubscrtiption/:userId", getSubscrtiption);

router.put("/editSubscription/:id", editSubscription);

router.get("/subscription/status/:id", changeSubscriptionStatus);

router.post("/couponAddtoCustomers", couponAddtoCustomers);

router.get("/getActivePromotions", getActivePromotions);

router.put("/editProfile/:customerId", editProfile);

router.post("/submitReview", submitReview);

router.get("/getAllReviesofProduct/:productId", getAllReviesofProduct);

router.post("/track-activity", trackScreen);

module.exports = router;
