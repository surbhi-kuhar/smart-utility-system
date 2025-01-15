import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { Bars } from "react-loader-spinner"; // You can choose any other loader component
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Fixing the import statement
import Header from "../../components/Header";

function Location() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");
  const [time, setTime] = useState(""); // Store the travel time
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(true); // For managing loading state
  const [pollAttempts, setPollAttempts] = useState(0); // Keep track of polling attempts
  const MAX_ATTEMPTS = 5; // Set the maximum polling attempts

  const locationState = useLocation().state; // Access the state passed during navigation
  const [providerId, setProviderId] = useState(
    locationState?.providerId || null
  );
  const [bookingId, setBookingId] = useState(locationState?.bookingId || null); // Get bookingId from state
  const booking = useState(locationState?.booking || null);

  const userId = Cookies.get("token")
    ? jwtDecode(Cookies.get("token")).id
    : null;
  const navigate = useNavigate();

  const fetchDistance = async (userAddress, providerAddress) => {
    try {
      const token = Cookies.get("token");

      const distanceResponse = await axios.get(
        `http://localhost:3300/api/v1/distance/distancematrix`,
        {
          params: {
            origins: userAddress,
            destinations: providerAddress,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (
        distanceResponse.data.rows &&
        distanceResponse.data.rows[0].elements[0].duration
      ) {
        setTime(distanceResponse.data.rows[0].elements[0].duration.text);
      } else {
        setError("Unable to calculate travel time.");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Error fetching distance data.";
      setError(errorMessage);
    }
  };

  useEffect(() => {
    console.log("OTP updated:", otp);
  }, [otp]);

  useEffect(() => {
    let interval;

    const fetchProviderLocation = async () => {
      try {
        if (!locationState || !locationState.bookingId) {
          setError("Booking ID not found.");
          return;
        }

        const bookingId = locationState.bookingId;
        const token = Cookies.get("token");

        const bookingResponse = await axios.get(
          `http://localhost:3300/api/v1/booking/getbooking`,
          {
            params: { bookingId },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(bookingResponse);

        const { latitude, longitude, otp } = bookingResponse.data.booking;
        const userAddress = bookingResponse.data.booking.user.address;

        if (latitude && longitude) {
          // Stop polling after getting the location
          setLocation(`Latitude: ${latitude}, Longitude: ${longitude}`);
          setOtp(otp);
          setLoading(false);

          // Clear interval to stop further polling
          clearInterval(interval);

          // Fetch provider address only if not already available
          if (!address) {
            const apiKey = "pk.3687b6d15643499519168bf1c0e1e7df"; // Replace with your API key
            const geocodeUrl = `https://us1.locationiq.com/v1/reverse?key=${apiKey}&lat=${latitude}&lon=${longitude}&format=json`;
            const locationResponse = await axios.get(geocodeUrl);

            if (locationResponse.data.display_name) {
              setAddress(locationResponse.data.display_name);

              // After both addresses are fetched, calculate distance
              fetchDistance(userAddress, locationResponse.data.display_name);
            } else {
              setError("Failed to get the address from the coordinates.");
            }
          }
        } else {
          // Poll only if location is not available and attempts are within limit
          if (pollAttempts < MAX_ATTEMPTS) {
            setPollAttempts(pollAttempts + 1);
          } else {
            setError("Location not shared yet.");
            setLoading(false);
            clearInterval(interval); // Stop polling if maximum attempts reached
          }
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error fetching location data.";
        setError(errorMessage);
        setLoading(false);
        clearInterval(interval); // Stop polling on error
      }
    };

    interval = setInterval(() => {
      fetchProviderLocation();
    }, 5000);

    return () => clearInterval(interval);
  }, [locationState, pollAttempts, address]);

  if (loading && !error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-200">
        <Bars height="80" width="80" color="#5ab9c1" ariaLabel="bars-loading" />
        <p className="mt-4 text-gray-700">
          Please wait while the service provider is sharing their location...
        </p>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div className="text-center text-red-500">
  //       <p>Error: {error}</p>
  //       <p className="mt-2">Try refreshing the page</p>
  //     </div>
  //   );
  // }

  const handleStartChat = () => {
    if (bookingId && booking) {
      const conversationId = booking[0].conversationId;
      const userId = booking[0].userId;
      const providerId = booking[0].serviceProviderId;

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
      <div className="min-h-screen bg-gray-100 p-6 md:p-12 flex flex-col items-center">
        <h2 className="text-2xl font-bold text-center mb-4 mt-10">
          Provider Location
        </h2>
        <p className="text-lg text-center">{location}</p>
        {address && (
          <p className="text-lg text-center mt-2">
            <b>
              <i>Address:</i>
            </b>{" "}
            {address}
          </p>
        )}
        {time ? (
          <p className="text-lg text-center mt-2">
            <b>
              <i>Estimated Travel Time:</i>
            </b>{" "}
            {time}
          </p>
        ) : (
          <p className="text-lg text-center mt-2 text-red-600">
            Unable to get Travel Time currently.
          </p>
        )}
        {otp && (
          <p className="text-lg text-center mt-4 text-green-600">
            <b>
              <i>OTP for Work Start:</i>
            </b>{" "}
            {otp}
          </p>
        )}
        <button
          className={`mt-4 bg-blue-600 text-white px-6 py-2 rounded-md text-sm transition duration-300 ${
            loading || error
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-700"
          }`}
          onClick={handleStartChat}
          disabled={loading || error}
        >
          Start a Chat with your provider
        </button>
        {error && (
          <div className="mt-4 text-center text-red-500">
            <p>Error: {error}</p>
            <p className="mt-2">Please try refreshing the page.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Location;
