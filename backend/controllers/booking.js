const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const twilio = require("twilio");
const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const mynumber = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authToken);

module.exports.bookService = async (req, res, next) => {
  console.log("entered booking controller");
  const { serviceProviderId, bookingDate } = req.body;
  console.log(serviceProviderId, bookingDate);
  const userId = req.user.id;
  console.log(userId);

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { address: true },
    });

    if (!user || !user.address) {
      return res.status(400).json({ message: "User address not found." });
    }

    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: userId,
        serviceProviderId: serviceProviderId,
        bookingDate: bookingDate,
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "You have already booked this service provider for this date.",
      });
    }

    console.log("address is ", user.address);

    console.log("Creating conversation with", { userId, serviceProviderId });

    const conversation = await prisma.conversation.create({
      data: {
        userId: userId,
        providerId: serviceProviderId,
      },
    });

    console.log(conversation);

    const otp = Math.floor(100000 + Math.random() * 900000);

    const newBooking = await prisma.booking.create({
      data: {
        userId: userId,
        serviceProviderId: serviceProviderId,
        bookingDate: bookingDate,
        bookingStatus: "PENDING",
        address: user.address,
        conversationId: conversation.id,
        otp: otp.toString(),
      },
    });

    console.log("new booking is ", newBooking);

    const serviceProvider = await prisma.serviceProvider.findUnique({
      where: { id: serviceProviderId },
      select: { name: true, mobilenumber: true },
    });

    if (serviceProvider) {
      console.log("-----------------------------------------");
      console.log(serviceProvider.name);
      console.log(newBooking.address);
      console.log(newBooking.bookingDate);
      console.log(serviceProvider.mobilenumber);

      // await client.messages.create({
      //   body: `Hello ${serviceProvider.name}, you have a new booking from Taskmasters!
      //         Details:
      //         - Customer Address: ${newBooking.address}
      //         - Booking Date: ${newBooking.bookingDate}
      //         Please log in to your account to view more details and manage the booking.

      //         Thank you for using Taskmasters!`,
      //   to: `+91${serviceProvider.mobilenumber}`,
      //   from: mynumber,
      // });
    } else {
      console.error("Service provider not found");
    }

    res.status(201).json({
      booking: newBooking,
      otp: otp,
      message: "Booking successful.",
    });
  } catch (error) {
    console.error("Error booking service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.verifyOtp = async (req, res) => {
  console.log("verifying OTP ");
  try {
    const { bookingId, otp } = req.body;
    console.log("Received Booking ID:", bookingId);
    console.log("Received OTP:", otp);

    if (!bookingId || !otp) {
      return res
        .status(400)
        .json({ message: "Booking ID and OTP are required." });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { user: true },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found." });
    }

    console.log("Database OTP:", booking.otp);

    if (String(booking.otp).trim() !== String(otp).trim()) {
      console.log("OTP mismatch");
      return res
        .status(400)
        .json({ message: "Invalid OTP. Please try again." });
    }

    const userPhoneNumber = booking.user.mobilenumber;
    const msg =
      "Your OTP has been successfully verified for booking. The service provider can now proceed";

    // await client.messages.create({
    //   body: msg,
    //   from: mynumber,
    //   to: userPhoneNumber,
    // });

    console.log("OTP verification successful");
    await prisma.booking.update({
      where: { id: bookingId },
      data: { isVerified: true },
    });

    return res.status(200).json({
      verified: true,
      message: "OTP verified successfully. User has been notified.",
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res
      .status(500)
      .json({ message: "An error occurred while verifying OTP." });
  }
};

module.exports.getAllBookings = async (req, res, next) => {
  const userId = req.user.id;
  console.log(userId);

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      include: {
        serviceProvider: true,
      },
    });

    console.log(bookings);
    res.status(200).json({
      bookings: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getBookingDetails = async (req, res, next) => {
  console.log("entered booking details controller");
  const { bookingId } = req.query;
  console.log(bookingId);

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: { serviceProvider: true, user: true },
    });

    console.log(booking);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.status(200).json({
      booking: booking,
    });
  } catch (error) {
    console.error("Error fetching booking details:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.cancelService = async (req, res, next) => {
  const { id } = req.params;

  try {
    const booking = await prisma.booking.delete({
      where: { id: id },
    });

    res.status(200).json({
      message: "Service cancelled successfully",
      booking: booking,
    });
  } catch (error) {
    console.error("Error canceling service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getProviderBookings = async (req, res, next) => {
  try {
    const providerId = req.user.id;

    const bookings = await prisma.booking.findMany({
      where: { serviceProviderId: providerId },
      include: {
        user: {
          select: {
            name: true,
            mobilenumber: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching bookings" });
  }
};

module.exports.updateBookingStatus = async (req, res) => {
  const { bookingId } = req.body;
  const { bookingStatus } = req.body;

  try {
    const updatedBooking = await prisma.booking.update({
      where: { id: bookingId },
      data: { bookingStatus },
    });

    res.status(200).json(updatedBooking);
  } catch (error) {
    res.status(500).json({ error: "Failed to update booking status" });
  }
};
