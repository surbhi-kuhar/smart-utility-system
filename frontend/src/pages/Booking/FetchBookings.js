import React, { useState, useEffect } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import StarRating from "../../components/StarRating";

function FetchBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [rating, setRating] = useState({ bookingId: "", value: 0, review: "" });
  const [ratingError, setRatingError] = useState("");
  const [existingRating, setExistingRating] = useState({});
  const [editMode, setEditMode] = useState({}); // State to manage edit mode

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

        // Fetch existing ratings for completed bookings
        for (const booking of response.data.bookings) {
          if (booking.bookingStatus === "COMPLETED") {
            try {
              const ratingResponse = await axios.get(
                "http://localhost:3300/api/v1/rating/getrating",
                {
                  serviceProviderId: booking.serviceProvider.id,
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

  const handleRatingSubmit = async (booking) => {
    if (!rating.value) {
      setRatingError("Please select a rating.");
      return;
    }

    try {
      if (existingRating[booking.id]) {
        // Update existing rating
        await axios.post(
          "http://localhost:3300/api/v1/rating/update",
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

        // Refresh the rating after update
        const ratingResponse = await axios.get(
          "http://localhost:3300/api/v1/rating/getrating",
          {
            serviceProviderId: booking.serviceProvider.id,
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
      } else {
        // Submit new rating
        await axios.post(
          "http://localhost:3300/api/v1/rating/rate",
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

        // Fetch and update the latest rating
        const ratingResponse = await axios.get(
          "http://localhost:3300/api/v1/rating/getrating",
          {
            serviceProviderId: booking.serviceProvider.id,
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
      }
      setRating({ bookingId: "", value: 0, review: "" });
      setRatingError("");
      setEditMode((prev) => ({ ...prev, [booking.id]: false })); // Exit edit mode
    } catch (err) {
      setRatingError(err.response?.data?.message || "Error submitting rating");
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

  return (
    <>
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
                            className="ml-4"
                            readOnly
                          />
                        </div>
                        <textarea
                          value={
                            existingRating[booking.id]?.review || "No review"
                          }
                          readOnly
                          className="w-full p-2 border rounded mb-2"
                          rows="3"
                        ></textarea>
                        <button
                          onClick={() => handleEditClick(booking.id)}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg mt-2"
                        >
                          Edit Rating & Review
                        </button>
                      </>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-700 text-center">No bookings found.</p>
        )}
      </div>
    </>
  );
}

export default FetchBookings;
