const express = require("express");
const { getDistance } = require("../controllers/distance");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.get("/distancematrix", authenticateToken, getDistance);

module.exports = router;
