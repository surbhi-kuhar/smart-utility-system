const express = require("express");
const { authenticateToken } = require("../middleware");
const { notify } = require("../controllers/paymentNotify");
const router = express.Router();

router.post("/pay", authenticateToken, notify);

module.exports = router;
