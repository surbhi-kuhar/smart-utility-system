const express = require("express");
const {
  bookService,
  getBookingDetails,
  getAllBookings,
  cancelService,
  getProviderBookings,
  updateBookingStatus,
  verifyOtp,
} = require("../controllers/booking");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/book", authenticateToken, bookService);
router.post("/verifyotp", authenticateToken, verifyOtp);
router.post("/updatestatus", authenticateToken, updateBookingStatus);
router.get("/allbookings", authenticateToken, getAllBookings);
router.get("/getbooking", authenticateToken, getBookingDetails);
router.get("/getproviderbookings", authenticateToken, getProviderBookings);
router.delete("/cancel/:id", authenticateToken, cancelService);

module.exports = router;
