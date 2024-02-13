const express = require("express");
const router = express.Router();
const {
  getmonthlyOrders,
  monthlyCombinedStats,
  getmonthlyCustomers,
  getmonthlySubscriptions,
  getDailyOrders,
  getDailyCustomers,
  getDailySubscriptions,
  getmonthlyOrdersProducts,
  getmonthlyOrdersCities,
  getskuTrends,
  recurringOrders,
  getOrdersStatuses,
  getTopTenCities,
  getMostlyUserSymptoms,
  promoCodeReport,
  CustomerRetentionAndAcquisitionReport,
} = require("../controller/reportsController");

router.post("/monthlyCombinedStats", monthlyCombinedStats);
router.post("/monthlyOrdersStats", getmonthlyOrders);
router.post("/monthlyrecurringOrders", recurringOrders);

router.post("/OrdersStatusesStats", getOrdersStatuses);

router.post("/monthlyCustomerStats", getmonthlyCustomers);
router.post("/monthlySubscriptionStats", getmonthlySubscriptions);
router.post("/monthlyOrdersProductsStats", getmonthlyOrdersProducts);

router.post("/skuTrends", getskuTrends);

router.post("/monthlyOrdersCitiesStats", getmonthlyOrdersCities);

router.post("/dailyOrdersStats", getDailyOrders);
router.post("/dailyCustomersStats", getDailyCustomers);
router.post("/dailySubscriptionsStats", getDailySubscriptions);

router.post("/topTenCities", getTopTenCities);

router.get("/topSumptoms", getMostlyUserSymptoms);

router.get("/promoCodeReport", promoCodeReport);

router.get(
  "/customer-retention-and-acquisition-report",
  CustomerRetentionAndAcquisitionReport
);

//router.get("/status/:id", changeCityStatus);

module.exports = router;
