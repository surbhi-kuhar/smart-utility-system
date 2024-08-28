import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // Fetch bookings using token stored in cookies
        const token = Cookies.get("token");
        const response = await axios.get(
          "http://localhost:3300/api/v1/booking/getproviderbookings",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setBookings(response.data);
      } catch (err) {
        setError("Failed to fetch bookings");
      }
    };

    fetchBookings();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800">Your Bookings</h2>
        {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
        <div className="mt-6">
          {bookings.length === 0 ? (
            <p>No bookings available.</p>
          ) : (
            <table className="w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-4 py-2">
                    Customer Name
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Mobile Number
                  </th>
                  <th className="border border-gray-300 px-4 py-2">
                    Booking Date
                  </th>
                  <th className="border border-gray-300 px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.user.name}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.user.mobilenumber}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.bookingDate}
                    </td>
                    <td className="border border-gray-300 px-4 py-2">
                      {booking.bookingStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProviderBookings;
