import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import ProviderHeader from "../../components/ProviderHeader";
import { useNavigate } from "react-router-dom"; // Import useNavigate for navigation

function ProviderBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [editStatus, setEditStatus] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [amounts, setAmounts] = useState({}); // To store the amount for each booking
  const [otpValues, setOtpValues] = useState({}); // To store OTP values for each booking

  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      const token = Cookies.get("token");
      const response = await axios.get(
        "https://smart-utility-system.onrender.com/api/v1/booking/getproviderbookings",
        // "http://localhost:3300/api/v1/booking/getproviderbookings",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setBookings(response.data);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch bookings.";
      setError(errorMessage);
    }
  };

  // Using polling to refresh bookings every 10 seconds
  useEffect(() => {
    // Fetching bookings immediately on component mount
    fetchBookings();

    // Set up polling
    const intervalId = setInterval(() => {
      fetchBookings(); // Fetch bookings every 10 seconds
    }, 10000); // 10000 ms = 10 seconds

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleUpdateClick = (bookingId, currentStatus) => {
    setEditStatus(bookingId);
    setSelectedStatus(currentStatus);
  };

  const handleOtpChange = (bookingId, value) => {
    setOtpValues((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
  };

  // const handleStatusChange = (e) => {
  //   setSelectedStatus(e.target.value);
  // };

  // const handleUpdateStatus = async (bookingId) => {
  //   try {
  //     const token = Cookies.get("token");
  //     await axios.post(
  //       "http://localhost:3300/api/v1/booking/updatestatus",
  //       { bookingId, bookingStatus: selectedStatus },
  //       {
  //         headers: { Authorization: `Bearer ${token}` },
  //       }
  //     );

  //     // Update booking status in the state
  //     setBookings((prevBookings) =>
  //       prevBookings.map((booking) =>
  //         booking.id === bookingId
  //           ? { ...booking, bookingStatus: selectedStatus }
  //           : booking
  //       )
  //     );

  //     setEditStatus(null);
  //   } catch (err) {
  //     const errorMessage =
  //       err.response?.data?.message || "Failed to update booking status.";
  //     setError(errorMessage);
  //   }
  // };

  const handleVerifyOtp = async (bookingId) => {
    const enteredOtp = otpValues[bookingId];
    if (!enteredOtp) {
      alert("Please enter an OTP.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        "https://smart-utility-system.onrender.com/api/v1/booking/verifyotp",
        // "http://localhost:3300/api/v1/booking/verifyotp",
        { bookingId, otp: enteredOtp },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.verified) {
        alert("OTP verified successfully. You can start the work now.");
        setOtpValues((prev) => ({
          ...prev,
          [bookingId]: "", // Clear the OTP input for the booking
        }));
      } else {
        alert("OTP verification failed. Please try again.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to verify OTP.";
      alert(errorMessage);
    }
  };


  const handleLocationShare = async (bookingId) => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const token = Cookies.get("token");
            await axios.post(
              "https://smart-utility-system.onrender.com/api/v1/location/locate",
              // "http://localhost:3300/api/v1/location/locate",
              {
                bookingId,
                latitude,
                longitude,
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            alert("Location shared successfully!");
          } catch (err) {
            const errorMessage =
              err.response?.data?.message || "Error sharing location.";
            alert(errorMessage);
          }
        },
        (error) => {
          console.error("Error getting location", error);
          alert("Failed to get location. Please check your location settings.");
        },
        options
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleStartChat = (booking) => {
    const { id, conversationId, userId, serviceProviderId } = booking;

    if (conversationId) {
      navigate("/chat", {
        state: { bookingId: id, conversationId, providerId: serviceProviderId },
      });
    } else {
      setError("Missing required information to start the chat.");
    }
  };

  const handleAmountChange = (bookingId, value) => {
    setAmounts((prev) => ({
      ...prev,
      [bookingId]: value,
    }));
  };

  const handleSendPaymentNotification = async (bookingId) => {
    const amount = amounts[bookingId];
    if (!amount) {
      alert("Please enter a valid amount.");
      return;
    }

    try {
      const token = Cookies.get("token");
      const response = await axios.post(
        "https://smart-utility-system.onrender.com/api/v1/notify/pay",
        // "http://localhost:3300/api/v1/notify/pay",
        { bookingId, amount }, // Include amount in the request
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.found) {
        setAmounts((prev) => ({
          ...prev,
          [bookingId]: "", // Clear the value for the specific booking
        }));

        // Display the success message
        alert("Payment notification sent successfully.");
      } else {
        alert("Failed to send payment notification.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to send payment notification.";
      alert(errorMessage);
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
                    {/* <th className="border border-gray-300 px-2 sm:px-4 py-2 text-sm sm:text-base">
                      Status
                    </th> */}
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
                        {booking.address}
                      </td>
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {booking.bookingDate}
                      </td>
                      {/* <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
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
                      </td> */}
                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        {booking.bookingStatus === "PENDING" && (
                          <>
                            {/* {editStatus === booking.id ? (
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
                                className="bg-yellow-500 text-white px-4 py-2 rounded-md text-sm mb-2"
                              >
                                Update Status
                              </button>
                            )} */}
                            <button
                              className="bg-green-500 text-white px-4 py-2 rounded-md text-sm mb-2"
                              onClick={() => handleLocationShare(booking.id)}
                            >
                              Share location
                            </button>
                            <button
                              className="bg-blue-300 text-white px-4 py-2 rounded-md text-sm mb-2"
                              onClick={() => handleStartChat(booking)} // Pass the whole booking object
                            >
                              Start a chat
                            </button>
                          </>
                        )}
                        {booking.bookingStatus === "COMPLETED" && (
                          <>
                            <input
                              type="number"
                              placeholder="Enter Amount"
                              value={amounts[booking.id] || ""}
                              onChange={(e) =>
                                handleAmountChange(booking.id, e.target.value)
                              }
                              className="border rounded-md px-2 py-1 mb-2 text-sm"
                            />
                            <button
                              onClick={() =>
                                handleSendPaymentNotification(booking.id)
                              }
                              disabled={!amounts[booking.id]} // Disable the button if no amount is entered
                              className={`bg-green-500 text-white px-4 py-2 rounded-md text-sm ${
                                !amounts[booking.id]
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                            >
                              Send Payment Notification
                            </button>
                          </>
                        )}
                      </td>

                      <td className="border border-gray-300 px-2 sm:px-4 py-2 text-sm">
                        <div className="flex flex-col space-y-2">
                          <input
                            type="number"
                            placeholder="Enter OTP"
                            value={otpValues[booking.id] || ""}
                            onChange={(e) =>
                              handleOtpChange(booking.id, e.target.value)
                            }
                            className="border rounded-md px-2 py-1 text-sm"
                          />
                          <button
                            onClick={() => handleVerifyOtp(booking.id)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm"
                          >
                            Verify OTP
                          </button>
                        </div>
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
