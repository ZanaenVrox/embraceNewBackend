const express = require("express");
const router = express.Router();
const { OrderProcedeMail } = require("../controller/EmailControllers");

router.post("/order_procede_mail", OrderProcedeMail);

module.exports = router;
