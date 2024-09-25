const express = require("express");
const { convo, getMessages, storeMessage } = require("../controllers/chat");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/conversation", authenticateToken, convo);
router.get("/messages/:conversationId", authenticateToken, getMessages);
router.post("/message", authenticateToken, storeMessage);

module.exports = router;
