const Razorpay = require("razorpay");
const dotenv = require("dotenv");
dotenv.config();

module.exports.payment = async (req, res) => {
  console.log("entered payment");

  const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_SECRET_KEY,
  });

  const { amount } = req.body;

  try {
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // Amount should be in paise, so multiplying by 100
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpayInstance.orders.create(options);
    console.log("Order created successfully", order);

    res.status(200).json({
      orderId: order.id,
      currency: order.currency,
      amount: order.amount / 100, // Converting back to INR
    });
  } catch (err) {
    console.error("Error creating order", err);
    res
      .status(500)
      .json({ message: "Error creating order", error: err.message });
  }
};
