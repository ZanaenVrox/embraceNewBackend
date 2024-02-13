const express = require("express");
const router = express.Router();
const {
    createReasons,
    getReasons,
    updateRejectionReason,
    deleteReason,
} = require("../controller/rejectionController");

router.post("/create", createReasons);

router.get("/all", getReasons);


router.put("/:id", updateRejectionReason);

router.delete("/:id", deleteReason);

module.exports = router;
