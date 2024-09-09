const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

module.exports.getlocation = async (req, res, next) => {
  const { latitude, longitude, bookingId } = req.body;
  console.log(
    `Latitude: ${latitude}, Longitude: ${longitude}, Booking ID: ${bookingId}`
  );

  try {
    const booking = await prisma.booking.update({
      where: { id: bookingId },
      data: { latitude, longitude },
    });
    res.status(200).json({ message: "Location shared successfully!", booking });
  } catch (err) {
    console.error("Error while fetching address:", err);
    res.status(500).json({ message: "Error while processing location." });
  }
};
