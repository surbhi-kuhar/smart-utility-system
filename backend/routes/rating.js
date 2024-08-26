const express = require("express");
const { authenticateToken } = require("../middleware");
const { rate, updateRating, getRating } = require("../controllers/rating");
const router = express.Router();

router.get("/getrating",authenticateToken,getRating);
router.post("/rate", authenticateToken, rate);
router.post("/update", authenticateToken, updateRating);

module.exports = router;
