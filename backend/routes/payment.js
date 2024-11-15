const express = require("express");
const { authenticateToken } = require("../middleware");
const router = express.Router();
const {payment} = require("../controllers/payment");

router.post("/create-payment-intent", authenticateToken, payment);

module.exports = router;
