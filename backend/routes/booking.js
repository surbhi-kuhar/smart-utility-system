const express = require("express");
const {
  bookService,
  getBookingDetails,
  getAllBookings,
  cancelService,
  getProviderBookings,
} = require("../controllers/booking");
const { authenticateToken } = require("../middleware");
const router = express.Router();

router.post("/book", authenticateToken, bookService);
router.get("/allbookings", authenticateToken, getAllBookings);
router.get("/getbooking", authenticateToken, getBookingDetails);
router.get("/getproviderbookings",authenticateToken,getProviderBookings);
router.delete("/cancel/:id", authenticateToken, cancelService);

module.exports = router;
