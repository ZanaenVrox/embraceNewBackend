const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerUser,
  signUpWithProvider,
  verifyEmailAddress,
  forgetPassword,
  changePassword,
  resetPassword,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCustomerByCategory,
  PercentagegetCustomerByCategory,
  inactvepercentage,
  graphPercentage,
  graphpercentagecycle,
  graphpercentageorders
} = require("../controller/customersController");
const {
  passwordVerificationLimit,
  emailVerificationLimit,
} = require("../config/others");

//verify email
router.post("/verify-email", emailVerificationLimit, verifyEmailAddress);

//register a user
router.post("/register/:token", registerUser);

//login a user
router.post("/login", loginUser);

//register or login with google and fb
router.post("/signup", signUpWithProvider);

//forget-password
router.put("/forget-password", passwordVerificationLimit, forgetPassword);

//reset-password
router.put("/reset-password", resetPassword);

//change password
router.post("/change-password", changePassword);

//get all user
router.get("/", getAllUsers);

//get all user
router.get("/all", getCustomerByCategory);


router.get("/allpercentage", PercentagegetCustomerByCategory);
router.get("/inactvepercentage", inactvepercentage);

router.get("/graphpercentagesymptons", graphPercentage);
router.get("/graphpercentagecycle", graphpercentagecycle);
router.get("/graphpercentageorders", graphpercentageorders);
//get a user
router.get("/:id", getUserById);

//update a user
router.put("/:id", updateUser);

//delete a user
router.delete("/:id", deleteUser);

module.exports = router;
