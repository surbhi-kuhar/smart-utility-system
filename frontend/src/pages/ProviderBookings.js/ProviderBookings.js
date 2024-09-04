import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ProviderHeader from "../../components/ProviderHeader";

function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [editStatus, setEditStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
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

  const handleUpdateClick = (bookingId, currentStatus) => {
    setEditStatus(bookingId);
    setSelectedStatus(currentStatus);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
  };

  const handleUpdateStatus = async (bookingId) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        `http://localhost:3300/api/v1/booking/updatestatus`,
        { bookingId, bookingStatus: selectedStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, bookingStatus: selectedStatus }
            : booking
        )
      );

      setEditStatus(null);
    } catch (err) {
      setError("Failed to update booking status.");
    }
  };

  return (
    <>
      <ProviderHeader />
      <div className="min-h-screen bg-gray-100 p-4">
        <div className="bg-white shadow-lg rounded-lg p-6 sm:p-8 md:p-10 max-w-4xl mx-auto mt-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
            Your Bookings
          </h2>
          {error && <div className="text-red-500 text-sm mt-4">{error}</div>}
          <div className="mt-6 overflow-x-auto">
            {bookings.length === 0 ? (
              <p>No bookings available.</p>
            ) : (
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-sm sm:text-base">
                      Customer Name
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-sm sm:text-base">
                      Mobile Number
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-sm sm:text-base">
                      Address
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-sm sm:text-base">
                      Booking Date
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-sm sm:text-base">
                      Status
                    </th>
                    <th className="border border-gray-300 px-2 sm:px-4 py-2 text-sm sm:text-base">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr key={booking.id}>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {booking.user.name}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {booking.user.mobilenumber}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {booking.user.address}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {booking.bookingDate}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {editStatus === booking.id ? (
                          <select
                            value={selectedStatus}
                            onChange={handleStatusChange}
                            className="border rounded-md px-2 py-1 text-sm"
                          >
                            <option value="PENDING">Pending</option>
                            <option value="COMPLETED">Completed</option>
                          </select>
                        ) : (
                          booking.bookingStatus
                        )}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {editStatus === booking.id ? (
                          <button
                            onClick={() => handleUpdateStatus(booking.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Update
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              handleUpdateClick(
                                booking.id,
                                booking.bookingStatus
                              )
                            }
                            className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Update Status
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default ProviderBookings;
