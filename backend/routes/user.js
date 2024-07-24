const express = require("express");
const { createUser, loginUser } = require("../controllers/user");
const router = express.Router();

router.post("/create", createUser);
router.get("/login", loginUser);

module.exports = router;
