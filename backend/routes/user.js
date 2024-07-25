const express = require("express");
const { createUser, loginUser, updateUser,deleteUser } = require("../controllers/user");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/create", createUser);
router.get("/login", loginUser);
router.post("/update/:id", authenticateToken, updateUser);
router.delete("/delete/:id", authenticateToken, deleteUser);

module.exports = router;
