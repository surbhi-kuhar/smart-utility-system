const express = require("express");
const { createUser, loginUser, updateUser,deleteUser, logoutUser } = require("../controllers/user");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/update/:id", authenticateToken, updateUser);
router.delete("/delete/:id", authenticateToken, deleteUser);

module.exports = router;
