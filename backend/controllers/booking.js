const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.bookService = async (req, res, next) => {
  console.log("entered booking controller");
  const { serviceProviderId, bookingDate } = req.body;
  const userId = req.user.id;
  console.log(userId);

  try {
    const existingBooking = await prisma.booking.findFirst({
      where: {
        userId: userId,
        serviceProviderId: serviceProviderId,
        bookingDate: bookingDate, // Ensure bookingDate is in correct format
      },
    });

    if (existingBooking) {
      return res.status(409).json({
        message: "You have already booked this service provider for this date.",
      });
    }

    const bookingsOnDate = await prisma.booking.count({
      where: {
        serviceProviderId: serviceProviderId,
        bookingDate: bookingDate, // Ensure bookingDate is in correct format
      },
    });

    const maxBookingsPerDay = 10;

    if (bookingsOnDate >= maxBookingsPerDay) {
      return res.status(403).json({
        message: "The service provider is not available on this date.",
      });
    }

    // Create the new booking with status set to PENDING by default
    const newBooking = await prisma.booking.create({
      data: {
        userId: userId,
        serviceProviderId: serviceProviderId,
        bookingDate: bookingDate, // Ensure bookingDate is in correct format
        bookingStatus: "PENDING",
      },
    });

    console.log(newBooking);

    res.status(201).json({
      booking: newBooking,
      message: "Booking successful.",
    });
  } catch (error) {
    console.error("Error booking service:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getAllBookings = async (req, res, next) => {
  const userId = req.user.id;

  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: userId },
      include: { serviceProvider: true },
    });

    res.status(200).json({
      bookings: bookings,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports.getBookingDetails = async (req, res, next) => {
  const { id } = req.body;

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: id },
      include: { serviceProvider: true },
    });

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
    const providerId = req.user.id; // Get provider ID from the request (ensure you have middleware for authentication)

    // Fetch bookings where the serviceProviderId matches the provider's ID
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
      orderBy: { createdAt: "desc" }, // Order by date of creation
    });

    res.json(bookings);
  } catch (error) {
    console.error("Error fetching provider bookings:", error);
    res
      .status(500)
      .json({ error: "An error occurred while fetching bookings" });
  }
};
