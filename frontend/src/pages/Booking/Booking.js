import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Header from "../../components/Header";

const BookingModal = ({ serviceProviderId, onClose }) => {
  const [bookingDate, setBookingDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleBooking = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3300/api/v1/booking/book",
        {
          serviceProviderId,
          bookingDate,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      console.log(response);
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Error booking service");
      setMessage("");
    }
  };

  return (
    <div>
      <Header />
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Book a Service
          </h2>
          {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
          {message && (
            <p className="text-green-500 mb-4 text-center">{message}</p>
          )}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Booking Date
            </label>
            <input
              type="date"
              value={bookingDate}
              onChange={(e) => setBookingDate(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleBooking}
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Book Service
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white font-semibold rounded-md hover:bg-gray-600"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
