const express = require("express");
const {
  createProvider,
  loginProvider,
  updateProvider,
  deleteProvider,
  getServiceProviders,
} = require("../controllers/serviceprovider");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/create", createProvider);
router.get("/login", loginProvider);
router.post("/update/:id", authenticateToken, updateProvider);
router.delete("/delete/:id", authenticateToken, deleteProvider);
router.get("/service/:service",getServiceProviders);

module.exports = router;
