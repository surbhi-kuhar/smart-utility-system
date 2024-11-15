import React, { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const PaymentModal = ({ platformFee, onClose, onPaymentSuccess }) => {
  console.log("platformfee", platformFee, typeof platformFee);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePayment = async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.post(
        "http://localhost:3300/api/v1/payment/create-payment-intent",
        { amount: platformFee },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      const options = {
        key: "rzp_test_VeEIvsiw6p18Gx",
        amount: platformFee * 100,
        currency: "INR",
        name: "Taskmaster",
        description: "Service Payment",
        order_id: data.orderId,
        handler: function () {
          alert("Payment successful");
          onPaymentSuccess();
        },
        theme: {
          color: "#3399cc",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function (response) {
        // Log the error description to the console
        console.log("Payment failed:", response.error.description);
        setError(`Payment failed: ${response.error.description || "Error"}`);
      });

      rzp.open();
    } catch (err) {
      setError("Failed to initialize payment. Please try again.");
      console.error("Error initializing payment:", err); // Log initialization error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md text-center">
        <h2 className="text-lg font-bold mb-2">Complete Payment</h2>
        {error && <p className="text-red-500 mb-2">{error}</p>}
        <p className="mb-4">Platform Fee: ₹{platformFee}</p>
        <button
          onClick={handlePayment}
          disabled={loading}
          className="bg-blue-500 text-white py-2 px-4 rounded mt-4"
        >
          {loading ? "Processing..." : "Pay Now"}
        </button>
        <button onClick={onClose} className="mt-2 text-sm text-gray-500">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default PaymentModal;
