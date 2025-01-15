const dotenv = require("dotenv");
const twilio = require("twilio");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
dotenv.config();

const accountSid = process.env.ACCOUNT_SID;
const authToken = process.env.AUTH_TOKEN;
const mynumber = process.env.TWILIO_NUMBER;
const client = new twilio(accountSid, authToken);

module.exports.notify = async (req, res, next) => {
  const { bookingId, amount } = req.body;
  console.log("Booking ID:", bookingId);
  console.log("Amount to be paid:", amount);

  try {
    const booking = await prisma.booking.findUnique({
      where: { id: bookingId },
      include: {
        user: true,
      },
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // await client.messages.create({
    //   body: `Dear ${booking.user.name}, your payment of ₹${amount} is due for the service on ${booking.bookingDate}. Please contact your service provider for further details.`,
    //   to: `+91${booking.user.mobilenumber}`,
    //   from: mynumber,
    // });

    res.json({
      found: true,
      message: "Payment notification sent successfully",
    });
  } catch (err) {
    console.error("Error sending payment notification", err);
    res.status(500).json({ message: "Failed to send payment notification" });
  }
};
