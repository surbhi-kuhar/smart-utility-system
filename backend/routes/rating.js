const express = require("express");
const { authenticateToken } = require("../middleware");
const { rate, updateRating } = require("../controllers/rating");
const router = express.Router();

router.post("/rate", authenticateToken, rate);
router.post("/update", authenticateToken, updateRating);

module.exports = router;
