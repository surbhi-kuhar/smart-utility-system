import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StarRating from "../../components/StarRating";
import { useNavigate } from "react-router-dom";
import Header from "../../components/Header";

function FetchBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [rating, setRating] = useState({ bookingId: "", value: 0, review: "" });
  const [ratingError, setRatingError] = useState("");
  const [existingRating, setExistingRating] = useState({});

  const [editMode, setEditMode] = useState({}); // State to manage edit mode
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "https://smart-utility-system.onrender.com/api/v1/booking/allbookings",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        setBookings(response.data.bookings);
        console.log(response.data.bookings);

        for (const booking of response.data.bookings) {
          if (booking.bookingStatus === "COMPLETED") {
            try {
              const ratingResponse = await axios.post(
                "https://smart-utility-system.onrender.com/api/v1/rating/getrating",
                {
                  serviceProviderId: booking.serviceProvider.id,
                },
                {
                  headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                  },
                }
              );

              if (ratingResponse.data.prevRating) {
                setExistingRating((prev) => ({
                  ...prev,
                  [booking.id]: ratingResponse.data.prevRating,
                }));
              }
            } catch (ratingError) {
              console.error("Error fetching rating:", ratingError);
            }
          }
        }
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching bookings");
      }
    };

    fetchBookings();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(
        `https://smart-utility-system.onrender.com/api/v1/booking/cancel/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );

      alert("Booking canceled successfully!");
      setBookings((prevBookings) =>
        prevBookings.filter((booking) => booking.id !== bookingId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error canceling booking");
    }
  };

  const handleRatingSubmit = async (booking) => {
    if (!rating.value) {
      setRatingError("Please select a rating.");
      return;
    }

    try {
      if (existingRating[booking.id]) {
        await axios.post(
          "https://smart-utility-system.onrender.com/api/v1/rating/update",
          {
            ratingId: existingRating[booking.id].id,
            rating: rating.value,
            review: rating.review,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        alert("Rating updated successfully!");
      } else {
        await axios.post(
          "https://smart-utility-system.onrender.com/api/v1/rating/rate",
          {
            serviceProviderId: booking.serviceProvider.id,
            rating: rating.value,
            review: rating.review,
          },
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );
        alert("Rating submitted successfully!");
      }

      const ratingResponse = await axios.post(
        "https://smart-utility-system.onrender.com/api/v1/rating/getrating",
        {
          serviceProviderId: booking.serviceProvider.id,
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      if (ratingResponse.data.prevRating) {
        setExistingRating((prev) => ({
          ...prev,
          [booking.id]: ratingResponse.data.prevRating,
        }));
      }
      setRating({ bookingId: "", value: 0, review: "" });
      setRatingError("");
      setEditMode((prev) => ({ ...prev, [booking.id]: false }));
    } catch (err) {
      setRatingError(err.response?.data?.message || "Error submitting rating");
    }
  };

  const handleMarkAsCompleted = async (bookingId) => {
    try {
      const token = Cookies.get("token");
      await axios.post(
        "https://smart-utility-system.onrender.com/api/v1/booking/updatestatus",
        // "http://localhost:3300/api/v1/booking/updatestatus",
        { bookingId, bookingStatus: "COMPLETED" },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update booking status in the state
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking.id === bookingId
            ? { ...booking, bookingStatus: "COMPLETED" }
            : booking
        )
      );
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to update booking status.";
      setError(errorMessage);
    }
  };

  const handleEditClick = (bookingId) => {
    setEditMode((prev) => ({ ...prev, [bookingId]: true }));
    const ratingData = existingRating[bookingId];
    if (ratingData) {
      setRating({
        bookingId: bookingId,
        value: ratingData.rating,
        review: ratingData.review,
      });
    }
  };

  const handleStartChat = ({ bookingId, booking }) => {
    if (bookingId && booking) {
      const conversationId = booking.conversationId;
      const userId = booking.userId;
      const providerId = booking.serviceProviderId;

      navigate(`/chat`, {
        state: { bookingId, conversationId, userId },
      });
    } else {
      setError("Missing required information to start the chat.");
    }
  };

  return (
    <div>
      <Header />
      <div className="container mx-auto px-4 py-24">
        <h2 className="text-3xl font-bold mb-6 text-center">My Bookings</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {ratingError && (
          <p className="text-red-500 mb-4 text-center">{ratingError}</p>
        )}
        {bookings.length > 0 ? (
          <ul className="space-y-4">
            {bookings.map((booking) => (
              <li
                key={booking.id}
                className="p-6 border rounded-lg shadow-lg bg-white"
              >
                <p className="text-lg">
                  <strong>Service Provider:</strong>{" "}
                  {booking.serviceProvider.name}
                </p>
                <p className="text-lg">
                  <strong>Service:</strong> {booking.serviceProvider.service}
                </p>
                <p className="text-lg">
                  <strong>Booking Date:</strong>{" "}
                  {new Date(booking.bookingDate).toLocaleDateString()}
                </p>
                <p className="text-lg">
                  <strong>Booking Status:</strong> {booking.bookingStatus}
                </p>
                {booking.bookingStatus === "PENDING" && (
                  <p className="text-lg mt-2">
                    <strong>OTP:</strong> {booking.otp}
                  </p>
                )}

                {booking.bookingStatus === "PENDING" && (
                  <>
                    <button
                      onClick={() => handleCancelBooking(booking.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg mt-4"
                    >
                      Cancel Booking
                    </button>
                    <button
                      className="px-4 py-2 bg-blue-300 text-white rounded-lg mt-4 ml-3"
                      onClick={() =>
                        handleStartChat({ bookingId: booking.id, booking })
                      }
                    >
                      Start a chat
                    </button>
                  </>
                )}
                {booking.bookingStatus === "COMPLETED" && (
                  <div className="mt-4">
                    {editMode[booking.id] ? (
                      <>
                        <div className="flex items-center mb-2">
                          <label
                            className="block text-lg font-semibold"
                            htmlFor={`rating-${booking.id}`}
                          >
                            Rate the Service:
                          </label>
                          <StarRating
                            value={rating.value}
                            onChange={(value) =>
                              setRating({ ...rating, value })
                            }
                            className="ml-4"
                          />
                        </div>
                        <textarea
                          value={rating.review}
                          onChange={(e) =>
                            setRating({
                              ...rating,
                              review: e.target.value,
                            })
                          }
                          placeholder="Write a review (optional)"
                          className="w-full p-2 border rounded mb-2"
                          rows="3"
                        ></textarea>
                        <button
                          onClick={() => handleRatingSubmit(booking)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                        >
                          {existingRating[booking.id]
                            ? "Edit Rating & Review"
                            : "Submit Rating & Review"}
                        </button>
                        <button
                          onClick={() =>
                            setEditMode((prev) => ({
                              ...prev,
                              [booking.id]: false,
                            }))
                          }
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg ml-4"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <div className="flex items-center mb-2">
                          <label
                            className="block text-lg font-semibold"
                            htmlFor={`rating-${booking.id}`}
                          >
                            Rate the Service:
                          </label>
                          <StarRating
                            value={existingRating[booking.id]?.rating || 0}
                            onChange={() => {}}
                            readOnly
                            className="ml-4"
                          />
                        </div>
                        {existingRating[booking.id]?.review && (
                          <p className="text-gray-700 italic">
                            {existingRating[booking.id].review}
                          </p>
                        )}
                        <button
                          onClick={() => handleEditClick(booking.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-4"
                        >
                          {existingRating[booking.id]
                            ? "Edit Rating & Review"
                            : "Rate Now"}
                        </button>
                      </>
                    )}
                  </div>
                )}

                {booking.isVerified && booking.bookingStatus === "PENDING" && (
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg mt-4"
                    onClick={() => handleMarkAsCompleted(booking.id)}
                  >
                    Mark as Completed
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-lg text-gray-600">
            You have no bookings yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default FetchBookings;
