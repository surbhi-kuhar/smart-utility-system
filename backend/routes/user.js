const express = require("express");
const { createUser, loginUser, updateUser,deleteUser, logoutUser,findUser } = require("../controllers/user");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.get("/find",authenticateToken,findUser);
router.post("/create", createUser);
router.post("/login", loginUser);
router.post("/update", authenticateToken, updateUser);
router.delete("/delete", authenticateToken, deleteUser);

module.exports = router;
