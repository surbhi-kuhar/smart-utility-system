const express = require("express");
const {
    getlocation
} = require("../controllers/location");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/locate", authenticateToken, getlocation);

module.exports = router;
