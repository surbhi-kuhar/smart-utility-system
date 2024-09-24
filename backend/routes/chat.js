const express = require("express");
const { convo } = require("../controllers/chat");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/conversation", authenticateToken, convo);

module.exports = router;
