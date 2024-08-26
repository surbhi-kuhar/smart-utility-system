import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StarRating from "../../components/StarRating"; // Import the StarRating component

function FetchBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [rating, setRating] = useState({ bookingId: "", value: 0 });
  const [ratingError, setRatingError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3300/api/v1/booking/allbookings",
          {
            headers: {
              Authorization: `Bearer ${Cookies.get("token")}`,
            },
          }
        );

        console.log(response.data.bookings);
        setBookings(response.data.bookings);
      } catch (err) {
        setError(err.response?.data?.message || "Error fetching bookings");
      }
    };

    fetchBookings();
  }, []);

  const handleRatingSubmit = async (booking) => {
    if (!rating.value) {
      setRatingError("Please select a rating.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:3300/api/v1/rating/rate`,
        {
          serviceProviderId: booking.serviceProvider.id,
          rating: rating.value
        },
        {
          headers: {
            Authorization: `Bearer ${Cookies.get("token")}`,
          },
        }
      );
      setRating({ bookingId: "", value: 0 });
      setRatingError("");
      alert("Rating submitted successfully!");
    } catch (err) {
      setRatingError(err.response?.data?.message || "Error submitting rating");
    }
  };

  return (
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
              {booking.bookingStatus === "COMPLETED" && (
                <div className="mt-4">
                  <label
                    className="block text-lg font-semibold mb-2"
                    htmlFor={`rating-${booking.id}`}
                  >
                    Rate the Service:
                  </label>
                  <StarRating
                    value={rating.bookingId === booking.id ? rating.value : 0}
                    onChange={(value) =>
                      setRating({ bookingId: booking.id, value })
                    }
                  />
                  <button
                    onClick={() => handleRatingSubmit(booking)}
                    className="ml-4 mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  >
                    Submit Rating
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-700 text-center">No bookings found.</p>
      )}
    </div>
  );
}

export default FetchBookings;
