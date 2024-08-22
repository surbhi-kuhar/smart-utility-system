const express = require("express");
const {
  createProvider,
  loginProvider,
  updateProvider,
  deleteProvider,
  getServiceProviders,
  findServiceProvider,
} = require("../controllers/serviceprovider");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/create", createProvider);
router.post("/login", loginProvider);
router.post("/update", authenticateToken, updateProvider);
router.delete("/delete", authenticateToken, deleteProvider);
router.get("/service/:service", getServiceProviders);
router.get("/find", authenticateToken, findServiceProvider);

module.exports = router;
